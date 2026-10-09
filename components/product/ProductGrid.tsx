"use client";

import React from "react";
import ProductCard from "./ProductCard";
import type { DBProduct } from "@/types/supabase";
import { PackageX } from "lucide-react";

interface ProductGridProps {
  products: DBProduct[];
  emptyMessage?: string;
  columnsDesktop?: 3 | 4;
}

export default function ProductGrid({
  products,
  emptyMessage = "No furniture items found matching your filter criteria.",
  columnsDesktop = 4,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 border border-[#E6DFD5] text-center max-w-md mx-auto my-8">
        <div className="w-16 h-16 rounded-full bg-[#F3EEE6] text-[#5A3E2B] flex items-center justify-center mx-auto mb-4">
          <PackageX className="w-8 h-8" />
        </div>
        <h3 className="font-serif text-lg font-bold text-[#2C221E] mb-2">
          No Products Found
        </h3>
        <p className="text-sm text-stone-500 leading-relaxed">
          {emptyMessage}
        </p>
      </div>
    );
  }

  const gridColsClass =
    columnsDesktop === 3
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";

  return (
    <div className={`grid ${gridColsClass} gap-4 sm:gap-6`}>
      {products.map((product, idx) => (
        <ProductCard
          key={product.id}
          product={product}
          priorityImage={idx < 4}
        />
      ))}
    </div>
  );
}
