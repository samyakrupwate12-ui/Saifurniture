"use client";

import React from "react";
import Link from "next/link";
import ProductGrid from "@/components/product/ProductGrid";
import { useCart } from "@/context/CartContext";
import { PRODUCTS, toDBProduct } from "@/data/products";
import { Heart, ArrowLeft, ArrowRight } from "lucide-react";

export default function WishlistPage() {
  const { wishlist } = useCart();

  const wishlistedProducts = PRODUCTS.filter((p) => wishlist.includes(p.id)).map(toDBProduct);

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-[#5A3E2B] mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </Link>

        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#E6DFD5]">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C221E] flex items-center gap-3">
              <span>Saved Wishlist</span>
              <span className="text-sm font-sans font-normal text-stone-500 bg-[#F3EEE6] px-3 py-1 rounded-full border border-[#E6DFD5]">
                {wishlist.length} Items
              </span>
            </h1>
          </div>
        </div>

        {wishlistedProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-[#E6DFD5] text-center max-w-md mx-auto my-8">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#2C221E] mb-2">
              Your Wishlist is Empty
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 leading-relaxed mb-6">
              Click the heart icon on any furniture design to save it here for later.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#5A3E2B] text-white hover:bg-[#432D1F] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <ProductGrid products={wishlistedProducts} columnsDesktop={4} />
        )}
      </div>
    </div>
  );
}
