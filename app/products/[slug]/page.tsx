import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchPublicProductBySlug } from "@/lib/db";
import ProductGallery from "@/components/product/ProductGallery";
import ProductEnquiryForm from "@/components/product/ProductEnquiryForm";
import { ShieldCheck, Truck, Sparkles, SlidersHorizontal, ArrowLeft } from "lucide-react";

export const revalidate = 0; // Fresh product details

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await fetchPublicProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const discountPercent = product.original_price && product.original_price > product.selling_price
    ? Math.round(((product.original_price - product.selling_price) / product.original_price) * 100)
    : 0;

  const stockBadgeLabel = product.stock_status === "made_to_order"
    ? "Made to Order"
    : product.stock_status === "out_of_stock"
    ? "Out of Stock"
    : "In Stock";

  const stockBadgeColor = product.stock_status === "made_to_order"
    ? "bg-amber-100 text-amber-900 border-amber-200"
    : product.stock_status === "out_of_stock"
    ? "bg-stone-100 text-stone-600 border-stone-200"
    : "bg-emerald-50 text-emerald-800 border-emerald-200";

  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#2C221E] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center justify-between text-xs text-stone-500 border-b border-[#E6DFD5] pb-4">
          <Link href="/products" className="inline-flex items-center gap-1 hover:text-[#5A3E2B]">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Catalogue
          </Link>
          {product.category?.name && (
            <span className="uppercase font-semibold tracking-wider text-[10px] text-stone-500">
              Category: {product.category.name}
            </span>
          )}
        </div>

        {/* Product Details Grid */}
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-7 space-y-6">
            <ProductGallery images={product.product_images} productName={product.name} />

            {/* Description & Specifications */}
            <div className="bg-white p-6 rounded-2xl border border-[#E6DFD5] shadow-xs space-y-6">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#2C221E] mb-2">
                  Product Description
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed whitespace-pre-line">
                  {product.description || "Crafted with solid wood frame, premium finishes, and meticulous attention to detail by Sai Furniture's master craftsmen."}
                </p>
              </div>

              {/* Specifications Table */}
              <div className="border-t border-[#E6DFD5] pt-5">
                <h4 className="font-semibold text-xs uppercase tracking-wider text-stone-500 mb-3">
                  Product Specifications
                </h4>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-xs">
                  {product.material && (
                    <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#E6DFD5]">
                      <dt className="text-stone-500 font-medium">Primary Material</dt>
                      <dd className="font-semibold text-[#2C221E] mt-0.5">{product.material}</dd>
                    </div>
                  )}
                  {product.dimensions && (
                    <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#E6DFD5]">
                      <dt className="text-stone-500 font-medium">Dimensions</dt>
                      <dd className="font-semibold text-[#2C221E] mt-0.5">{product.dimensions}</dd>
                    </div>
                  )}
                  {product.colour && (
                    <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#E6DFD5]">
                      <dt className="text-stone-500 font-medium">Colour & Polish</dt>
                      <dd className="font-semibold text-[#2C221E] mt-0.5">{product.colour}</dd>
                    </div>
                  )}
                  <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#E6DFD5]">
                    <dt className="text-stone-500 font-medium">Availability Status</dt>
                    <dd className="font-semibold text-[#2C221E] mt-0.5">{stockBadgeLabel}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          {/* Right Column: Title, Pricing & Enquiry Action */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-[#E6DFD5] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${stockBadgeColor}`}>
                  {stockBadgeLabel}
                </span>
                {discountPercent > 0 && (
                  <span className="bg-[#5A3E2B] text-white text-xs font-bold px-2.5 py-1 rounded-md uppercase">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C221E]">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-3 border-y border-[#E6DFD5] py-3">
                <span className="text-3xl font-bold text-[#2C221E]">
                  {formatPrice(product.selling_price)}
                </span>
                {product.original_price && product.original_price > product.selling_price && (
                  <span className="text-sm text-stone-400 line-through">
                    {formatPrice(product.original_price)}
                  </span>
                )}
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-3 pt-1 text-xs text-stone-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#5A3E2B]" />
                  <span>Solid Wood Quality</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#5A3E2B]" />
                  <span>Safe Direct Delivery</span>
                </div>
              </div>
            </div>

            {/* Interactive Enquiry Form */}
            <ProductEnquiryForm product={product} />
          </div>
        </div>
      </div>
    </main>
  );
}
