"use client";

import React from "react";
import Link from "next/link";
import ProductGrid from "../product/ProductGrid";
import { PRODUCTS, toDBProduct } from "@/data/products";
import { Sparkles, ArrowRight } from "lucide-react";

export default function BestSellers() {
  const bestSellers = PRODUCTS.filter((p) => p.isBestSeller).slice(0, 4).map(toDBProduct);

  return (
    <section className="py-12 md:py-20 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#5A3E2B] mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Customer Favorites</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#2C221E]">
              Best Sellers
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#5A3E2B] hover:text-[#432D1F] mt-2 md:mt-0 transition-colors group"
          >
            <span>Browse Full Catalog</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <ProductGrid products={bestSellers} columnsDesktop={4} />
      </div>
    </section>
  );
}
