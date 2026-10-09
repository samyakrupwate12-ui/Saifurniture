"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CATEGORIES } from "@/data/products";
import { ArrowUpRight } from "lucide-react";

export default function CategorySection() {
  return (
    <section id="categories" className="py-12 md:py-20 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#5A3E2B] block mb-1">
              Curated Spaces
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#2C221E]">
              Shop by Category
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#5A3E2B] hover:text-[#432D1F] mt-2 md:mt-0 transition-colors group"
          >
            <span>View All Furniture</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* Categories Grid (Scrollable on small phones, 2-col on mobile, 3-col on desktop) */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group relative aspect-4/3 rounded-2xl overflow-hidden bg-white border border-[#E6DFD5] shadow-xs hover:shadow-md transition-all duration-300 block"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="(max-width: 640px) 50vw, 33vw"
                className="object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity" />

              {/* Text content over image */}
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white flex items-end justify-between">
                <div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold tracking-tight">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-stone-300 opacity-90 line-clamp-1 font-medium">
                    {cat.itemCount} Designs Available
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-[#5A3E2B] group-hover:text-white transition-colors shrink-0">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
