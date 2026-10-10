"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Truck, Sparkles, MessageCircle, MapPin, ExternalLink } from "lucide-react";

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
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 shrink-0 rounded-xl overflow-hidden border border-[#483731] bg-[#FAF7F2]">
                <Image
                  src="/images/logo.jpg"
                  alt="Sai Furniture Logo"
                  fill
                  sizes="48px"
                  className="object-contain p-0.5"
                />
              </div>
              <div>
                <span className="font-serif text-xl font-bold text-white tracking-tight block leading-none">
                  Sai Furniture
                </span>
                <span className="text-[10px] text-[#D4A373] tracking-wide block mt-1">
                  Better Homes • Happier Lives
                </span>
              </div>
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

          {/* Showroom Location & Contact */}
          <div>
            <h3 className="font-semibold text-white text-xs uppercase tracking-wider mb-4">
              Showroom Location
            </h3>
            <div className="space-y-3 text-xs text-stone-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D4A373] shrink-0 mt-0.5" />
                <span className="leading-relaxed text-stone-300">
                  Sai Furniture, Furniture Market, 60 Feet Road, Ganjmal Shalimaar Nashik
                </span>
              </div>
              <div>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Sai+Furniture%2C+Furniture+Market%2C+60+Feet+Road%2C+Ganjmal+Shalimaar+Nashik"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#D4A373] hover:text-[#E8BE95] font-medium transition-colors"
                >
                  <span>Get Directions on Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <ul className="pt-2 space-y-2 text-xs text-stone-400">
                <li>
                  <Link href="/products" className="hover:text-white transition-colors">
                    Browse All Furniture
                  </Link>
                </li>
                <li>
                  <Link href="/custom-furniture" className="hover:text-white transition-colors">
                    Custom Furniture Request
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Made-to-Order Promo */}
          <div className="rounded-2xl bg-[#3A2C27] p-5 border border-[#483731]">
            <h4 className="text-sm font-semibold text-white">Looking for Custom Wooden Furniture?</h4>
            <p className="text-xs text-stone-400 mt-2 leading-relaxed">
              We create custom-dimension dining, beds, and storage tailored to your exact space requirements.
            </p>
            <Link
              href="/custom-furniture"
              className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 bg-[#5A3E2B] text-white text-xs font-medium rounded-xl hover:bg-[#6E4B34] transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Request Custom Furniture</span>
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-[#432D1F] flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} Sai Furniture. All rights reserved.</p>
          <p className="text-stone-500">Handcrafted solid wood furniture in Nashik</p>
        </div>
      </div>
    </footer>
  );
}
