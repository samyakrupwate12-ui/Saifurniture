-- Public customers may submit only enquiry fields. Customer records stay private.
grant insert (customer_name, phone, email, product_id, quantity, message)
on public.enquiries to anon;
create policy "Customers submit new enquiries"
on public.enquiries for insert to anon, authenticated
with check (
  status = 'new' and internal_notes is null
  and char_length(btrim(customer_name)) between 2 and 100
  and phone ~ '^[+0-9 ()-]{8,20}$'
  and char_length(regexp_replace(phone, '[^0-9]', '', 'g')) >= 8
  and (email is null or (char_length(email) <= 254 and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'))
  and quantity between 1 and 50
  and (message is null or char_length(message) <= 2000)
  and (product_id is null or exists (
    select 1 from public.products p where p.id = product_id and p.is_published and not p.is_archived
  ))
);

alter table public.quotations
  add column customer_address text,
  add column tax_rate numeric(5,2) not null default 0 check (tax_rate between 0 and 100);

-- Snapshot prices and all totals are calculated within one admin-authorized transaction.
create or replace function public.save_sai_quotation(p_id uuid, p_quotation jsonb, p_items jsonb)
returns uuid language plpgsql security invoker set search_path = ''
as $$
declare
  v_id uuid := coalesce(p_id, gen_random_uuid());
  v_item jsonb;
  v_quantity integer;
  v_price numeric;
  v_subtotal numeric := 0;
  v_discount numeric := coalesce((p_quotation->>'discount')::numeric, 0);
  v_delivery numeric := coalesce((p_quotation->>'delivery_charges')::numeric, 0);
  v_rate numeric := coalesce((p_quotation->>'tax_rate')::numeric, 0);
  v_tax numeric;
  v_total numeric;
  v_status text := coalesce(p_quotation->>'status', 'draft');
  v_enquiry uuid := nullif(p_quotation->>'enquiry_id','')::uuid;
begin
  if not coalesce(public.is_sai_admin(), false) then
    raise exception 'Administrator access required' using errcode='42501';
  end if;
  if p_quotation is null or jsonb_typeof(p_quotation) <> 'object'
     or p_items is null or jsonb_typeof(p_items) <> 'array' then
    raise exception 'Invalid quotation payload' using errcode='22023';
  end if;
  if jsonb_array_length(p_items) not between 1 and 100
     or char_length(btrim(coalesce(p_quotation->>'customer_name',''))) not between 2 and 100
     or coalesce(p_quotation->>'customer_phone','') !~ '^[+0-9 ()-]{8,20}$'
     or char_length(regexp_replace(coalesce(p_quotation->>'customer_phone',''),'[^0-9]','','g')) < 8
     or char_length(coalesce(p_quotation->>'customer_address','')) > 1000
     or char_length(coalesce(p_quotation->>'terms','')) > 10000
     or v_status not in ('draft','sent','accepted','rejected','expired') then
    raise exception 'Invalid quotation details' using errcode='22023';
  end if;
  if nullif(p_quotation->>'customer_email','') is not null and (
    char_length(p_quotation->>'customer_email') > 254
    or (p_quotation->>'customer_email') !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  ) then raise exception 'Invalid customer email' using errcode='22023'; end if;
  if not (v_discount between 0 and 1000000000 and v_delivery between 0 and 1000000000 and v_rate between 0 and 100)
     or round(v_discount,2) <> v_discount or round(v_delivery,2) <> v_delivery or round(v_rate,2) <> v_rate then
    raise exception 'Invalid quotation amounts' using errcode='22023';
  end if;
  for v_item in select value from jsonb_array_elements(p_items) loop
    if jsonb_typeof(v_item) <> 'object'
       or char_length(btrim(coalesce(v_item->>'product_name',''))) not between 1 and 200
       or char_length(coalesce(v_item->>'product_description','')) > 2000
       or not coalesce((v_item->>'quantity')::numeric between 1 and 10000, false)
       or (v_item->>'quantity')::numeric <> trunc((v_item->>'quantity')::numeric)
       or not coalesce((v_item->>'unit_price')::numeric between 0 and 1000000000, false)
       or round((v_item->>'unit_price')::numeric,2) <> (v_item->>'unit_price')::numeric then
      raise exception 'Invalid quotation item' using errcode='22023';
    end if;
    v_quantity := (v_item->>'quantity')::integer;
    v_price := (v_item->>'unit_price')::numeric;
    v_subtotal := v_subtotal + v_quantity * v_price;
  end loop;
  if v_discount > v_subtotal then
    raise exception 'Discount exceeds subtotal' using errcode='22023';
  end if;
  v_tax := round((v_subtotal - v_discount) * v_rate / 100, 2);
  v_total := v_subtotal - v_discount + v_tax + v_delivery;

  if p_id is not null then
    perform 1 from public.quotations where id=p_id for update;
    if not found then raise exception 'Quotation not found' using errcode='P0002'; end if;
    update public.quotations set
      enquiry_id=v_enquiry, customer_name=btrim(p_quotation->>'customer_name'),
      customer_phone=btrim(p_quotation->>'customer_phone'), customer_email=nullif(p_quotation->>'customer_email',''),
      customer_address=nullif(p_quotation->>'customer_address',''), status=v_status,
      subtotal=v_subtotal, discount=v_discount, delivery_charges=v_delivery,
      tax_rate=v_rate, tax_amount=v_tax, total_amount=v_total,
      valid_until=nullif(p_quotation->>'valid_until','')::date, terms=nullif(p_quotation->>'terms',''),
      updated_at=now()
    where id=p_id;
  else
    insert into public.quotations (id, quotation_number, enquiry_id, customer_name, customer_phone, customer_email,
      customer_address, status, subtotal, discount, delivery_charges, tax_rate, tax_amount, total_amount, valid_until, terms)
    values (v_id, 'QT-' || to_char(current_date,'YYYY') || '-' || upper(substr(replace(v_id::text,'-',''),1,12)),
      v_enquiry, btrim(p_quotation->>'customer_name'), btrim(p_quotation->>'customer_phone'), nullif(p_quotation->>'customer_email',''),
      nullif(p_quotation->>'customer_address',''), v_status, v_subtotal, v_discount, v_delivery, v_rate, v_tax, v_total,
      nullif(p_quotation->>'valid_until','')::date, nullif(p_quotation->>'terms',''));
  end if;
  delete from public.quotation_items where quotation_id=v_id;
  insert into public.quotation_items (quotation_id, product_id, product_name, product_description, quantity, unit_price, discount, line_total)
  select v_id, nullif(item->>'product_id','')::uuid, btrim(item->>'product_name'), nullif(item->>'product_description',''),
    (item->>'quantity')::integer, (item->>'unit_price')::numeric, 0,
    (item->>'quantity')::integer * (item->>'unit_price')::numeric
  from jsonb_array_elements(p_items) as entries(item);

  -- Drafts are not sent quotations; do not overwrite converted/closed enquiries.
  if v_enquiry is not null and v_status='sent' then
    update public.enquiries set status='quotation_sent', updated_at=now()
    where id=v_enquiry and status in ('new','contacted','quotation_sent');
  end if;
  return v_id;
end;
$$;
revoke all on function public.save_sai_quotation(uuid,jsonb,jsonb) from public, anon;
grant execute on function public.save_sai_quotation(uuid,jsonb,jsonb) to authenticated;
