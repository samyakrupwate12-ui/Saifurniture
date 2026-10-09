"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import type { DBProduct } from "@/types/supabase";

interface ProductEnquiryFormProps {
  product: DBProduct;
}

export default function ProductEnquiryForm({ product }: ProductEnquiryFormProps) {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (!customerName.trim() || customerName.trim().length < 2) {
      setStatus({ type: "error", text: "Please enter your full name." });
      return;
    }
    if (!customerPhone.trim() || customerPhone.trim().length < 8) {
      setStatus({ type: "error", text: "Please enter a valid contact phone number." });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: customerName.trim(),
          customer_phone: customerPhone.trim(),
          customer_email: customerEmail.trim() || null,
          product_id: product.id,
          quantity: Number(quantity) || 1,
          message: message.trim() || `Enquiry for ${product.name}`,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setStatus({ type: "error", text: data.error || "Unable to submit enquiry." });
      } else {
        setStatus({
          type: "success",
          text: "Thank you! Your enquiry has been received. Our showroom representative will reach out to you shortly.",
        });
        setCustomerName("");
        setCustomerPhone("");
        setCustomerEmail("");
        setMessage("");
      }
    } catch {
      setStatus({ type: "error", text: "Network connection error. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-[#E6DFD5] shadow-xs space-y-4">
      <div className="border-b border-[#E6DFD5] pb-3">
        <h3 className="font-serif font-bold text-lg text-[#2C221E]">
          Enquire About This Product
        </h3>
        <p className="text-xs text-stone-500 mt-0.5">
          Submit an enquiry for pricing, custom dimensions, or delivery timelines.
        </p>
      </div>

      {status && (
        <div
          className={`p-4 rounded-xl text-xs flex items-start gap-2.5 ${
            status.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {status.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          )}
          <span>{status.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Ramesh Patel"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#FAF7F2] border border-[#E6DFD5] text-[#2C221E] focus:outline-none focus:ring-2 focus:ring-[#5A3E2B]/30"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              required
              placeholder="e.g. +91 98765 43210"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#FAF7F2] border border-[#E6DFD5] text-[#2C221E] focus:outline-none focus:ring-2 focus:ring-[#5A3E2B]/30"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Email Address (Optional)
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#FAF7F2] border border-[#E6DFD5] text-[#2C221E] focus:outline-none focus:ring-2 focus:ring-[#5A3E2B]/30"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Quantity
          </label>
          <input
            type="number"
            min={1}
            max={50}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-24 px-3.5 py-2 text-xs rounded-xl bg-[#FAF7F2] border border-[#E6DFD5] text-[#2C221E] focus:outline-none focus:ring-2 focus:ring-[#5A3E2B]/30"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Special Notes / Questions (Optional)
          </label>
          <textarea
            rows={3}
            placeholder="Mention custom wood finish preferences, dimension requirements, or delivery location..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#FAF7F2] border border-[#E6DFD5] text-[#2C221E] focus:outline-none focus:ring-2 focus:ring-[#5A3E2B]/30"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-4 bg-[#5A3E2B] text-white text-xs font-semibold rounded-xl hover:bg-[#432D1F] transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Submitting Enquiry...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Submit Direct Enquiry</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
