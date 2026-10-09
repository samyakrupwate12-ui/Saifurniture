"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { CartItem, Product } from "@/types/product";

interface CartContextType {
  cart: CartItem[];
  wishlist: string[];
  addToCart: (product: Product, quantity?: number, selectedColor?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  totalItems: number;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  toastMessage: string | null;
  closeToast: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const LOCAL_STORAGE_CART_KEY = "sai_furniture_cart_v1";
const LOCAL_STORAGE_WISHLIST_KEY = "sai_furniture_wishlist_v1";

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_WISHLIST_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [cart]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(LOCAL_STORAGE_WISHLIST_KEY, JSON.stringify(wishlist));
    } catch (e) {
      console.error("Failed to save wishlist to localStorage", e);
    }
  }, [wishlist]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const closeToast = () => setToastMessage(null);

  const addToCart = (
    product: Product,
    quantity: number = 1,
    selectedColor?: string
  ) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.product.id === product.id
      );
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        if (selectedColor) {
          updated[existingIndex].selectedColor = selectedColor;
        }
        return updated;
      } else {
        return [
          ...prevCart,
          {
            product,
            quantity,
            selectedColor: selectedColor || product.color,
          },
        ];
      }
    });
    showToast(`Added "${product.name}" to cart!`);
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => {
      const item = prevCart.find((i) => i.product.id === productId);
      if (item) {
        showToast(`Removed "${item.product.name}" from cart`);
      }
      return prevCart.filter((item) => item.product.id !== productId);
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const setQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        showToast("Removed from Wishlist");
        return prev.filter((id) => id !== productId);
      } else {
        showToast("Saved to Wishlist!");
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  
  const deliveryFee = subtotal > 20000 || subtotal === 0 ? 0 : 499;
  const discount = 0;
  const total = subtotal + deliveryFee - discount;

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        updateQuantity,
        setQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        totalItems,
        subtotal,
        deliveryFee,
        discount,
        total,
        toastMessage,
        closeToast,
      }}
    >
      {children}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-6 right-4 z-50 bg-[#2C221E] text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-fade-in text-sm font-medium border border-[#5A3E2B]">
          <span className="w-2 h-2 rounded-full bg-[#D4A373]"></span>
          <span>{toastMessage}</span>
          <button
            onClick={closeToast}
            className="ml-2 text-stone-400 hover:text-white text-xs"
          >
            ✕
          </button>
        </div>
      )}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    return {
      cart: [],
      wishlist: [],
      addToCart: () => {},
      removeFromCart: () => {},
      updateQuantity: () => {},
      setQuantity: () => {},
      clearCart: () => {},
      toggleWishlist: () => {},
      isInWishlist: () => false,
      totalItems: 0,
      subtotal: 0,
      deliveryFee: 0,
      discount: 0,
      total: 0,
      toastMessage: null,
      closeToast: () => {},
    };
  }
  return context;
};
