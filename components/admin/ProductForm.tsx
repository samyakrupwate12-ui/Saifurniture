"use client";

import React, { useActionState, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { saveProductAction } from "@/app/admin/admin-actions";
import { Plus, Trash2, Upload, Loader2, AlertCircle } from "lucide-react";
import type { DBProduct, DBCategory, StockStatus } from "@/types/supabase";

import { createClient } from "@/lib/supabase/browser";
import { supabaseConfig } from "@/lib/supabase/config";
import { IMAGE_BUCKET, IMAGE_TYPES, MAX_PRODUCT_IMAGES, parseProductImage, validateImageFile } from "@/lib/product-images";

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
  const [stockStatus, setStockStatus] = useState(product?.stock_status || "available");
  const [isFeatured, setIsFeatured] = useState(product?.is_featured || false);
  const [isPublished, setIsPublished] = useState(product ? product.is_published : true);
  const [isArchived, setIsArchived] = useState(product?.is_archived || false);

  const [imageUrls, setImageUrls] = useState<string[]>(() =>
    [...(product?.product_images ?? [])]
      .sort((a, b) => a.display_order - b.display_order)
      .map((img) => img.image_url),
  );
  const [newImageUrl, setNewImageUrl] = useState("");
  const [imageError, setImageError] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");
  const [uploading, setUploading] = useState(false);
  const uploadLock = useRef(false);
  const busy = pending || uploading;
  const savedId = product?.id || state.productId;

  const handleAddImage = () => {
    if (!newImageUrl.trim() || busy) return;
    try {
      if (imageUrls.length >= MAX_PRODUCT_IMAGES) throw new Error(`Use up to ${MAX_PRODUCT_IMAGES} images per product.`);
      const image = parseProductImage(newImageUrl, supabaseConfig().url);
      if (imageUrls.includes(image.image_url)) throw new Error("This image has already been added.");
      setImageUrls((urls) => [...urls, image.image_url]);
      setNewImageUrl("");
      setImageError("");
    } catch (error) {
      setImageError(error instanceof Error ? error.message : "Invalid image link.");
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (!files.length || uploadLock.current || pending) return;
    setImageError("");
    setUploadStatus("");
    if (files.length + imageUrls.length > MAX_PRODUCT_IMAGES) {
      setImageError(`Use up to ${MAX_PRODUCT_IMAGES} images per product.`);
      return;
    }
    for (const file of files) {
      const error = validateImageFile(file);
      if (error) { setImageError(`${file.name}: ${error}`); return; }
    }
    uploadLock.current = true;
    setUploading(true);
    let uploaded = 0;
    try {
      const supabase = createClient();
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error("Your session has expired. Sign in again to upload photos.");
      for (const file of files) {
        setUploadStatus(`Uploading photo ${uploaded + 1} of ${files.length}…`);
        const path = `products/${user.id}/${crypto.randomUUID()}.${IMAGE_TYPES[file.type]}`;
        const { error } = await supabase.storage.from(IMAGE_BUCKET).upload(path, file, {
          contentType: file.type, cacheControl: "3600", upsert: false,
        });
        if (error) throw new Error(`${file.name}: ${error.message}`);
        const { data } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path);
        setImageUrls((urls) => [...urls, data.publicUrl]);
        uploaded++;
      }
    } catch (error) {
      setImageError(error instanceof Error ? error.message : "Upload failed. Please try again.");
    } finally {
      setUploadStatus(uploaded ? `${uploaded} photo${uploaded === 1 ? "" : "s"} uploaded. Save the product to apply changes.` : "");
      uploadLock.current = false;
      setUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    if (!busy) setImageUrls((urls) => urls.filter((_, i) => i !== index));
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!product) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9-]+/g, "-"));
    }
  };

  return (
    <form action={action} onSubmit={(event) => { if (uploadLock.current) event.preventDefault(); }} className="space-y-8">
      {savedId && <input type="hidden" name="id" value={savedId} />}

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
              <option value="">{categories.length ? "Select Category..." : "No categories yet"}</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <Link href="/admin/categories" target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-xs text-[#5A3E2B] underline">
              Add or manage furniture categories
            </Link>
            {categories.length === 0 && <p className="mt-1 text-xs text-stone-500">Create a category, then refresh this page before entering product details.</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Stock & Availability Status <span className="text-red-500">*</span>
            </label>
            <select
              name="stock_status"
              value={stockStatus}
              onChange={(e) => setStockStatus(e.target.value as StockStatus)}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-stone-50 border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#5A3E2B]/40"
            >
              <option value="available">In Stock</option>
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

        <div className="rounded-xl border-2 border-dashed border-stone-300 p-5 space-y-3">
          <label htmlFor="product-photos" className="flex items-center gap-2 text-sm font-semibold text-stone-800">
            <Upload className="w-4 h-4" /> Upload photos from your device
          </label>
          <input
            id="product-photos"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            multiple
            disabled={busy || imageUrls.length >= MAX_PRODUCT_IMAGES}
            onChange={handleUpload}
            className="block w-full text-xs file:mr-3 file:rounded-lg file:border-0 file:bg-stone-900 file:px-4 file:py-2 file:text-white disabled:opacity-50"
          />
          <p className="text-xs text-stone-500">JPG, PNG, WebP or AVIF. Up to 5 MB each, {MAX_PRODUCT_IMAGES} photos per product. The first photo is the cover.</p>
          {uploadStatus && <p role="status" className="text-xs text-stone-700">{uploadStatus}</p>}
          {imageError && <p role="alert" className="text-xs text-red-700">{imageError}</p>}
        </div>

        {/* Existing hosted links remain supported. */}
        <div className="flex gap-2">
          <input
            type="url"
            aria-label="Hosted image URL"
            disabled={busy}
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            placeholder="Paste image URL (e.g. https://images.unsplash.com/...)"
            className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-stone-50 border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#5A3E2B]/40"
          />
          <button
            type="button"
            onClick={handleAddImage}
            disabled={busy || !newImageUrl.trim()}
            className="px-4 py-2 bg-stone-900 text-white text-xs font-semibold rounded-xl hover:bg-stone-800 flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" /> Add Image
          </button>
        </div>

        {/* Images Grid Preview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          {imageUrls.map((url, index) => (
            <div key={index} className="relative aspect-4/3 rounded-xl overflow-hidden border border-stone-200 group bg-stone-100">
              <Image src={url} alt={`Preview ${index + 1}`} fill sizes="200px" className="object-cover" unoptimized />
              <div className="absolute inset-0 bg-black/40 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus-within:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  disabled={busy}
                  aria-label={`Remove photo ${index + 1}`}
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
          disabled={busy}
          className="px-6 py-2.5 bg-[#5A3E2B] text-white text-xs font-semibold rounded-xl hover:bg-[#432D1F] transition-all shadow-2xs flex items-center gap-2 disabled:opacity-50"
        >
          {busy ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{uploading ? "Uploading Photos..." : "Saving Product..."}</span>
            </>
          ) : (
            <span>Save & Apply Product Changes</span>
          )}
        </button>
      </div>
    </form>
  );
}
