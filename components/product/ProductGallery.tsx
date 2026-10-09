"use client";

import React, { useState } from "react";
import Image from "next/image";
import type { DBProductImage } from "@/types/supabase";

interface ProductGalleryProps {
  images?: DBProductImage[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const fallbackImage = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80";
  const imageList = images && images.length > 0
    ? images.map((img) => img.image_url)
    : [fallbackImage];

  const [activeImage, setActiveImage] = useState(imageList[0]);

  return (
    <div className="space-y-4">
      {/* Main Preview */}
      <div className="relative aspect-4/3 w-full bg-[#F3EEE6] rounded-2xl overflow-hidden border border-[#E6DFD5] shadow-xs">
        <Image
          src={activeImage}
          alt={productName}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover object-center"
        />
      </div>

      {/* Thumbnails */}
      {imageList.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {imageList.map((imgUrl, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImage(imgUrl)}
              className={`relative w-20 aspect-4/3 rounded-xl overflow-hidden border transition-all shrink-0 ${
                activeImage === imgUrl
                  ? "border-[#5A3E2B] ring-2 ring-[#5A3E2B]/30"
                  : "border-[#E6DFD5] opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={imgUrl}
                alt={`${productName} thumbnail ${idx + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
