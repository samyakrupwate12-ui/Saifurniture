"use client";

import React, { useActionState, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { saveProductAction } from "@/app/admin/admin-actions";
import { Plus, Trash2, ArrowLeft, Loader2, AlertCircle, Sparkles } from "lucide-react";
import type { DBProduct, DBCategory } from "@/types/supabase";

interface ProductFormProps {
  product?: DBProduct | null;
  categories: DBCategory[];
}

export default function ProductForm({ product, categories }: ProductFormProps) {
  const [state, action, pending] = useActionState(saveProductAction, { error: "" });

  const [name, setName] = useState(product?.name || "");
  const [slug, setSlug] = useState(product?.slug || "");
  const [description, setDescription] = useState(product?.description || "");
  const [categoryId, setCategoryId] = useState(product?.category_id || "");
  const [sellingPrice, setSellingPrice] = useState(product?.selling_price || "");
  const [originalPrice, setOriginalPrice] = useState(product?.original_price || "");
  const [material, setMaterial] = useState(product?.material || "");
  const [dimensions, setDimensions] = useState(product?.dimensions || "");
  const [colour, setColour] = useState(product?.colour || "");
  const [stockStatus, setStockStatus] = useState(product?.stock_status || "in_stock");
  const [isFeatured, setIsFeatured] = useState(product?.is_featured || false);
  const [isPublished, setIsPublished] = useState(product ? product.is_published : true);
  const [isArchived, setIsArchived] = useState(product?.is_archived || false);

  const initialImages = product?.product_images && product.product_images.length > 0
    ? product.product_images.map((img) => img.image_url)
    : ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80"];

  const [imageUrls, setImageUrls] = useState<string[]>(initialImages);
  const [newImageUrl, setNewImageUrl] = useState("");

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setImageUrls([...imageUrls, newImageUrl.trim()]);
      setNewImageUrl("");
    }
  };

  const handleRemoveImage = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!product) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9-]+/g, "-"));
    }
  };

  return (
    <form action={action} className="space-y-8">
      {product?.id && <input type="hidden" name="id" value={product.id} />}

      {state?.error && (
        <div
          role="alert"
          className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2.5"
        >
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <span>{state.error}</span>
        </div>
      )}

      {/* Section 1: Basic Information */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
        <h3 className="font-serif font-bold text-base text-stone-900 border-b border-stone-100 pb-3">
          Basic Product Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Product Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              value={name}
              onChange={handleNameChange}
              placeholder="e.g. Modern Teak Wood Sofa"
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-stone-50 border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#5A3E2B]/40"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              URL Slug <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="slug"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, "-"))}
              placeholder="e.g. modern-teak-wood-sofa"
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-stone-50 border border-stone-300 text-stone-900 font-mono focus:outline-none focus:ring-2 focus:ring-[#5A3E2B]/40"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Furniture Category
            </label>
            <select
              name="category_id"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-stone-50 border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#5A3E2B]/40"
            >
              <option value="">Select Category...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Stock & Availability Status <span className="text-red-500">*</span>
            </label>
            <select
              name="stock_status"
              value={stockStatus}
              onChange={(e) => setStockStatus(e.target.value as any)}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-stone-50 border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#5A3E2B]/40"
            >
              <option value="in_stock">In Stock</option>
              <option value="made_to_order">Made to Order</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Detailed Description
          </label>
          <textarea
            name="description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe product craftsmanship, timber origin, foam density, upholstery, etc..."
            className="w-full px-3.5 py-2 text-xs rounded-xl bg-stone-50 border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#5A3E2B]/40"
          />
        </div>
      </div>

      {/* Section 2: Pricing & Specifications */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
        <h3 className="font-serif font-bold text-base text-stone-900 border-b border-stone-100 pb-3">
          Pricing & Specifications
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Selling Price (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="selling_price"
              required
              min={1}
              value={sellingPrice}
              onChange={(e) => setSellingPrice(e.target.value)}
              placeholder="e.g. 24999"
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-stone-50 border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#5A3E2B]/40"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Original Price (₹) (Optional MRP strike-through)
            </label>
            <input
              type="number"
              name="original_price"
              min={0}
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              placeholder="e.g. 32999"
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-stone-50 border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#5A3E2B]/40"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Wood / Material
            </label>
            <input
              type="text"
              name="material"
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              placeholder="e.g. Solid Teak Wood"
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-stone-50 border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#5A3E2B]/40"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Dimensions
            </label>
            <input
              type="text"
              name="dimensions"
              value={dimensions}
              onChange={(e) => setDimensions(e.target.value)}
              placeholder="e.g. 78 W x 34 D x 32 H inches"
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-stone-50 border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#5A3E2B]/40"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Colour / Finish
            </label>
            <input
              type="text"
              name="colour"
              value={colour}
              onChange={(e) => setColour(e.target.value)}
              placeholder="e.g. Warm Walnut Polish"
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-stone-50 border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#5A3E2B]/40"
            />
          </div>
        </div>
      </div>

      {/* Section 3: Image Management */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
        <h3 className="font-serif font-bold text-base text-stone-900 border-b border-stone-100 pb-3">
          Product Images ({imageUrls.length})
        </h3>

        {/* Hidden inputs to pass image URLs to server action */}
        {imageUrls.map((url, i) => (
          <input key={i} type="hidden" name="image_urls[]" value={url} />
        ))}

        {/* Image Input Add Bar */}
        <div className="flex gap-2">
          <input
            type="url"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            placeholder="Paste image URL (e.g. https://images.unsplash.com/...)"
            className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-stone-50 border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#5A3E2B]/40"
          />
          <button
            type="button"
            onClick={handleAddImage}
            className="px-4 py-2 bg-stone-900 text-white text-xs font-semibold rounded-xl hover:bg-stone-800 flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" /> Add Image
          </button>
        </div>

        {/* Images Grid Preview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          {imageUrls.map((url, index) => (
            <div key={index} className="relative aspect-4/3 rounded-xl overflow-hidden border border-stone-200 group bg-stone-100">
              <Image src={url} alt={`Preview ${index + 1}`} fill sizes="200px" className="object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors"
                  title="Remove Image"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded font-mono">
                #{index + 1}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Section 4: Publication & Flags */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
        <h3 className="font-serif font-bold text-base text-stone-900 border-b border-stone-100 pb-3">
          Publication Settings
        </h3>

        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="is_published"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="w-4 h-4 rounded text-[#5A3E2B] focus:ring-[#5A3E2B]"
            />
            <div>
              <span className="text-xs font-semibold text-stone-900">Publish Immediately</span>
              <p className="text-[11px] text-stone-500">Makes product visible to public visitors on storefront catalogue</p>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="is_featured"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-4 h-4 rounded text-[#5A3E2B] focus:ring-[#5A3E2B]"
            />
            <div>
              <span className="text-xs font-semibold text-stone-900">Feature on Homepage</span>
              <p className="text-[11px] text-stone-500">Highlight this item in the featured showroom section</p>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="is_archived"
              checked={isArchived}
              onChange={(e) => setIsArchived(e.target.checked)}
              className="w-4 h-4 rounded text-red-600 focus:ring-red-500"
            />
            <div>
              <span className="text-xs font-semibold text-red-800">Archive Product</span>
              <p className="text-[11px] text-stone-500">Hide from active catalogue without permanently deleting record</p>
            </div>
          </label>
        </div>
      </div>

      {/* Form Submission Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
        <Link
          href="/admin/products"
          className="px-5 py-2.5 bg-stone-100 text-stone-700 hover:bg-stone-200 text-xs font-semibold rounded-xl transition-colors"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={pending}
          className="px-6 py-2.5 bg-[#5A3E2B] text-white text-xs font-semibold rounded-xl hover:bg-[#432D1F] transition-all shadow-2xs flex items-center gap-2 disabled:opacity-50"
        >
          {pending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving Product...</span>
            </>
          ) : (
            <span>Save & Apply Product Changes</span>
          )}
        </button>
      </div>
    </form>
  );
}
