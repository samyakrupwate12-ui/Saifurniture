"use client";

import React, { useState } from "react";
import Link from "next/link";
import { updateEnquiryStatusAction } from "@/app/admin/admin-actions";
import { Phone, Mail, FileSpreadsheet, Save, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import type { DBEnquiry } from "@/types/supabase";

interface EnquiryDetailClientProps {
  enquiry: DBEnquiry;
}

export default function EnquiryDetailClient({ enquiry }: EnquiryDetailClientProps) {
  const [status, setStatus] = useState(enquiry.status);
  const [internalNotes, setInternalNotes] = useState(enquiry.internal_notes || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setIsSubmitting(true);

    try {
      await updateEnquiryStatusAction(enquiry.id, status, internalNotes);
      setFeedback({ type: "success", text: "Enquiry status and notes saved successfully." });
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message || "Failed to update enquiry." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Customer & Enquiry Message */}
      <div className="lg:col-span-7 space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
          <h3 className="font-serif font-bold text-base text-stone-900 border-b border-stone-100 pb-3">
            Customer Contact & Info
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
              <span className="text-stone-500 font-medium block text-[11px]">Customer Name</span>
              <span className="font-bold text-stone-900 text-sm mt-0.5 block">{enquiry.customer_name}</span>
            </div>

            <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
              <span className="text-stone-500 font-medium block text-[11px]">Contact Phone</span>
              <span className="font-bold text-stone-900 text-sm mt-0.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#5A3E2B]" /> {enquiry.customer_phone}
              </span>
            </div>

            {enquiry.customer_email && (
              <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 col-span-2">
                <span className="text-stone-500 font-medium block text-[11px]">Email Address</span>
                <span className="font-bold text-stone-900 text-sm mt-0.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#5A3E2B]" /> {enquiry.customer_email}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Product & Customer Message */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
          <h3 className="font-serif font-bold text-base text-stone-900 border-b border-stone-100 pb-3">
            Enquiry Details
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center bg-[#FAF7F2] p-3.5 rounded-xl border border-[#E6DFD5]">
              <div>
                <span className="text-stone-500 font-medium block text-[11px]">Requested Product</span>
                <span className="font-bold text-stone-900 text-sm">{enquiry.product?.name || "General Furniture Inquiry"}</span>
              </div>
              <span className="bg-[#5A3E2B] text-white px-3 py-1 rounded-lg text-xs font-semibold">
                Qty: {enquiry.quantity}
              </span>
            </div>

            <div>
              <span className="text-stone-500 font-medium block text-[11px] mb-1">Customer Message</span>
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-stone-800 text-xs leading-relaxed whitespace-pre-line">
                {enquiry.message || "No additional text provided in enquiry."}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Status & Internal Notes */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
          <h3 className="font-serif font-bold text-base text-stone-900 border-b border-stone-100 pb-3">
            Update Status & Internal Notes
          </h3>

          {feedback && (
            <div
              className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
                feedback.type === "success"
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              {feedback.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              )}
              <span>{feedback.text}</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Enquiry Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#5A3E2B]/40"
              >
                <option value="new">New</option>
                <option value="in_progress">In Progress</option>
                <option value="quoted">Quoted</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Internal Admin Notes</label>
              <textarea
                rows={4}
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                placeholder="Add private internal notes (e.g., call notes, discount discussed, delivery date)..."
                className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#5A3E2B]/40"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-[#5A3E2B] text-white font-semibold rounded-xl hover:bg-[#432D1F] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save Status & Notes</span>
            </button>
          </form>
        </div>

        {/* Generate Quotation Shortcut */}
        <div className="bg-[#FAF7F2] p-6 rounded-2xl border border-[#E6DFD5] space-y-3">
          <h4 className="font-serif font-bold text-sm text-[#2C221E]">
            Generate Official Quotation
          </h4>
          <p className="text-xs text-stone-600">
            Pre-fill customer details and product info into a printable quotation document.
          </p>
          <Link
            href={`/admin/quotations/new?enquiry_id=${enquiry.id}&customer_name=${encodeURIComponent(
              enquiry.customer_name
            )}&customer_phone=${encodeURIComponent(enquiry.customer_phone)}&customer_email=${encodeURIComponent(
              enquiry.customer_email || ""
            )}`}
            className="w-full py-2.5 px-4 bg-white border border-[#5A3E2B] text-[#5A3E2B] font-semibold text-xs rounded-xl hover:bg-[#5A3E2B] hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Create Quotation From Enquiry</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
