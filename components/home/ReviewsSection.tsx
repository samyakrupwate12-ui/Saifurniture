"use client";

import React from "react";
import Image from "next/image";
import { CUSTOMER_REVIEWS } from "@/data/products";
import { Star, Quote } from "lucide-react";

export default function ReviewsSection() {
  return (
    <section className="py-12 md:py-20 bg-white border-y border-[#E6DFD5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10 md:mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-[#5A3E2B] block mb-1">
            Real Homeowners
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#2C221E]">
            What Our Customers Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CUSTOMER_REVIEWS.map((review) => (
            <div
              key={review.id}
              className="bg-[#FAF7F2] p-6 rounded-2xl border border-[#E6DFD5] shadow-xs flex flex-col justify-between relative"
            >
              <Quote className="w-8 h-8 text-[#5A3E2B]/15 absolute top-6 right-6" />

              <div>
                {/* Rating Stars */}
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>

                {/* Product Tag */}
                <span className="inline-block text-[11px] font-semibold text-[#5A3E2B] bg-[#F3EEE6] px-2.5 py-0.5 rounded-full mb-3">
                  Verified Purchase: {review.productName}
                </span>

                {/* Review Comment */}
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic mb-6">
                  &ldquo;{review.comment}&rdquo;
                </p>
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-3 pt-4 border-t border-[#E6DFD5]">
                {review.avatar ? (
                  <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-[#E6DFD5]">
                    <Image
                      src={review.avatar}
                      alt={review.name}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#5A3E2B] text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {review.name.charAt(0)}
                  </div>
                )}

                <div>
                  <h4 className="font-serif font-bold text-sm text-[#2C221E]">
                    {review.name}
                  </h4>
                  <p className="text-[11px] text-stone-500">
                    {review.location} • {review.date}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
