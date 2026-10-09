"use client";

import React from "react";
import { Hammer, Sliders, Truck, Headphones } from "lucide-react";
import { WHY_US_BENEFITS } from "@/data/products";

const ICON_MAP: Record<string, React.ReactNode> = {
  Hammer: <Hammer className="w-6 h-6 text-[#5A3E2B]" />,
  Sliders: <Sliders className="w-6 h-6 text-[#5A3E2B]" />,
  Truck: <Truck className="w-6 h-6 text-[#5A3E2B]" />,
  Headphones: <Headphones className="w-6 h-6 text-[#5A3E2B]" />,
};

export default function WhyUsSection() {
  return (
    <section className="py-12 md:py-16 bg-white border-y border-[#E6DFD5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10 md:mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-[#5A3E2B] block mb-1">
            Our Promise
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#2C221E]">
            Why Choose Sai Furniture
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {WHY_US_BENEFITS.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#FAF7F2] p-6 rounded-2xl border border-[#E6DFD5] hover:shadow-md transition-shadow text-center sm:text-left flex flex-col items-center sm:items-start"
            >
              <div className="w-12 h-12 rounded-xl bg-[#F3EEE6] border border-[#E6DFD5] flex items-center justify-center mb-4 shrink-0">
                {ICON_MAP[item.icon]}
              </div>
              <h3 className="font-serif text-lg font-bold text-[#2C221E] mb-2">
                {item.title}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
