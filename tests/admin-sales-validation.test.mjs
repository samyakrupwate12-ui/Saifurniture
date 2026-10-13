import assert from "node:assert/strict";
import { after, test } from "node:test";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";

const loadModule = createRequire(import.meta.url);
const output = mkdtempSync(join(tmpdir(), "sai-sales-test-"));
after(() => rmSync(output, { recursive: true, force: true }));
execFileSync(process.execPath, [loadModule.resolve("typescript/bin/tsc"), "--outDir", output,
  "--target", "es2022", "--module", "commonjs", "--skipLibCheck", "lib/enquiries.ts", "lib/quotations.ts"]);
const { parseEnquiryPayload } = loadModule(join(output, "enquiries.js"));
const { parseQuotationForm, quotationTotals } = loadModule(join(output, "quotations.js"));

function quotationForm() {
  const form = new FormData();
  for (const [key, value] of Object.entries({ customer_name: "Test Customer", customer_phone: "0000000000",
    discount: "10.01", tax_rate: "5", delivery_charge: "25.50", "item_name[]": "Chair",
    "item_description[]": "Wood", "item_quantity[]": "3", "item_unit_price[]": "199.99", "item_product_id[]": "" })) {
    form.append(key, value);
  }
  return form;
}

test("enquiries map contact fields and reject invalid quantity, email and product IDs", () => {
  const good = { customer_name: "Test Customer", customer_phone: "0000000000", customer_email: "test@example.invalid", quantity: 2 };
  assert.equal(parseEnquiryPayload(good).phone, "0000000000");
  for (const quantity of [0, 1.5, 51, Infinity]) assert.throws(() => parseEnquiryPayload({ ...good, quantity }));
  assert.throws(() => parseEnquiryPayload({ ...good, product_id: "mock-product" }));
  assert.throws(() => parseEnquiryPayload({ ...good, customer_email: "invalid" }));
  const safe = parseEnquiryPayload({ ...good, status: "converted", internal_notes: "injected" });
  assert.equal(safe.status, undefined);
  assert.equal(safe.internal_notes, undefined);
});

test("quotation mapping and decimal totals agree with the database regression", () => {
  const result = parseQuotationForm(quotationForm());
  assert.equal(result.items[0].product_name, "Chair");
  assert.equal(result.quotation.delivery_charges, 25.50);
  assert.deepEqual(quotationTotals(result.items, 10.01, 5, 25.50), { subtotal: 599.97, tax_amount: 29.5, total_amount: 644.96 });
});

test("malformed quotation inputs are rejected before any database write", () => {
  for (const [key, value] of [["item_quantity[]", "1.5"], ["item_unit_price[]", "Infinity"],
    ["discount", "600"], ["tax_rate", "101"], ["valid_until", "2026-02-30"],
    ["customer_phone", ""], ["item_name[]", ""], ["status", "invented"]]) {
    const form = quotationForm(); form.set(key, value);
    assert.throws(() => parseQuotationForm(form));
  }
  const form = quotationForm(); form.delete("item_quantity[]");
  assert.throws(() => parseQuotationForm(form));
});
