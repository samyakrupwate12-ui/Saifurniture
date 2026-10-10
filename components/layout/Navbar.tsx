"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Menu, X, Sparkles, SlidersHorizontal } from "lucide-react";
import MobileMenuDrawer from "./MobileMenuDrawer";

export default function Navbar() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <>
      {/* Top Banner */}
      <div className="bg-[#2C221E] text-stone-200 text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2 tracking-wide">
        <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" />
        <span>Sai Furniture — Handcrafted Solid Wood Furniture Showroom</span>
        <span className="hidden md:inline text-stone-400">•</span>
        <span className="hidden md:inline text-[#D4A373]">
          Custom Made-to-Order Designs Available
        </span>
      </div>

      {/* Main Sticky Navbar */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E6DFD5] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 text-[#2C221E] hover:bg-[#F3EEE6] rounded-xl transition-colors"
              aria-label="Open Mobile Menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Brand Logo & Title */}
            <div className="flex items-center gap-3">
              <Link href="/" className="group flex items-center gap-2.5 sm:gap-3">
                <div className="relative w-11 h-11 sm:w-13 sm:h-13 shrink-0 rounded-xl overflow-hidden border border-[#E6DFD5] bg-[#FAF7F2] shadow-xs group-hover:border-[#5A3E2B] transition-colors">
                  <Image
                    src="/images/logo.jpg"
                    alt="Sai Furniture Logo"
                    fill
                    sizes="(max-width: 640px) 44px, 52px"
                    className="object-contain p-0.5"
                    priority
                  />
                </div>
                <div>
                  <span className="font-serif text-2xl font-bold text-[#2C221E] tracking-tight block leading-none">
                    Sai Furniture
                  </span>
                  <span className="text-[10px] text-stone-500 uppercase tracking-widest hidden sm:block mt-1 font-medium">
                    Better Homes • Happier Lives
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-4 text-sm font-medium text-[#2C221E]">
              <Link
                href="/"
                className="px-3 py-2 rounded-lg hover:text-[#5A3E2B] hover:bg-[#F3EEE6] transition-colors"
              >
                Home
              </Link>
              <Link
                href="/products"
                className="px-3 py-2 rounded-lg hover:text-[#5A3E2B] hover:bg-[#F3EEE6] transition-colors"
              >
                Catalogue
              </Link>
              <Link
                href="/products?category=sofas"
                className="px-3 py-2 rounded-lg hover:text-[#5A3E2B] hover:bg-[#F3EEE6] transition-colors"
              >
                Sofas
              </Link>
              <Link
                href="/products?category=beds"
                className="px-3 py-2 rounded-lg hover:text-[#5A3E2B] hover:bg-[#F3EEE6] transition-colors"
              >
                Beds
              </Link>
              <Link
                href="/products?category=dining"
                className="px-3 py-2 rounded-lg hover:text-[#5A3E2B] hover:bg-[#F3EEE6] transition-colors"
              >
                Dining
              </Link>
              <Link
                href="/products?category=chairs"
                className="px-3 py-2 rounded-lg hover:text-[#5A3E2B] hover:bg-[#F3EEE6] transition-colors"
              >
                Chairs
              </Link>
              <Link
                href="/products?category=storage"
                className="px-3 py-2 rounded-lg hover:text-[#5A3E2B] hover:bg-[#F3EEE6] transition-colors"
              >
                Storage
              </Link>
            </nav>

            {/* Desktop Search & Action */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="relative hidden lg:block">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    type="text"
                    placeholder="Search furniture, chairs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-52 pl-9 pr-4 py-2 text-xs rounded-full bg-[#F3EEE6] border border-[#E6DFD5] text-[#2C221E] placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#5A3E2B]/30 focus:border-[#5A3E2B] transition-all"
                  />
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                </form>
              </div>

              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="lg:hidden p-2 text-[#2C221E] hover:bg-[#F3EEE6] rounded-xl transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              <Link
                href="/products"
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#5A3E2B] text-white hover:bg-[#432D1F] transition-all shadow-xs flex items-center gap-1.5"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Browse Furniture</span>
              </Link>
            </div>
          </div>

          {/* Expandable Mobile Search Bar */}
          {isSearchOpen && (
            <div className="lg:hidden py-3 border-t border-[#E6DFD5]">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Search furniture, sofas, beds..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl bg-[#F3EEE6] border border-[#E6DFD5] text-[#2C221E] placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#5A3E2B]"
                />
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="absolute right-3 top-3 text-stone-400 hover:text-stone-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <MobileMenuDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
}
