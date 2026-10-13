begin;
select set_config('sai.test_enquiry',gen_random_uuid()::text,true);
select set_config('sai.test_published',gen_random_uuid()::text,true);
select set_config('sai.test_hidden',gen_random_uuid()::text,true);
insert into public.products(id,name,slug,is_published)
values (current_setting('sai.test_published')::uuid,'Temporary published check','check-'||gen_random_uuid(),true),
       (current_setting('sai.test_hidden')::uuid,'Temporary draft check','check-'||gen_random_uuid(),false);
set local role anon;
insert into public.enquiries(customer_name,phone,email,product_id,quantity,message)
values('Temporary regression check','0000000000','check@example.invalid',current_setting('sai.test_published')::uuid,2,current_setting('sai.test_enquiry'));
do $test$
begin
  begin
    perform id from public.enquiries;
    raise exception 'Anonymous enquiry read unexpectedly succeeded';
  exception when insufficient_privilege then null;
  end;
  begin
    insert into public.enquiries(customer_name,phone,quantity) values('Invalid quantity check','0000000000',0);
    raise exception 'Invalid quantity accepted';
  exception when insufficient_privilege then null;
  end;
  begin
    insert into public.enquiries(customer_name,phone,product_id) values('Hidden product check','0000000000',current_setting('sai.test_hidden')::uuid);
    raise exception 'Draft product enquiry accepted';
  exception when insufficient_privilege then null;
  end;
  begin
    insert into public.enquiries(customer_name,phone,status) values('Status override check','0000000000','converted');
    raise exception 'Public status override accepted';
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.save_sai_quotation(null,'{}','[]');
    raise exception 'Anonymous quotation save accepted';
  exception when insufficient_privilege then null;
  end;
end;
$test$;
reset role;
select set_config('request.jwt.claim.sub',(select user_id::text from public.admin_users where is_active limit 1),true);
set local role authenticated;
do $test$
declare
  e uuid;
  q uuid;
  q_number text;
  item_id uuid;
  quote_data jsonb;
  items jsonb := '[{"product_name":"Test chair","product_description":"Snapshot","quantity":3,"unit_price":199.99}]';
  next_status text;
begin
  select id into e from public.enquiries where message=current_setting('sai.test_enquiry');
  if e is null then raise exception 'Admin cannot read submitted enquiry'; end if;
  foreach next_status in array array['new','contacted','quotation_sent','converted','closed','new'] loop
    update public.enquiries set status=next_status,internal_notes='Private test note' where id=e;
  end loop;
  quote_data := jsonb_build_object('customer_name','Temporary regression check','customer_phone','0000000000',
    'customer_email','check@example.invalid','customer_address','Test address','enquiry_id',e,'status','draft',
    'discount',10.01,'delivery_charges',25.50,'tax_rate',5,'valid_until','2026-12-31','terms','Test terms');
  q := public.save_sai_quotation(null,quote_data,items);
  if not exists(select 1 from public.quotations where id=q and subtotal=599.97 and tax_amount=29.50 and total_amount=644.96 and tax_rate=5 and customer_address='Test address') then
    raise exception 'Quotation totals or stored fields incorrect';
  end if;
  if (select status from public.enquiries where id=e) <> 'new' then raise exception 'Draft marked enquiry as sent'; end if;
  select quotation_number into q_number from public.quotations where id=q;
  select id into item_id from public.quotation_items where quotation_id=q;
  begin
    perform public.save_sai_quotation(q,quote_data || '{"customer_name":"Must roll back"}',
      jsonb_build_array(jsonb_build_object('product_id',gen_random_uuid(),'product_name','Invalid FK','quantity',1,'unit_price',1000)));
    raise exception 'Invalid item FK accepted';
  exception when foreign_key_violation then null;
  end;
  if not exists(select 1 from public.quotation_items where id=item_id)
     or (select customer_name from public.quotations where id=q) <> 'Temporary regression check' then
    raise exception 'Failed save erased or changed previous quotation';
  end if;
  perform public.save_sai_quotation(q,quote_data || '{"status":"sent","tax_rate":12}',items);
  if (select status from public.enquiries where id=e) <> 'quotation_sent'
     or not exists(select 1 from public.quotations where id=q and quotation_number=q_number and tax_amount=70.80 and total_amount=686.26) then
    raise exception 'Quotation edit or enquiry status update failed';
  end if;
  update public.enquiries set status='converted' where id=e;
  perform public.save_sai_quotation(q,quote_data || '{"status":"sent"}',items);
  if (select status from public.enquiries where id=e) <> 'converted' then raise exception 'Converted enquiry overwritten'; end if;
  begin
    perform public.save_sai_quotation(null,quote_data,'[{"product_name":"Bad qty","quantity":1.5,"unit_price":100}]');
    raise exception 'Fractional quantity accepted';
  exception when invalid_parameter_value then null;
  end;
end;
$test$;
reset role;
select set_config('request.jwt.claim.sub',gen_random_uuid()::text,true);
set local role authenticated;
do $test$
begin
  if exists(select 1 from public.enquiries) then raise exception 'Non-admin can read customer enquiries'; end if;
  if exists(select 1 from public.quotations) then raise exception 'Non-admin can read quotations'; end if;
  begin
    perform public.save_sai_quotation(null,'{}','[]');
    raise exception 'Non-admin can save quotations';
  exception when insufficient_privilege then null;
  end;
end;
$test$;
rollback;
select 'PASS: public submission, private records, valid statuses, quotation create/edit/calculations, snapshot rollback, draft/sent handling and authorization' as regression_checks;
