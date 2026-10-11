begin;
select set_config('request.jwt.claim.sub', (select user_id::text from public.admin_users where is_active limit 1), true);
set local role authenticated;
do $test$
declare
  product_uuid uuid;
  actual_status text;
  original_image uuid;
begin
  if not public.is_sai_admin() then raise exception 'Admin setup failed'; end if;
  if (select count(*) from public.categories where slug in ('sofas','beds','dining','chairs','storage','tv-units')) <> 6 then
    raise exception 'Admin categories missing';
  end if;
  insert into public.products(name,slug,stock_status,is_published)
  values ('Temporary regression check','upload-check-' || gen_random_uuid(), 'in_stock',false)
  returning id, stock_status into product_uuid,actual_status;
  if actual_status <> 'available' then raise exception 'Legacy stock conversion failed'; end if;
  update public.products set stock_status='made_to_order' where id=product_uuid;
  update public.products set stock_status='out_of_stock' where id=product_uuid;
  update public.products set stock_status='available' where id=product_uuid;
  begin
    update public.products set stock_status='invalid' where id=product_uuid;
    raise exception 'Invalid status unexpectedly accepted';
  exception when check_violation then null;
  end;
  perform public.replace_sai_product_images(product_uuid,
    '[{"image_url":"https://images.unsplash.com/regression-test","storage_path":null,"alt_text":"Test","display_order":0}]'::jsonb);
  select id into original_image from public.product_images where product_id=product_uuid;
  if original_image is null then raise exception 'Image save failed'; end if;
  begin
    perform public.replace_sai_product_images(product_uuid, '[{"image_url":null,"display_order":0}]'::jsonb);
    raise exception 'Invalid image unexpectedly accepted';
  exception when not_null_violation then null;
  end;
  if not exists(select 1 from public.product_images where id=original_image) then
    raise exception 'Previous gallery was lost';
  end if;
  perform public.replace_sai_product_images(product_uuid, '[]'::jsonb);
  if exists(select 1 from public.product_images where product_id=product_uuid) then
    raise exception 'Clear gallery failed';
  end if;
end;
$test$;
reset role;
select set_config('request.jwt.claim.sub',gen_random_uuid()::text,true);
set local role authenticated;
do $test$
begin
  if public.is_sai_admin() then raise exception 'Non-admin incorrectly authorized'; end if;
  begin
    perform public.replace_sai_product_images(gen_random_uuid(), '[]'::jsonb);
    raise exception 'Non-admin could replace images';
  exception when insufficient_privilege then null;
  end;
end;
$test$;
reset role;
do $test$
begin
  if has_function_privilege('anon','public.replace_sai_product_images(uuid,jsonb)','execute') then
    raise exception 'Anon has image mutation access';
  end if;
  if not exists(select 1 from storage.buckets where id='product-images'
    and public and file_size_limit=5242880
    and allowed_mime_types=array['image/jpeg','image/png','image/webp','image/avif']) then
    raise exception 'Bucket configuration mismatch';
  end if;
  if (select count(*) from pg_policies where schemaname='storage' and tablename='objects'
    and policyname like 'Sai admins % product storage') <> 4 then
    raise exception 'Missing storage policies';
  end if;
end;
$test$;
rollback;
select 'PASS: stock statuses, six admin categories, image save/remove/rollback, non-admin and anonymous denial, bucket and policies' as regression_checks;
