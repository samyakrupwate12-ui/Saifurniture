"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sliders, ArrowRight, CheckCircle2 } from "lucide-react";

export default function CustomPromoSection() {
  return (
    <section className="py-12 md:py-20 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#F3EEE6] rounded-3xl border border-[#E6DFD5] overflow-hidden shadow-sm p-6 sm:p-10 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Text Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E6DFD5] text-xs font-bold text-[#5A3E2B] uppercase tracking-wider">
                <Sliders className="w-3.5 h-3.5 text-[#5A3E2B]" />
                <span>Bespoke Woodworking</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2C221E] leading-tight">
                Made for Your Space
              </h2>

              <p className="text-base text-stone-600 leading-relaxed max-w-xl">
                Looking for something unique? Customize furniture according to your size, material, finish and style. Our master artisans handcraft tailored pieces to fit your exact home dimensions.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-medium text-[#2C221E]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#5A3E2B]" />
                  <span>Choose custom wood species & polish</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#5A3E2B]" />
                  <span>Modify length, width & seat heights</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#5A3E2B]" />
                  <span>Select from 50+ linen & velvet fabrics</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#5A3E2B]" />
                  <span>3D CAD Preview before production</span>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href="/custom-furniture"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#5A3E2B] text-white hover:bg-[#432D1F] font-medium text-sm transition-all shadow-md group"
                >
                  <span>Request Custom Furniture</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden border border-[#E6DFD5] shadow-md">
                <Image
                  src="/images/custom_furniture.jpg"
                  alt="Custom Furniture Artisans Woodworking"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
