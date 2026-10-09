-- Preserve all data and RLS policies; restrict application-role privileges.
revoke all on public.admin_users, public.categories, public.products, public.product_images,
  public.enquiries, public.quotations, public.quotation_items from anon, authenticated;
grant select on public.categories, public.products, public.product_images to anon;
grant select on public.admin_users to authenticated;
grant select, insert, update, delete on public.categories, public.products, public.product_images,
  public.enquiries, public.quotations, public.quotation_items to authenticated;

-- admin_users SELECT is self-only and does not call this function.
create or replace function public.is_sai_admin()
returns boolean language sql stable security invoker set search_path = ''
as $function$
  select exists (
    select 1 from public.admin_users
    where user_id = (select auth.uid()) and is_active = true
  );
$function$;
revoke all on function public.is_sai_admin() from public, anon;
grant execute on function public.is_sai_admin() to authenticated;
revoke all on function public.rls_auto_enable() from public, anon, authenticated;
