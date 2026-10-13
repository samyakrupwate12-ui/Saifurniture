# Enquiry and quotation repair

The previous UI used enquiry `customer_phone`/`customer_email` fields where the
database stores `phone`/`email`, and offered statuses absent from the database.
Quotation writes used incorrect amount and line-item field names, plus an address
field absent from the schema. Public enquiry writes had no permitted insert path.

This repair aligns the inbox, dashboard, enquiry details, quotation editor and
server actions with the live schema. Enquiry-to-quotation navigation uses only
the enquiry ID and loads customer/product information after server admin checks,
instead of putting contact information in URLs. New quotations have a blank first
item and an explicitly editable tax rate rather than an invented product/price.

Migration `20261011111747_admin_enquiries_quotations.sql` was applied to the dedicated
Sai Furniture database on October 11, 2026. It adds quotation address/tax-rate fields,
an active-admin-only SECURITY INVOKER quotation-save function, and a narrow public
enquiry insert policy. Anonymous users can insert only customer enquiry fields;
they cannot read customer records, set private notes/status, or save quotations.
RLS remains enabled. Published, non-archived products are required for product enquiries.

Quotation header, line-item snapshots, monetary calculations and the applicable
enquiry-status update save atomically. Failed item inserts preserve the original
quotation. Drafts do not mark enquiries as sent; closed/converted enquiry states
are not overwritten. Editing retains the saved tax rate and quotation number.
The database calculates totals using numeric arithmetic, rounded to two decimals.
The editor uses the same convention for its preview and requires a customer phone.
Placeholder showroom contact details were removed from the printable quotation.

Verification commands:

```sh
node --test tests/admin-sales-validation.test.mjs tests/product-images.test.mjs
npm run build
```

`tests/admin-sales-regression.sql` verifies public inserts, private reads, status
updates, quotation creation/editing/totals, atomic rollback, and unauthorized access
denial. It rolls back all test data. Six JavaScript validation tests, the database
checks, TypeScript, the production build, and ESLint on changed application files pass.
Full-repository lint still has pre-existing issues elsewhere. An HTTP test against
the production build returned 400 for a fractional quantity and 200/success for a
valid anonymous enquiry, using synthetic contact details.

No real administrator session was used for an end-to-end browser test. After merging
and deployment, submit a storefront enquiry, find it in the inbox, save notes/status,
create a quotation from it, then save/reopen/print and check amounts and tax rate.

Security notes: the existing in-memory route rate limit is best-effort and not shared
across serverless instances. Direct permitted database inserts bypass that route;
durable anti-spam/CAPTCHA remains a separate hardening task. Customer records remain
private. Supabase advisors last reported only the existing disabled leaked-password
protection warning:
https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection
