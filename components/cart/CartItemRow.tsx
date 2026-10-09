"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { CartItem } from "@/types/product";
import { useCart } from "@/context/CartContext";

interface CartItemRowProps {
  item: CartItem;
}

export default function CartItemRow({ item }: CartItemRowProps) {
  const { updateQuantity, removeFromCart } = useCart();
  const { product, quantity, selectedColor } = item;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white rounded-2xl border border-[#E6DFD5] gap-4 shadow-xs">
      {/* Product Image & Info */}
      <div className="flex items-center gap-4 flex-1">
        <Link
          href={`/products/${product.slug}`}
          className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-[#F3EEE6] border border-[#E6DFD5] shrink-0"
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="96px"
            className="object-cover object-center"
          />
        </Link>

        <div>
          <span className="text-[10px] uppercase font-bold text-[#5A3E2B] tracking-wider block">
            {product.category}
          </span>
          <Link
            href={`/products/${product.slug}`}
            className="font-serif font-bold text-sm sm:text-base text-[#2C221E] hover:text-[#5A3E2B] transition-colors line-clamp-1"
          >
            {product.name}
          </Link>
          <p className="text-xs text-stone-500 mt-0.5">
            Finish: <span className="font-semibold text-stone-700">{selectedColor || product.color}</span>
          </p>
          <p className="text-xs font-bold text-[#2C221E] mt-1 sm:hidden">
            {formatPrice(product.price * quantity)}
          </p>
        </div>
      </div>

      {/* Quantity & Actions */}
      <div className="flex items-center justify-between w-full sm:w-auto gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E6DFD5]">
        {/* Quantity Stepper */}
        <div className="flex items-center border border-[#E6DFD5] bg-[#FAF7F2] rounded-xl overflow-hidden">
          <button
            onClick={() => updateQuantity(product.id, -1)}
            aria-label="Decrease quantity"
            className="w-8 h-8 flex items-center justify-center text-stone-700 hover:bg-[#EAE3D8] font-bold text-sm"
          >
            -
          </button>
          <span className="w-8 text-center font-bold text-xs text-[#2C221E]">
            {quantity}
          </span>
          <button
            onClick={() => updateQuantity(product.id, 1)}
            aria-label="Increase quantity"
            className="w-8 h-8 flex items-center justify-center text-stone-700 hover:bg-[#EAE3D8] font-bold text-sm"
          >
            +
          </button>
        </div>

        {/* Item Total (Desktop) */}
        <div className="hidden sm:block text-right min-w-[100px]">
          <span className="font-bold text-sm text-[#2C221E] block">
            {formatPrice(product.price * quantity)}
          </span>
          <span className="text-[10px] text-stone-400">
            {formatPrice(product.price)} each
          </span>
        </div>

        {/* Remove Button */}
        <button
          onClick={() => removeFromCart(product.id)}
          aria-label="Remove item"
          className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
