"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Truck, Sparkles, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#2C221E] text-stone-300 pt-14 pb-12 border-t border-[#432D1F]">
      {/* Top Value Highlights */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 mb-10 border-b border-[#432D1F]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-[#5A3E2B] flex items-center justify-center text-[#D4A373] shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Direct Showroom Delivery</h4>
              <p className="text-xs text-stone-400 mt-0.5">Careful handling and protective packing</p>
            </div>
          </div>
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-[#5A3E2B] flex items-center justify-center text-[#D4A373] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Solid Wood Quality</h4>
              <p className="text-xs text-stone-400 mt-0.5">Handcrafted wooden furniture built to last</p>
            </div>
          </div>
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 rounded-2xl bg-[#5A3E2B] flex items-center justify-center text-[#D4A373] shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Made-to-Order Customization</h4>
              <p className="text-xs text-stone-400 mt-0.5">Custom dimensions & wood finish options</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#5A3E2B] flex items-center justify-center text-white font-serif text-lg font-bold italic">
                S
              </div>
              <span className="font-serif text-xl font-bold text-white tracking-tight">
                Sai Furniture
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Timeless wooden furniture crafted with precision and dedication. Explore our catalogue or get in touch for custom showroom enquiries.
            </p>
          </div>

          {/* Catalogue Quick Links */}
          <div>
            <h3 className="font-semibold text-white text-xs uppercase tracking-wider mb-4">
              Catalogue
            </h3>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <Link href="/products?category=sofas" className="hover:text-white transition-colors">
                  Sofas & Seating
                </Link>
              </li>
              <li>
                <Link href="/products?category=beds" className="hover:text-white transition-colors">
                  Wooden Beds
                </Link>
              </li>
              <li>
                <Link href="/products?category=dining" className="hover:text-white transition-colors">
                  Dining Tables & Sets
                </Link>
              </li>
              <li>
                <Link href="/products?category=chairs" className="hover:text-white transition-colors">
                  Accent & Lounge Chairs
                </Link>
              </li>
              <li>
                <Link href="/products?category=storage" className="hover:text-white transition-colors">
                  Storage & Cabinets
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Enquiries */}
          <div>
            <h3 className="font-semibold text-white text-xs uppercase tracking-wider mb-4">
              Enquiries & Info
            </h3>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  Browse All Furniture
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-white transition-colors text-stone-500">
                  Admin Portal ↗
                </Link>
              </li>
            </ul>
          </div>

          {/* Made-to-Order Promo */}
          <div className="rounded-2xl bg-[#3A2C27] p-5 border border-[#483731]">
            <h4 className="text-sm font-semibold text-white">Looking for Custom Wooden Furniture?</h4>
            <p className="text-xs text-stone-400 mt-2 leading-relaxed">
              We create custom-dimension dining, beds, and storage tailored to your exact space requirements.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 bg-[#5A3E2B] text-white text-xs font-medium rounded-xl hover:bg-[#6E4B34] transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Submit Enquiry</span>
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-[#432D1F] flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} Sai Furniture. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/admin/login" className="hover:text-stone-400">
              Admin Access
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
