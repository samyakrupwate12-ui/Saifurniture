export const ENQUIRY_STATUSES = ["new", "contacted", "quotation_sent", "converted", "closed"] as const;
export const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function validateContact(name: string, phone: string, email: string | null) {
  if (name.length < 2 || name.length > 100) throw new Error("Enter a customer name between 2 and 100 characters.");
  if (!/^[+0-9 ()-]{8,20}$/.test(phone) || phone.replace(/\D/g, "").length < 8) {
    throw new Error("Enter a valid customer phone number.");
  }
  if (email && (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
    throw new Error("Enter a valid email address.");
  }
}

export function parseEnquiryPayload(body: unknown) {
  if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error("Invalid enquiry request.");
  const values = body as Record<string, unknown>;
  const customer_name = String(values.customer_name ?? "").trim();
  const phone = String(values.customer_phone ?? "").trim();
  const email = String(values.customer_email ?? "").trim() || null;
  const product_id = String(values.product_id ?? "").trim() || null;
  const quantity = Number(values.quantity ?? 1);
  const message = String(values.message ?? "").trim() || null;
  validateContact(customer_name, phone, email);
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 50) throw new Error("Quantity must be a whole number from 1 to 50.");
  if (product_id && !UUID_PATTERN.test(product_id)) throw new Error("Selected product is not available for enquiry.");
  if (message && message.length > 2000) throw new Error("Enquiry message is too long (max 2000 characters).");
  return { customer_name, phone, email, product_id, quantity, message };
}
