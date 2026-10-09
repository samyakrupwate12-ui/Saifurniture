"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Search, Heart, User } from "lucide-react";
import { useCart } from "@/context/CartContext";

function BottomNavContent() {
  const pathname = usePathname() || "/";
  const { wishlist } = useCart();

  const navItems = [
    {
      label: "Home",
      href: "/",
      icon: Home,
    },
    {
      label: "Categories",
      href: "/products",
      icon: LayoutGrid,
    },
    {
      label: "Search",
      href: "/products?focus=search",
      icon: Search,
    },
    {
      label: "Wishlist",
      href: "/wishlist",
      icon: Heart,
      badge: wishlist.length > 0 ? wishlist.length : undefined,
    },
    {
      label: "Account",
      href: "#account",
      icon: User,
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        alert("Account section coming soon in Phase 2!");
      },
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-t border-[#E6DFD5] md:hidden shadow-lg">
      <div className="grid grid-cols-5 h-16 max-w-md mx-auto items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={item.onClick}
              className={`flex flex-col items-center justify-center h-full relative transition-colors ${
                isActive ? "text-[#5A3E2B]" : "text-stone-500 hover:text-stone-800"
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? "scale-110" : ""
                  }`}
                />
                {item.badge !== undefined && (
                  <span className="absolute -top-1 -right-2 bg-[#5A3E2B] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] mt-1 font-medium ${
                  isActive ? "font-bold text-[#5A3E2B]" : ""
                }`}
              >
                {item.label}
              </span>

              {isActive && (
                <span className="absolute top-1 w-1 h-1 rounded-full bg-[#5A3E2B]" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default function MobileBottomNav() {
  return (
    <Suspense fallback={null}>
      <BottomNavContent />
    </Suspense>
  );
}
