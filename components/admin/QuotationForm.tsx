"use client";

import React, { useActionState, useState } from "react";
import Link from "next/link";
import { saveQuotationAction } from "@/app/admin/admin-actions";
import { Plus, Trash2, Printer, Loader2, AlertCircle, Sparkles } from "lucide-react";
import type { DBQuotation, DBProduct, QuotationStatus } from "@/types/supabase";

interface LineItemState {
  product_id?: string | null;
  item_name: string;
  description?: string;
  quantity: number;
  unit_price: number;
}

interface QuotationFormProps {
  quotation?: DBQuotation | null;
  products: DBProduct[];
  defaultCustomerName?: string;
  defaultCustomerPhone?: string;
  defaultCustomerEmail?: string;
  defaultEnquiryId?: string;
}

export default function QuotationForm({
  quotation,
  products,
  defaultCustomerName = "",
  defaultCustomerPhone = "",
  defaultCustomerEmail = "",
  defaultEnquiryId = "",
}: QuotationFormProps) {
  const [state, action, pending] = useActionState(saveQuotationAction, { error: "" });

  const [customerName, setCustomerName] = useState(quotation?.customer_name || defaultCustomerName);
  const [customerPhone, setCustomerPhone] = useState(quotation?.customer_phone || defaultCustomerPhone);
  const [customerEmail, setCustomerEmail] = useState(quotation?.customer_email || defaultCustomerEmail);
  const [customerAddress, setCustomerAddress] = useState(quotation?.customer_address || "");
  const [validUntil, setValidUntil] = useState(quotation?.valid_until || "");
  const [terms, setTerms] = useState(quotation?.terms || "1. 50% advance upon order confirmation. 2. Balance due prior to dispatch. 3. Prices valid for 30 days.");
  const [status, setStatus] = useState<QuotationStatus>(quotation?.status || "draft");

  const [discount, setDiscount] = useState<number>(quotation?.discount || 0);
  const [deliveryCharge, setDeliveryCharge] = useState<number>(quotation?.delivery_charge || 0);
  const [taxRate, setTaxRate] = useState<number>(quotation ? (quotation.tax > 0 ? 18 : 0) : 18);

  const initialItems: LineItemState[] = quotation?.quotation_items && quotation.quotation_items.length > 0
    ? quotation.quotation_items.map((it) => ({
        product_id: it.product_id,
        item_name: it.item_name,
        description: it.description || "",
        quantity: it.quantity,
        unit_price: it.unit_price,
      }))
    : [
        {
          product_id: null,
          item_name: "Handcrafted Solid Teak Dining Set",
          description: "6-seater dining table with upholstered chairs",
          quantity: 1,
          unit_price: 32000,
        },
      ];

  const [items, setItems] = useState<LineItemState[]>(initialItems);

  const handleAddItem = () => {
    setItems([
      ...items,
      { product_id: null, item_name: "", description: "", quantity: 1, unit_price: 0 },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleItemProductSelect = (index: number, productId: string) => {
    const matchedProduct = products.find((p) => p.id === productId);
    const updated = [...items];
    if (matchedProduct) {
      updated[index] = {
        product_id: matchedProduct.id,
        item_name: matchedProduct.name,
        description: `${matchedProduct.material || "Solid Wood"} - ${matchedProduct.dimensions || ""}`,
        quantity: 1,
        unit_price: matchedProduct.selling_price,
      };
    } else {
      updated[index].product_id = null;
    }
    setItems(updated);
  };

  const handleItemChange = (index: number, field: keyof LineItemState, value: any) => {
    const updated = [...items];
    (updated[index] as any)[field] = value;
    setItems(updated);
  };

  // Live client-side calculation preview
  const subtotal = items.reduce((sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unit_price) || 0), 0);
  const taxableAmount = Math.max(0, subtotal - (Number(discount) || 0));
  const calculatedTax = Math.round((taxableAmount * (Number(taxRate) || 0)) / 100);
  const grandTotal = taxableAmount + calculatedTax + (Number(deliveryCharge) || 0);

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Printable Sheet View (Visible during Print) */}
      <div className="hidden print:block p-8 bg-white text-black font-sans space-y-6">
        <div className="flex justify-between items-start border-b border-black pb-4">
          <div>
            <h1 className="text-2xl font-bold font-serif">Sai Furniture</h1>
            <p className="text-xs text-gray-600">Sai Furniture, Furniture Market, 60 Feet Road, Ganjmal Shalimaar Nashik</p>
            <p className="text-xs text-gray-600">Phone: +91 98765 43210 | Email: sales@saifurniture.com</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold uppercase tracking-wider text-gray-800">Quotation</h2>
            <p className="text-xs font-mono font-bold mt-1">{quotation?.quotation_number || "ESTIMATE"}</p>
            <p className="text-xs text-gray-500">Date: {new Date().toLocaleDateString("en-IN")}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <h3 className="font-bold text-gray-700 uppercase tracking-wider mb-1">Quotation For:</h3>
            <p className="font-bold">{customerName}</p>
            <p>{customerPhone}</p>
            {customerEmail && <p>{customerEmail}</p>}
            {customerAddress && <p>{customerAddress}</p>}
          </div>
          {validUntil && (
            <div className="text-right">
              <h3 className="font-bold text-gray-700 uppercase tracking-wider mb-1">Validity:</h3>
              <p>Valid Until: {validUntil}</p>
            </div>
          )}
        </div>

        <table className="w-full text-left text-xs border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100 uppercase font-bold text-[10px]">
              <th className="border border-gray-300 p-2">Item & Description</th>
              <th className="border border-gray-300 p-2 text-center">Qty</th>
              <th className="border border-gray-300 p-2 text-right">Unit Price</th>
              <th className="border border-gray-300 p-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, idx) => (
              <tr key={idx}>
                <td className="border border-gray-300 p-2">
                  <p className="font-bold">{it.item_name}</p>
                  {it.description && <p className="text-[10px] text-gray-600">{it.description}</p>}
                </td>
                <td className="border border-gray-300 p-2 text-center">{it.quantity}</td>
                <td className="border border-gray-300 p-2 text-right">{formatPrice(it.unit_price)}</td>
                <td className="border border-gray-300 p-2 text-right">{formatPrice(it.quantity * it.unit_price)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end text-xs">
          <div className="w-64 space-y-1 text-right">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-red-600">
                <span>Discount:</span>
                <span>-{formatPrice(discount)}</span>
              </div>
            )}
            {calculatedTax > 0 && (
              <div className="flex justify-between">
                <span>GST ({taxRate}%):</span>
                <span>{formatPrice(calculatedTax)}</span>
              </div>
            )}
            {deliveryCharge > 0 && (
              <div className="flex justify-between">
                <span>Delivery Charge:</span>
                <span>{formatPrice(deliveryCharge)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-sm border-t border-black pt-2 mt-2">
              <span>Grand Total:</span>
              <span>{formatPrice(grandTotal)}</span>
            </div>
          </div>
        </div>

        {terms && (
          <div className="pt-4 border-t border-gray-200 text-[10px] text-gray-600 space-y-1">
            <p className="font-bold uppercase">Terms & Conditions:</p>
            <p className="whitespace-pre-line">{terms}</p>
          </div>
        )}
      </div>

      {/* Screen Editor Form (Hidden during Print) */}
      <form action={action} className="print:hidden space-y-8">
        {quotation?.id && <input type="hidden" name="id" value={quotation.id} />}
        {quotation?.quotation_number && <input type="hidden" name="quotation_number" value={quotation.quotation_number} />}
        {(defaultEnquiryId || quotation?.enquiry_id) && (
          <input type="hidden" name="enquiry_id" value={quotation?.enquiry_id || defaultEnquiryId} />
        )}

        {state?.error && (
          <div role="alert" className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{state.error}</span>
          </div>
        )}

        {/* Section 1: Customer & Quotation Info */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="font-serif font-bold text-base text-stone-900">Customer Details</h3>
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-stone-100 text-stone-800 hover:bg-[#5A3E2B] hover:text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" /> Print / Save PDF
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Customer Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="customer_name"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Ananya Sharma"
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-stone-50 border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#5A3E2B]/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="customer_phone"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-stone-50 border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#5A3E2B]/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="customer_email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-stone-50 border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#5A3E2B]/40"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Delivery Address (Optional)
              </label>
              <input
                type="text"
                name="customer_address"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                placeholder="e.g. Flat 402, Green Acres, Nashik"
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-stone-50 border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#5A3E2B]/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Validity Date
              </label>
              <input
                type="date"
                name="valid_until"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-stone-50 border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#5A3E2B]/40"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Line Items Table */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="font-serif font-bold text-base text-stone-900">Quotation Line Items</h3>
            <button
              type="button"
              onClick={handleAddItem}
              className="px-3 py-1.5 bg-[#5A3E2B] text-white text-xs font-semibold rounded-xl hover:bg-[#432D1F] flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add Item
            </button>
          </div>

          <div className="space-y-4">
            {items.map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  {/* Select catalogue product */}
                  <div className="sm:col-span-4">
                    <label className="block text-[10px] font-semibold text-stone-500 uppercase mb-1">
                      Link Catalogue Product (Optional)
                    </label>
                    <select
                      value={item.product_id || ""}
                      onChange={(e) => handleItemProductSelect(idx, e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-white border border-stone-300 text-stone-900"
                    >
                      <option value="">-- Custom Item Name --</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({formatPrice(p.selling_price)})
                        </option>
                      ))}
                    </select>
                    <input type="hidden" name="item_product_id[]" value={item.product_id || ""} />
                  </div>

                  {/* Item Title */}
                  <div className="sm:col-span-4">
                    <label className="block text-[10px] font-semibold text-stone-500 uppercase mb-1">
                      Item Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="item_name[]"
                      required
                      value={item.item_name}
                      onChange={(e) => handleItemChange(idx, "item_name", e.target.value)}
                      placeholder="e.g. Custom Dining Table"
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-white border border-stone-300 text-stone-900 font-semibold"
                    />
                  </div>

                  {/* Quantity */}
                  <div className="sm:col-span-1">
                    <label className="block text-[10px] font-semibold text-stone-500 uppercase mb-1">
                      Qty
                    </label>
                    <input
                      type="number"
                      name="item_quantity[]"
                      min={1}
                      required
                      value={item.quantity}
                      onChange={(e) => handleItemChange(idx, "quantity", Number(e.target.value))}
                      className="w-full px-2 py-1.5 text-xs rounded-lg bg-white border border-stone-300 text-stone-900 text-center"
                    />
                  </div>

                  {/* Unit Price */}
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-semibold text-stone-500 uppercase mb-1">
                      Unit Price (₹)
                    </label>
                    <input
                      type="number"
                      name="item_unit_price[]"
                      min={0}
                      required
                      value={item.unit_price}
                      onChange={(e) => handleItemChange(idx, "unit_price", Number(e.target.value))}
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-white border border-stone-300 text-stone-900"
                    />
                  </div>

                  {/* Delete Item */}
                  <div className="sm:col-span-1 text-right sm:pt-4">
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      disabled={items.length <= 1}
                      className="p-1.5 text-stone-400 hover:text-red-600 disabled:opacity-30"
                      title="Delete Line Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Sub-description input */}
                <div>
                  <input
                    type="text"
                    name="item_description[]"
                    value={item.description}
                    onChange={(e) => handleItemChange(idx, "description", e.target.value)}
                    placeholder="Short description or timber specifications for this item..."
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-white border border-stone-200 text-stone-600"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Summary Calculations & Terms */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
            <h3 className="font-serif font-bold text-base text-stone-900 border-b border-stone-100 pb-3">
              Quotation Terms & Status
            </h3>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Quotation Status</label>
              <select
                name="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-stone-50 border border-stone-300 text-stone-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#5A3E2B]/40"
              >
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="expired">Expired</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Terms & Conditions</label>
              <textarea
                name="terms"
                rows={4}
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-stone-50 border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#5A3E2B]/40"
              />
            </div>
          </div>

          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
            <h3 className="font-serif font-bold text-base text-stone-900 border-b border-stone-100 pb-3">
              Summary Calculations
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center text-stone-600">
                <span>Items Subtotal</span>
                <span className="font-semibold text-stone-900">{formatPrice(subtotal)}</span>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-stone-500 mb-1">Discount Amount (₹)</label>
                <input
                  type="number"
                  name="discount"
                  min={0}
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs rounded-lg bg-stone-50 border border-stone-300 text-stone-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-stone-500 mb-1">GST Tax Rate (%)</label>
                <input
                  type="number"
                  name="tax_rate"
                  min={0}
                  max={50}
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs rounded-lg bg-stone-50 border border-stone-300 text-stone-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-stone-500 mb-1">Delivery Charge (₹)</label>
                <input
                  type="number"
                  name="delivery_charge"
                  min={0}
                  value={deliveryCharge}
                  onChange={(e) => setDeliveryCharge(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs rounded-lg bg-stone-50 border border-stone-300 text-stone-900"
                />
              </div>

              <div className="border-t border-stone-200 pt-3 space-y-1.5">
                <div className="flex justify-between text-stone-500">
                  <span>Calculated GST ({taxRate}%):</span>
                  <span>{formatPrice(calculatedTax)}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold text-stone-900 pt-1 border-t border-stone-200">
                  <span>Grand Total</span>
                  <span className="text-lg text-[#5A3E2B]">{formatPrice(grandTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
          <Link
            href="/admin/quotations"
            className="px-5 py-2.5 bg-stone-100 text-stone-700 hover:bg-stone-200 text-xs font-semibold rounded-xl transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={pending}
            className="px-6 py-2.5 bg-[#5A3E2B] text-white text-xs font-semibold rounded-xl hover:bg-[#432D1F] transition-all shadow-2xs flex items-center gap-2 disabled:opacity-50"
          >
            {pending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Quotation...</span>
              </>
            ) : (
              <span>Save & Calculate Quotation</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
