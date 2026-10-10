"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ChevronRight, Phone, MapPin, Mail, Sofa, Bed, Utensils, Armchair, Archive, Tv } from "lucide-react";
import { CATEGORIES } from "@/data/products";

interface MobileMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Sofas: <Sofa className="w-5 h-5 text-[#5A3E2B]" />,
  Beds: <Bed className="w-5 h-5 text-[#5A3E2B]" />,
  Dining: <Utensils className="w-5 h-5 text-[#5A3E2B]" />,
  Chairs: <Armchair className="w-5 h-5 text-[#5A3E2B]" />,
  Storage: <Archive className="w-5 h-5 text-[#5A3E2B]" />,
  "TV Units": <Tv className="w-5 h-5 text-[#5A3E2B]" />,
};

export default function MobileMenuDrawer({ isOpen, onClose }: MobileMenuDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden flex">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div className="relative w-4/5 max-w-sm bg-[#FAF7F2] h-full shadow-2xl flex flex-col z-10 overflow-y-auto">
        {/* Top Header */}
        <div className="p-4 border-b border-[#E6DFD5] flex items-center justify-between bg-[#F3EEE6]">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 shrink-0 rounded-xl overflow-hidden border border-[#E6DFD5] bg-[#FAF7F2]">
              <Image
                src="/images/logo.jpg"
                alt="Sai Furniture Logo"
                fill
                sizes="44px"
                className="object-contain p-0.5"
              />
            </div>
            <div>
              <span className="font-serif text-lg font-bold text-[#2C221E] tracking-tight block leading-tight">
                Sai Furniture
              </span>
              <span className="text-[10px] text-stone-500 uppercase tracking-widest block font-medium">
                Better Homes • Happier Lives
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Navigation Menu"
            className="p-2 rounded-full hover:bg-stone-200 text-stone-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categories Section */}
        <div className="p-4 flex-1">
          <div className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3 px-1">
            Shop Categories
          </div>
          <div className="space-y-1">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                onClick={onClose}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-[#F3EEE6] text-[#2C221E] font-medium transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#FAF7F2] border border-[#E6DFD5] flex items-center justify-center">
                    {CATEGORY_ICONS[cat.name]}
                  </div>
                  <span className="text-sm font-medium">{cat.name}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </Link>
            ))}
          </div>

          <div className="border-t border-[#E6DFD5] my-4 pt-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3 px-1">
              Explore
            </div>
            <div className="space-y-1">
              <Link
                href="/products"
                onClick={onClose}
                className="block px-3 py-2.5 rounded-lg text-sm text-[#2C221E] hover:bg-[#F3EEE6] font-medium"
              >
                All Products
              </Link>
              <Link
                href="/custom-furniture"
                onClick={onClose}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-[#5A3E2B] font-semibold bg-[#F3EEE6]/70 border border-[#E6DFD5]"
              >
                <span>Request Custom Furniture</span>
                <span className="text-[10px] bg-[#5A3E2B] text-white px-2 py-0.5 rounded-full uppercase">
                  Bespoke
                </span>
              </Link>
              <Link
                href="/cart"
                onClick={onClose}
                className="block px-3 py-2.5 rounded-lg text-sm text-[#2C221E] hover:bg-[#F3EEE6]"
              >
                My Shopping Cart
              </Link>
              <Link
                href="/wishlist"
                onClick={onClose}
                className="block px-3 py-2.5 rounded-lg text-sm text-[#2C221E] hover:bg-[#F3EEE6]"
              >
                Wishlist
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Support Info */}
        <div className="p-4 bg-[#F3EEE6] border-t border-[#E6DFD5] text-xs text-stone-600 space-y-2">
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-[#5A3E2B]" />
            <span>Support: +91 98765 43210</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-[#5A3E2B]" />
            <span>support@saifurniture.com</span>
          </div>
          <a
            href="https://www.google.com/maps/search/?api=1&query=Sai+Furniture%2C+Furniture+Market%2C+60+Feet+Road%2C+Ganjmal+Shalimaar+Nashik"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-2 hover:text-[#5A3E2B] transition-colors pt-1"
          >
            <MapPin className="w-3.5 h-3.5 text-[#5A3E2B] shrink-0 mt-0.5" />
            <span className="leading-tight">Sai Furniture, Furniture Market, 60 Feet Road, Ganjmal Shalimaar Nashik</span>
          </a>
        </div>
      </div>
    </div>
  );
}
