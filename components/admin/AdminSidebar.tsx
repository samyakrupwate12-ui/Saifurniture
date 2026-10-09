"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  MessageSquare,
  FileSpreadsheet,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  X,
  UserCheck,
} from "lucide-react";
import { logout } from "@/app/admin/actions";

interface AdminSidebarProps {
  adminName?: string | null;
  adminRole?: string;
}

export default function AdminSidebar({ adminName, adminRole = "admin" }: AdminSidebarProps) {
  const pathname = usePathname();
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // If on login page, don't show sidebar shell
  if (pathname === "/admin/login" || pathname === "/admin/denied") {
    return null;
  }

  const navItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Products", href: "/admin/products", icon: Package },
    { label: "Categories", href: "/admin/categories", icon: FolderTree },
    { label: "Enquiries", href: "/admin/enquiries", icon: MessageSquare },
    { label: "Quotations", href: "/admin/quotations", icon: FileSpreadsheet },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Top Header */}
      <div className="md:hidden bg-stone-900 text-stone-100 p-4 border-b border-stone-800 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileDrawerOpen(true)}
            className="p-2 rounded-xl bg-stone-800 text-stone-200 hover:bg-stone-700"
            aria-label="Open Navigation Drawer"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-serif text-lg font-bold text-white leading-none">Sai Furniture</h1>
            <span className="text-[10px] text-stone-400 font-medium uppercase tracking-wider">Admin Portal</span>
          </div>
        </div>
        <Link
          href="/"
          target="_blank"
          className="text-xs text-stone-300 hover:text-white flex items-center gap-1 bg-stone-800 px-3 py-1.5 rounded-lg border border-stone-700"
        >
          <span>Storefront</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      {/* Mobile Navigation Drawer Overlay */}
      {isMobileDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsMobileDrawerOpen(false)}
          />
          <div className="relative w-4/5 max-w-xs bg-stone-900 text-stone-100 h-full p-6 shadow-2xl flex flex-col z-10">
            <div className="flex items-center justify-between pb-6 border-b border-stone-800">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-stone-400">Sai Furniture</p>
                <h2 className="text-xl font-bold font-serif text-white mt-1">Admin Menu</h2>
              </div>
              <button
                onClick={() => setIsMobileDrawerOpen(false)}
                className="p-2 text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="mt-6 space-y-1.5 flex-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-[#5A3E2B] text-white shadow-xs font-semibold"
                        : "text-stone-300 hover:bg-stone-800 hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="pt-6 border-t border-stone-800 space-y-4">
              <div className="flex items-center gap-3 bg-stone-800/60 p-3 rounded-xl border border-stone-800 text-xs">
                <UserCheck className="w-4 h-4 text-[#D4A373]" />
                <div className="overflow-hidden">
                  <p className="font-semibold text-white truncate">{adminName || "Administrator"}</p>
                  <p className="text-stone-400 capitalize text-[10px]">{adminRole}</p>
                </div>
              </div>

              <form action={logout}>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-stone-800 text-stone-300 hover:bg-red-950 hover:text-red-200 text-xs font-semibold rounded-xl border border-stone-700 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 bg-stone-900 text-stone-100 flex-col p-6 min-h-screen border-r border-stone-800 shrink-0 sticky top-0 h-screen">
        <div className="pb-6 border-b border-stone-800">
          <p className="text-[10px] uppercase tracking-widest font-semibold text-stone-400">
            Showroom Management
          </p>
          <h1 className="text-2xl font-serif font-bold text-white mt-1">Sai Furniture</h1>
        </div>

        <nav className="mt-6 space-y-1.5 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-[#5A3E2B] text-white font-semibold shadow-2xs"
                    : "text-stone-300 hover:bg-stone-800 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="pt-6 border-t border-stone-800 space-y-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium bg-stone-800/80 text-stone-300 hover:bg-stone-800 hover:text-white border border-stone-800 transition-colors"
          >
            <span>View Public Storefront</span>
            <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
          </Link>

          <div className="flex items-center gap-3 bg-stone-800/50 p-3 rounded-xl border border-stone-800/80 text-xs">
            <div className="w-8 h-8 rounded-full bg-[#5A3E2B] text-white font-bold flex items-center justify-center shrink-0">
              {adminName ? adminName.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="overflow-hidden">
              <p className="font-semibold text-white truncate">{adminName || "Administrator"}</p>
              <p className="text-stone-400 capitalize text-[10px]">{adminRole}</p>
            </div>
          </div>

          <form action={logout}>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-stone-800 text-stone-300 hover:bg-stone-800 hover:text-red-400 text-xs font-semibold rounded-xl border border-stone-800 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
