"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative bg-[#FAF7F2] py-8 md:py-16 overflow-hidden border-b border-[#E6DFD5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F3EEE6] border border-[#E6DFD5] text-xs font-semibold text-[#5A3E2B]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Crafted for Modern Indian Living</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-[#2C221E] tracking-tight leading-[1.15]">
              Furniture for a <br className="hidden sm:inline" />
              <span className="italic font-normal text-[#5A3E2B]">Better Everyday</span>
            </h1>

            <p className="text-base sm:text-lg text-stone-600 font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
              Thoughtfully designed furniture made for comfortable, beautiful homes. Built with sustainable solid woods and durable premium fabrics.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/products"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#5A3E2B] text-white hover:bg-[#432D1F] font-medium text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
              >
                <span>Shop Collection</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#categories"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white border border-[#E6DFD5] text-[#2C221E] hover:bg-[#F3EEE6] font-medium text-sm transition-all text-center"
              >
                Explore Categories
              </a>
            </div>

            {/* Micro proof badges */}
            <div className="pt-6 border-t border-[#E6DFD5]/70 grid grid-cols-3 gap-2 text-center lg:text-left">
              <div>
                <span className="font-serif font-bold text-xl text-[#2C221E] block">100%</span>
                <span className="text-[11px] text-stone-500 uppercase tracking-wider">Solid Teak Wood</span>
              </div>
              <div>
                <span className="font-serif font-bold text-xl text-[#2C221E] block">5-Year</span>
                <span className="text-[11px] text-stone-500 uppercase tracking-wider">Frame Guarantee</span>
              </div>
              <div>
                <span className="font-serif font-bold text-xl text-[#2C221E] block">Free</span>
                <span className="text-[11px] text-stone-500 uppercase tracking-wider">Insured Shipping</span>
              </div>
            </div>
          </div>

          {/* Right Column: Premium Hero Image */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-16/10 sm:aspect-4/3 rounded-3xl overflow-hidden border border-[#E6DFD5] shadow-xl group">
              <Image
                src="/images/hero_furniture.jpg"
                alt="Sai Furniture luxury living room"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center group-hover:scale-102 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-60" />

              {/* Floating Product Tag badge */}
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md p-3 rounded-2xl border border-[#E6DFD5] shadow-md flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F3EEE6] flex items-center justify-center font-bold text-[#5A3E2B] text-xs">
                  ₹24.9k
                </div>
                <div>
                  <span className="text-xs font-bold text-[#2C221E] block">Modern Fabric Sofa</span>
                  <span className="text-[10px] text-stone-500 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-[#5A3E2B]" /> Bestseller Design
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
