"use client";

import React from "react";
import Link from "next/link";
import ProductGrid from "../product/ProductGrid";
import { PRODUCTS, toDBProduct } from "@/data/products";
import { ArrowRight } from "lucide-react";

export default function FeaturedProducts() {
  const featured = PRODUCTS.filter((p) => p.isFeatured).map(toDBProduct);

  return (
    <section className="py-12 md:py-20 bg-white border-y border-[#E6DFD5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#5A3E2B] block mb-1">
              Popular Selections
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#2C221E]">
              Featured Collection
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#5A3E2B] hover:text-[#432D1F] mt-2 md:mt-0 transition-colors group"
          >
            <span>Explore All Products</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <ProductGrid products={featured} columnsDesktop={4} />
      </div>
    </section>
  );
}
