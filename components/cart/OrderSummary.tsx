"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { ArrowRight, ShieldCheck, Tag, Lock } from "lucide-react";

export default function OrderSummary() {
  const { subtotal, deliveryFee, discount, total, clearCart, totalItems } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState("");

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError("");
    if (couponCode.trim().toUpperCase() === "SAI10") {
      setAppliedCoupon("SAI10 (10% OFF)");
      setCouponCode("");
    } else {
      setCouponError("Invalid coupon code. Try 'SAI10'.");
    }
  };

  const handleCheckout = () => {
    alert(
      "🚀 Frontend Order Summary Ready!\n\nCheckout & Razorpay Payment integration will be connected in Phase 2."
    );
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E6DFD5] p-6 shadow-xs space-y-6 sticky top-28">
      <h3 className="font-serif font-bold text-xl text-[#2C221E] pb-3 border-b border-[#E6DFD5]">
        Order Summary
      </h3>

      {/* Coupon Form */}
      <form onSubmit={handleApplyCoupon} className="space-y-2">
        <label className="text-xs font-semibold text-stone-600 block">
          Apply Promo Code
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. SAI10"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="flex-1 px-3 py-2 text-xs rounded-xl bg-[#FAF7F2] border border-[#E6DFD5] text-[#2C221E] uppercase font-bold focus:outline-none focus:ring-2 focus:ring-[#5A3E2B]"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#5A3E2B] text-white text-xs font-semibold rounded-xl hover:bg-[#432D1F] transition-colors"
          >
            Apply
          </button>
        </div>
        {appliedCoupon && (
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 mt-1">
            <Tag className="w-3.5 h-3.5" /> Applied: {appliedCoupon}
          </div>
        )}
        {couponError && (
          <p className="text-[11px] text-rose-600 font-medium">{couponError}</p>
        )}
      </form>

      {/* Financial Breakdown */}
      <div className="space-y-3 text-xs text-stone-600 pt-2 border-t border-[#E6DFD5]">
        <div className="flex justify-between">
          <span>Items Total ({totalItems})</span>
          <span className="font-semibold text-[#2C221E]">
            {formatPrice(subtotal)}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Delivery Fee</span>
          {deliveryFee === 0 ? (
            <span className="font-bold text-emerald-700">FREE Delivery</span>
          ) : (
            <span className="font-semibold text-[#2C221E]">
              {formatPrice(deliveryFee)}
            </span>
          )}
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-emerald-700">
            <span>Promo Discount</span>
            <span className="font-semibold">-{formatPrice(discount)}</span>
          </div>
        )}

        <div className="border-t border-[#E6DFD5] pt-3 flex justify-between items-baseline">
          <div>
            <span className="font-serif font-bold text-lg text-[#2C221E] block">
              Total Amount
            </span>
            <span className="text-[10px] text-stone-400">Inclusive of GST</span>
          </div>
          <span className="font-serif font-bold text-2xl text-[#5A3E2B]">
            {formatPrice(total)}
          </span>
        </div>
      </div>

      {/* Checkout Button */}
      <button
        onClick={handleCheckout}
        className="w-full py-4 bg-[#5A3E2B] text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#432D1F] transition-all shadow-md flex items-center justify-center gap-2 group active:scale-[0.99]"
      >
        <span>Proceed to Checkout</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>

      {/* Guarantee & Clear */}
      <div className="pt-2 border-t border-[#E6DFD5] space-y-3">
        <div className="flex items-center gap-2 text-[11px] text-stone-500">
          <Lock className="w-3.5 h-3.5 text-[#5A3E2B]" />
          <span>Encrypted 256-bit Secure Order</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-stone-500">
          <ShieldCheck className="w-3.5 h-3.5 text-[#5A3E2B]" />
          <span>Free 3-Year Structural Warranty</span>
        </div>
        <button
          onClick={clearCart}
          className="text-[11px] text-stone-400 hover:text-rose-600 underline font-medium block text-center w-full pt-1"
        >
          Clear Cart
        </button>
      </div>
    </div>
  );
}
