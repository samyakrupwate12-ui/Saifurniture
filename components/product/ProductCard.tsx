"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageSquareText, ShieldCheck } from "lucide-react";
import type { DBProduct } from "@/types/supabase";

interface ProductCardProps {
  product: DBProduct;
  priorityImage?: boolean;
}

export default function ProductCard({
  product,
  priorityImage = false,
}: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const firstImage = product.product_images && product.product_images.length > 0
    ? product.product_images[0].image_url
    : "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80";

  const discountPercent = product.original_price && product.original_price > product.selling_price
    ? Math.round(((product.original_price - product.selling_price) / product.original_price) * 100)
    : 0;

  const stockBadgeLabel = product.stock_status === "made_to_order"
    ? "Made to Order"
    : product.stock_status === "out_of_stock"
    ? "Out of Stock"
    : "In Stock";

  const stockBadgeColor = product.stock_status === "made_to_order"
    ? "bg-amber-100 text-amber-900 border-amber-200"
    : product.stock_status === "out_of_stock"
    ? "bg-stone-100 text-stone-600 border-stone-200"
    : "bg-emerald-50 text-emerald-800 border-emerald-200";

  return (
    <div className="group bg-white rounded-2xl border border-[#E6DFD5] overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col h-full">
      {/* Product Image */}
      <div className="relative aspect-4/3 w-full bg-[#F3EEE6] overflow-hidden">
        <Link href={`/products/${product.slug}`} className="block w-full h-full">
          <Image
            src={firstImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priorityImage}
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        </Link>

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-3 left-3 bg-[#5A3E2B] text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-2xs uppercase tracking-wider">
            {discountPercent}% OFF
          </div>
        )}

        {/* Stock Status Badge */}
        <div className={`absolute top-3 right-3 text-[10px] font-semibold px-2.5 py-1 rounded-md border shadow-2xs ${stockBadgeColor}`}>
          {stockBadgeLabel}
        </div>
      </div>

      {/* Product Details Content */}
      <div className="p-5 flex flex-col flex-1 justify-between bg-white space-y-4">
        <div>
          {/* Category */}
          {product.category?.name && (
            <span className="font-medium text-stone-500 uppercase tracking-wider text-[11px] block mb-1">
              {product.category.name}
            </span>
          )}

          {/* Title */}
          <Link
            href={`/products/${product.slug}`}
            className="font-serif text-lg font-bold text-[#2C221E] hover:text-[#5A3E2B] transition-colors line-clamp-1 block"
          >
            {product.name}
          </Link>

          {/* Material Specs */}
          {product.material && (
            <p className="text-xs text-stone-500 line-clamp-1 mt-1">
              {product.material}
            </p>
          )}
        </div>

        {/* Price & Action Button */}
        <div>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-xl font-bold text-[#2C221E]">
              {formatPrice(product.selling_price)}
            </span>
            {product.original_price && product.original_price > product.selling_price && (
              <span className="text-xs text-stone-400 line-through">
                {formatPrice(product.original_price)}
              </span>
            )}
          </div>

          <Link
            href={`/products/${product.slug}`}
            className="w-full py-2.5 px-3 rounded-xl bg-[#5A3E2B] text-white hover:bg-[#432D1F] font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-2xs"
          >
            <MessageSquareText className="w-3.5 h-3.5" />
            <span>View Details & Enquiry</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
