"use client";

import React from "react";
import Link from "next/link";
import CartItemRow from "@/components/cart/CartItemRow";
import OrderSummary from "@/components/cart/OrderSummary";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, ArrowLeft, ArrowRight } from "lucide-react";

export default function CartPage() {
  const { cart, totalItems } = useCart();

  if (cart.length === 0) {
    return (
      <div className="bg-[#FAF7F2] min-h-screen py-16">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-20 h-20 rounded-full bg-[#F3EEE6] border border-[#E6DFD5] text-[#5A3E2B] flex items-center justify-center mx-auto mb-6 shadow-xs">
            <ShoppingBag className="w-10 h-10" />
          </div>

          <h1 className="font-serif text-3xl font-bold text-[#2C221E] mb-3">
            Your Shopping Cart is Empty
          </h1>

          <p className="text-sm text-stone-600 leading-relaxed mb-8">
            Looks like you haven&apos;t added any furniture pieces to your cart yet. Discover our handcrafted sofas, beds, and dining collections!
          </p>

          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#5A3E2B] text-white hover:bg-[#432D1F] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md group"
          >
            <span>Explore Furniture Collection</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Back Link */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-4 border-b border-[#E6DFD5] gap-4">
          <div>
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-[#5A3E2B] mb-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Continue Shopping
            </Link>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C221E]">
              My Shopping Cart ({totalItems})
            </h1>
          </div>
        </div>

        {/* Layout: Cart Items List + Order Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {cart.map((item) => (
              <CartItemRow key={item.product.id} item={item} />
            ))}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-4">
            <OrderSummary />
          </div>
        </div>
      </div>
    </div>
  );
}
