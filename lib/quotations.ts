import { UUID_PATTERN, validateContact } from "./enquiries";

export const QUOTATION_STATUSES = ["draft", "sent", "accepted", "rejected", "expired"] as const;

export function quotationTotals(items: { quantity: number; unit_price: number }[], discount: number, taxRate: number, delivery: number) {
  const cents = (value: number) => Math.round((value + Number.EPSILON) * 100);
  const subtotalCents = items.reduce((sum, item) => sum + cents(item.unit_price) * item.quantity, 0);
  const taxableCents = Math.max(0, subtotalCents - cents(discount));
  const taxCents = Math.round(taxableCents * taxRate / 100);
  return { subtotal: subtotalCents / 100, tax_amount: taxCents / 100, total_amount: (taxableCents + taxCents + cents(delivery)) / 100 };
}

export function parseQuotationForm(form: FormData) {
  const text = (key: string) => String(form.get(key) ?? "").trim();
  const optionalId = (key: string) => {
    const value = text(key);
    if (value && !UUID_PATTERN.test(value)) throw new Error(`Invalid ${key.replaceAll("_", " ")}.`);
    return value || null;
  };
  const amount = (value: unknown, label: string, max = 1_000_000_000) => {
    const number = Number(value);
    if (!Number.isFinite(number) || number < 0 || number > max || Math.abs(number * 100 - Math.round(number * 100)) > 0.00001) {
      throw new Error(`${label} must be a valid non-negative amount with at most two decimal places.`);
    }
    return number;
  };
  const customer_name = text("customer_name");
  const customer_phone = text("customer_phone");
  const customer_email = text("customer_email") || null;
  validateContact(customer_name, customer_phone, customer_email);
  const status = text("status") || "draft";
  if (!QUOTATION_STATUSES.some((s) => s === status)) throw new Error("Choose a valid quotation status.");
  const valid_until = text("valid_until") || null;
  if (valid_until && (!/^\d{4}-\d{2}-\d{2}$/.test(valid_until) || !Number.isFinite(Date.parse(valid_until)) || new Date(valid_until).toISOString().slice(0, 10) !== valid_until)) throw new Error("Enter a valid expiry date.");
  if (text("customer_address").length > 1000 || text("terms").length > 10000) throw new Error("Address or terms are too long.");
  const names = form.getAll("item_name[]");
  const descriptions = form.getAll("item_description[]");
  const quantities = form.getAll("item_quantity[]");
  const prices = form.getAll("item_unit_price[]");
  const products = form.getAll("item_product_id[]");
  if (!names.length || names.length > 100 || [descriptions, quantities, prices, products].some((values) => values.length !== names.length)) throw new Error("Add between 1 and 100 complete quotation items.");
  const items = names.map((name, i) => {
    const product_name = String(name).trim();
    const product_description = String(descriptions[i]).trim() || null;
    const quantity = Number(quantities[i]);
    const product_id = String(products[i]).trim() || null;
    if (!product_name || product_name.length > 200 || (product_description?.length ?? 0) > 2000) throw new Error(`Enter a valid name and description for item ${i + 1}.`);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10000) throw new Error(`Item ${i + 1} quantity must be a whole number from 1 to 10000.`);
    if (product_id && !UUID_PATTERN.test(product_id)) throw new Error(`Invalid product for item ${i + 1}.`);
    return { product_id, product_name, product_description, quantity, unit_price: amount(prices[i], `Item ${i + 1} price`) };
  });
  const discount = amount(text("discount"), "Discount");
  if (discount > quotationTotals(items, 0, 0, 0).subtotal) throw new Error("Discount cannot exceed the items subtotal.");
  return {
    id: optionalId("id"),
    quotation: { customer_name, customer_phone, customer_email, customer_address: text("customer_address") || null,
      enquiry_id: optionalId("enquiry_id"), valid_until, terms: text("terms") || null, status, discount,
      delivery_charges: amount(text("delivery_charge"), "Delivery charge"), tax_rate: amount(text("tax_rate"), "Tax rate", 100) },
    items,
  };
}
