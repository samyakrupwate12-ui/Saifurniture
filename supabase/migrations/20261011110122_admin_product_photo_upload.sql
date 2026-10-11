-- Keep the deployed form working while the UI transitions to the DB's canonical value.
create or replace function public.normalize_sai_stock_status()
returns trigger language plpgsql security invoker set search_path = ''
as $$
begin
  if new.stock_status = 'in_stock' then new.stock_status := 'available'; end if;
  return new;
end;
$$;
revoke all on function public.normalize_sai_stock_status() from public, anon, authenticated;
create trigger normalize_sai_stock_status
before insert or update of stock_status on public.products
for each row execute function public.normalize_sai_stock_status();

-- Use the same category names/slugs already displayed by the storefront.
insert into public.categories (name, slug, is_active)
values ('Sofas', 'sofas', true), ('Beds', 'beds', true),
       ('Dining', 'dining', true), ('Chairs', 'chairs', true),
       ('Storage', 'storage', true), ('TV Units', 'tv-units', true)
on conflict (slug) do nothing;

-- Product photos are public catalogue assets; only active admins may mutate them.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 5242880,
        array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do nothing;

create policy "Sai admins read product storage"
on storage.objects for select to authenticated
using (bucket_id = 'product-images' and (select public.is_sai_admin()));
create policy "Sai admins upload product storage"
on storage.objects for insert to authenticated
with check (bucket_id = 'product-images' and (storage.foldername(name))[1] = 'products'
            and (select public.is_sai_admin()));
create policy "Sai admins update product storage"
on storage.objects for update to authenticated
using (bucket_id = 'product-images' and (select public.is_sai_admin()))
with check (bucket_id = 'product-images' and (storage.foldername(name))[1] = 'products'
            and (select public.is_sai_admin()));
create policy "Sai admins delete product storage"
on storage.objects for delete to authenticated
using (bucket_id = 'product-images' and (select public.is_sai_admin()));

-- Atomic replacement prevents failed inserts from erasing the existing gallery.
create or replace function public.replace_sai_product_images(p_product_id uuid, p_images jsonb)
returns void language plpgsql security invoker set search_path = ''
as $$
begin
  if not coalesce(public.is_sai_admin(), false) then
    raise exception 'Administrator access required' using errcode = '42501';
  end if;
  if p_images is null or jsonb_typeof(p_images) <> 'array' then
    raise exception 'Images must be an array' using errcode = '22023';
  end if;
  if jsonb_array_length(p_images) > 12 then
    raise exception 'Maximum 12 product images' using errcode = '22023';
  end if;
  -- Serialize replacements for the same product.
  perform 1 from public.products where id = p_product_id for update;
  if not found then
    raise exception 'Product not found' using errcode = 'P0002';
  end if;
  delete from public.product_images where product_id = p_product_id;
  insert into public.product_images (product_id, image_url, storage_path, alt_text, display_order)
  select p_product_id, image_url, storage_path, alt_text, display_order
  from jsonb_to_recordset(p_images) as images(
    image_url text, storage_path text, alt_text text, display_order integer
  );
end;
$$;
revoke all on function public.replace_sai_product_images(uuid, jsonb) from public, anon;
grant execute on function public.replace_sai_product_images(uuid, jsonb) to authenticated;
