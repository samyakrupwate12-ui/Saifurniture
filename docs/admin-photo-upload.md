# Admin product photos and categories

The product editor previously accepted only URLs. No Storage bucket existed, and
the form submitted `in_stock` although the database accepts `available`.
The database category table was empty despite six categories in the static homepage.

Migration `20261011110122_admin_product_photo_upload.sql` is applied to the dedicated
Sai Furniture project. It adds the six existing storefront categories (without
overwriting existing slugs), normalizes legacy `in_stock` writes to `available`,
creates the public `product-images` bucket with active-admin mutation policies,
and adds the SECURITY INVOKER `replace_sai_product_images` function. Existing RLS
and the stock-status constraint remain enabled. No service-role key is used.

The editor uploads directly to Storage using the signed-in admin's cookie session.
Only image URLs go through the Server Action, so photos do not hit the action's
request-body limit. JPG, PNG, WebP and AVIF are supported up to 5 MiB each and 12
photos per product. File limits are also enforced by the bucket. Save is disabled
while uploading; individual successes survive a later upload failure. New products
start without a stock placeholder photo. Supported hosted links remain available.

Image metadata replacement is transactional. A failed replacement preserves the
previous gallery and returns the saved product ID, allowing retry without creating
a duplicate product. Removing a photo detaches it on Save; it does not delete the
underlying file. Cancelled uploads may leave unreferenced objects; storage cleanup
should only remove files verified to be unused. Product photos in this bucket are
public, including photos for drafts, and must not contain private documents.

Category loading errors now surface instead of appearing as an empty dropdown.
The product editor links to `/admin/categories` to add or manage categories.

Verification:

- `npm run build` and TypeScript pass.
- `node --test tests/product-images.test.mjs` covers file boundaries and URL validation.
- `tests/admin-product-regression.sql` exercises stock normalization, category
  visibility, image save/removal, rollback on image failure, and permission denial.
  All temporary database records are rolled back.
- The changed upload component/helpers pass ESLint. Full-repository lint still
  reports pre-existing `any` and unused-import issues outside this fix.
- Security advisors report only the existing disabled leaked-password protection:
  https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection

The database repair is live. The frontend must be merged and deployed to expose
the file picker. A real signed-in browser upload still needs an end-to-end check;
no administrator password was requested, reset, or impersonated.
