"use client";

import React from "react";
import { FilterState } from "@/types/product";
import { CATEGORIES } from "@/data/products";
import { SlidersHorizontal, X, RotateCcw } from "lucide-react";

interface ProductFilterProps {
  filters: FilterState;
  onFilterChange: (updated: Partial<FilterState>) => void;
  onResetFilters: () => void;
  isMobileDrawerOpen: boolean;
  setIsMobileDrawerOpen: (open: boolean) => void;
  totalProductsCount: number;
}

const MATERIAL_OPTIONS = [
  "Solid Wood",
  "Fabric",
  "Sheesham Wood",
  "Teak Wood",
  "Pine Wood",
  "Linen",
  "Velvet",
  "Bentwood Oak",
];

export default function ProductFilter({
  filters,
  onFilterChange,
  onResetFilters,
  isMobileDrawerOpen,
  setIsMobileDrawerOpen,
  totalProductsCount,
}: ProductFilterProps) {
  const handleCategoryClick = (catSlug: string) => {
    onFilterChange({
      category: filters.category === catSlug ? "all" : catSlug,
    });
  };

  const handleMaterialToggle = (material: string) => {
    const current = [...filters.materials];
    if (current.includes(material)) {
      onFilterChange({
        materials: current.filter((m) => m !== material),
      });
    } else {
      onFilterChange({
        materials: [...current, material],
      });
    }
  };

  const filterControlsNode = (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h4 className="font-semibold text-xs uppercase tracking-wider text-stone-500 mb-3">
          Categories
        </h4>
        <div className="space-y-1">
          <button
            onClick={() => handleCategoryClick("all")}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
              filters.category === "all" || !filters.category
                ? "bg-[#5A3E2B] text-white font-semibold"
                : "text-[#2C221E] hover:bg-[#F3EEE6]"
            }`}
          >
            <span>All Categories</span>
            <span className="text-[10px] opacity-80">({totalProductsCount})</span>
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.slug)}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
                filters.category === cat.slug
                  ? "bg-[#5A3E2B] text-white font-semibold"
                  : "text-[#2C221E] hover:bg-[#F3EEE6]"
              }`}
            >
              <span>{cat.name}</span>
              <span className="text-[10px] opacity-70">({cat.itemCount})</span>
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-[#E6DFD5] pt-5" />

      {/* Max Price Range Slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold text-xs uppercase tracking-wider text-stone-500">
            Max Price
          </h4>
          <span className="text-xs font-bold text-[#5A3E2B]">
            ₹{filters.maxPrice.toLocaleString("en-IN")}
          </span>
        </div>
        <input
          type="range"
          min="10000"
          max="60000"
          step="2000"
          value={filters.maxPrice}
          onChange={(e) =>
            onFilterChange({ maxPrice: Number(e.target.value) })
          }
          className="w-full accent-[#5A3E2B] cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-stone-400 mt-1">
          <span>₹10,000</span>
          <span>₹60,000</span>
        </div>
      </div>

      <div className="border-t border-[#E6DFD5] pt-5" />

      {/* Material Filter */}
      <div>
        <h4 className="font-semibold text-xs uppercase tracking-wider text-stone-500 mb-3">
          Material & Finish
        </h4>
        <div className="space-y-2">
          {MATERIAL_OPTIONS.map((material) => {
            const isChecked = filters.materials.includes(material);
            return (
              <label
                key={material}
                className="flex items-center gap-2.5 text-xs text-[#2C221E] cursor-pointer hover:text-[#5A3E2B]"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleMaterialToggle(material)}
                  className="rounded border-[#E6DFD5] text-[#5A3E2B] focus:ring-[#5A3E2B] h-4 w-4 accent-[#5A3E2B]"
                />
                <span>{material}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="border-t border-[#E6DFD5] pt-5" />

      {/* Reset Filters */}
      <button
        onClick={onResetFilters}
        className="w-full py-2.5 px-4 rounded-xl border border-[#E6DFD5] text-stone-700 hover:bg-[#F3EEE6] text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Reset Filters</span>
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 bg-white p-6 rounded-2xl border border-[#E6DFD5] h-fit sticky top-28 shadow-xs">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E6DFD5]">
          <div className="flex items-center gap-2 text-[#2C221E]">
            <SlidersHorizontal className="w-4 h-4 text-[#5A3E2B]" />
            <h3 className="font-serif font-bold text-base">Filter Furniture</h3>
          </div>
        </div>
        {filterControlsNode}
      </aside>

      {/* Mobile Drawer Filter Modal */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setIsMobileDrawerOpen(false)}
          />
          <div className="relative w-4/5 max-w-sm bg-[#FAF7F2] h-full shadow-2xl ml-auto flex flex-col z-10 overflow-y-auto p-5">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E6DFD5]">
              <div className="flex items-center gap-2 text-[#2C221E]">
                <SlidersHorizontal className="w-4 h-4 text-[#5A3E2B]" />
                <h3 className="font-serif font-bold text-base">Filter Options</h3>
              </div>
              <button
                onClick={() => setIsMobileDrawerOpen(false)}
                className="p-1 rounded-full hover:bg-stone-200"
              >
                <X className="w-5 h-5 text-stone-600" />
              </button>
            </div>
            {filterControlsNode}
            <div className="mt-6 pt-4 border-t border-[#E6DFD5]">
              <button
                onClick={() => setIsMobileDrawerOpen(false)}
                className="w-full py-3 bg-[#5A3E2B] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm"
              >
                Apply Filters ({totalProductsCount})
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
