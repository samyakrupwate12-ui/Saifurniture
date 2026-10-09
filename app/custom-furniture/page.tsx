"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sliders, CheckCircle2, Send, ArrowLeft } from "lucide-react";

export default function CustomFurniturePage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    category: "Sofa",
    material: "Solid Teak Wood",
    dimensions: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-8 md:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-[#5A3E2B] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="bg-white rounded-3xl border border-[#E6DFD5] overflow-hidden shadow-xs p-6 sm:p-10 lg:p-12">
          {/* Header Banner */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center mb-10 pb-10 border-b border-[#E6DFD5]">
            <div className="md:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F3EEE6] border border-[#E6DFD5] text-xs font-bold text-[#5A3E2B] uppercase tracking-wider">
                <Sliders className="w-3.5 h-3.5" />
                <span>Bespoke Workshop Service</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C221E] leading-tight">
                Request Custom Furniture
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Looking for something unique? Customize furniture according to your size, material, finish and style. Our master artisans handcraft tailored pieces to fit your exact home specifications.
              </p>
            </div>
            <div className="md:col-span-5 relative aspect-16/10 rounded-2xl overflow-hidden border border-[#E6DFD5]">
              <Image
                src="/images/custom_furniture.jpg"
                alt="Custom Furniture Artisans"
                fill
                sizes="400px"
                className="object-cover"
              />
            </div>
          </div>

          {/* Form or Success State */}
          {submitted ? (
            <div className="text-center py-12 space-y-4 max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-[#2C221E]">
                Custom Request Received!
              </h2>
              <p className="text-xs sm:text-sm text-stone-600">
                Thank you <strong>{formData.name}</strong>. Our custom furniture designer will contact you at <strong>{formData.phone}</strong> within 24 hours with 3D design proposals and cost estimates.
              </p>
              <div className="pt-4">
                <Link
                  href="/products"
                  className="px-6 py-3 bg-[#5A3E2B] text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#432D1F] transition-all inline-block"
                >
                  Explore Standard Collection
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h3 className="font-serif font-bold text-xl text-[#2C221E]">
                Specify Your Custom Requirements
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1.5">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#E6DFD5] text-xs text-[#2C221E] focus:outline-none focus:ring-2 focus:ring-[#5A3E2B]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1.5">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#E6DFD5] text-xs text-[#2C221E] focus:outline-none focus:ring-2 focus:ring-[#5A3E2B]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#E6DFD5] text-xs text-[#2C221E] focus:outline-none focus:ring-2 focus:ring-[#5A3E2B]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1.5">
                    Furniture Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#E6DFD5] text-xs text-[#2C221E] focus:outline-none focus:ring-2 focus:ring-[#5A3E2B]"
                  >
                    <option value="Sofa">Custom Sofa / Sectional</option>
                    <option value="Bed">Custom Wooden Bed</option>
                    <option value="Dining">Custom Dining Table Set</option>
                    <option value="Cabinet">Custom Cabinet / Sideboard</option>
                    <option value="TV Unit">Custom TV Media Unit</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1.5">
                    Preferred Wood / Material
                  </label>
                  <select
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#E6DFD5] text-xs text-[#2C221E] focus:outline-none focus:ring-2 focus:ring-[#5A3E2B]"
                  >
                    <option value="Solid Teak Wood">Solid Teak Wood</option>
                    <option value="Solid Sheesham Wood">Solid Sheesham Wood</option>
                    <option value="Oak Wood">Premium Oak Wood</option>
                    <option value="Upholstered Fabric">Upholstered Linen / Velvet</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1.5">
                    Target Dimensions (If known)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. L 84 x W 36 x H 30 inches"
                    value={formData.dimensions}
                    onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#E6DFD5] text-xs text-[#2C221E] focus:outline-none focus:ring-2 focus:ring-[#5A3E2B]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1.5">
                  Design Notes / Custom Details
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe your design idea, room placement, color preferences, cushion firmness, etc."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#E6DFD5] text-xs text-[#2C221E] focus:outline-none focus:ring-2 focus:ring-[#5A3E2B]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-[#5A3E2B] text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#432D1F] transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Custom Request</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
