import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, ShieldCheck, Truck, SlidersHorizontal, MessageSquareText, Sofa, Bed, Utensils, Armchair, Archive, Tv } from "lucide-react";
import { fetchPublicCatalogue, fetchPublicCategories } from "@/lib/db";
import ProductCard from "@/components/product/ProductCard";

export const revalidate = 0; // Fresh catalogue data

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  sofas: <Sofa className="w-6 h-6 text-[#5A3E2B]" />,
  beds: <Bed className="w-6 h-6 text-[#5A3E2B]" />,
  dining: <Utensils className="w-6 h-6 text-[#5A3E2B]" />,
  chairs: <Armchair className="w-6 h-6 text-[#5A3E2B]" />,
  storage: <Archive className="w-6 h-6 text-[#5A3E2B]" />,
  "tv-units": <Tv className="w-6 h-6 text-[#5A3E2B]" />,
};

export default async function HomePage() {
  const [{ products, total }, categories] = await Promise.all([
    fetchPublicCatalogue({ pageSize: 6 }),
    fetchPublicCategories(),
  ]);

  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#2C221E]">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-gradient-to-b from-[#F3EEE6] to-[#FAF7F2] border-b border-[#E6DFD5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF7F2] border border-[#E6DFD5] text-xs font-semibold text-[#5A3E2B] shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" />
                <span>Handcrafted Furniture Showroom</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#2C221E] tracking-tight leading-[1.15]">
                Timeless Wooden Designs for Warm, Modern Homes
              </h1>
              <p className="text-base sm:text-lg text-stone-600 max-w-2xl leading-relaxed">
                Discover our curated collection of handcrafted solid wood sofas, beds, dining sets, and cabinets. Built with enduring craftsmanship and custom polish options.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/products"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#5A3E2B] text-white font-semibold text-sm hover:bg-[#432D1F] transition-all shadow-sm flex items-center justify-center gap-2 group"
                >
                  <span>Explore Furniture Catalogue</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="#categories"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#FAF7F2] border border-[#E6DFD5] text-[#2C221E] font-semibold text-sm hover:bg-[#F3EEE6] transition-colors flex items-center justify-center gap-2"
                >
                  <SlidersHorizontal className="w-4 h-4 text-[#5A3E2B]" />
                  <span>Browse Categories</span>
                </Link>
              </div>

              {/* Feature Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 text-left border-t border-[#E6DFD5]/80 max-w-xl mx-auto lg:mx-0">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-[#5A3E2B] shrink-0" />
                  <span className="text-xs font-medium text-stone-700">Solid Teak Wood</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Truck className="w-5 h-5 text-[#5A3E2B] shrink-0" />
                  <span className="text-xs font-medium text-stone-700">Direct Delivery</span>
                </div>
                <div className="flex items-center gap-2.5 col-span-2 sm:col-span-1">
                  <MessageSquareText className="w-5 h-5 text-[#5A3E2B] shrink-0" />
                  <span className="text-xs font-medium text-stone-700">Custom Dimensions</span>
                </div>
              </div>
            </div>

            {/* Hero Right Graphic */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none aspect-[4/3] rounded-3xl overflow-hidden border border-[#E6DFD5] shadow-xl bg-stone-200">
                <Image
                  src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80"
                  alt="Sai Furniture Living Room Showcase"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 45vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="text-xs font-medium uppercase tracking-widest text-[#D4A373]">Showroom Highlight</span>
                  <h3 className="text-xl font-serif font-bold mt-1">Living Room Elegance</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Browsing Section */}
      <section id="categories" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#5A3E2B]">Explore Collections</p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#2C221E] mt-2">
              Browse by Furniture Category
            </h2>
          </div>
          <Link
            href="/products"
            className="mt-4 md:mt-0 text-sm font-semibold text-[#5A3E2B] hover:underline flex items-center gap-1"
          >
            <span>View all products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {categories.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="group p-5 rounded-2xl bg-white border border-[#E6DFD5] hover:border-[#5A3E2B] text-center hover:shadow-md transition-all flex flex-col items-center justify-center space-y-3"
              >
                <div className="w-12 h-12 rounded-xl bg-[#F3EEE6] group-hover:bg-[#5A3E2B]/10 flex items-center justify-center transition-colors">
                  {CATEGORY_ICONS[cat.slug] || <SlidersHorizontal className="w-6 h-6 text-[#5A3E2B]" />}
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-[#2C221E] group-hover:text-[#5A3E2B] transition-colors">
                    {cat.name}
                  </h3>
                  {cat.description && (
                    <p className="text-[11px] text-stone-500 mt-1 line-clamp-1">{cat.description}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: "Sofas", slug: "sofas" },
              { name: "Beds", slug: "beds" },
              { name: "Dining", slug: "dining" },
              { name: "Chairs", slug: "chairs" },
              { name: "Storage", slug: "storage" },
              { name: "TV Units", slug: "tv-units" },
            ].map((cat) => (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}`}
                className="group p-5 rounded-2xl bg-white border border-[#E6DFD5] hover:border-[#5A3E2B] text-center hover:shadow-md transition-all flex flex-col items-center justify-center space-y-3"
              >
                <div className="w-12 h-12 rounded-xl bg-[#F3EEE6] group-hover:bg-[#5A3E2B]/10 flex items-center justify-center transition-colors">
                  {CATEGORY_ICONS[cat.slug] || <SlidersHorizontal className="w-6 h-6 text-[#5A3E2B]" />}
                </div>
                <h3 className="font-semibold text-sm text-[#2C221E] group-hover:text-[#5A3E2B] transition-colors">
                  {cat.name}
                </h3>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Featured Published Products Section */}
      <section className="py-16 md:py-24 bg-[#F3EEE6]/60 border-y border-[#E6DFD5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#5A3E2B]">Showroom Highlights</p>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#2C221E] mt-2">
                Featured Furniture Pieces
              </h2>
            </div>
            <Link
              href="/products"
              className="mt-4 md:mt-0 text-sm font-semibold text-[#5A3E2B] hover:underline flex items-center gap-1"
            >
              <span>Browse full catalogue</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#D5C9BD] bg-[#FAF7F2] p-12 text-center max-w-lg mx-auto">
              <div className="w-14 h-14 rounded-full bg-[#F3EEE6] flex items-center justify-center mx-auto text-[#5A3E2B] mb-4">
                <SlidersHorizontal className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-[#2C221E]">Catalogue Updated Regularly</h3>
              <p className="text-sm text-stone-600 mt-2">
                Our active database currently has no published products to display publicly. Visit our admin portal to add products or check back soon.
              </p>
              <div className="mt-6 flex items-center justify-center gap-3">
                <Link
                  href="/products"
                  className="px-5 py-2.5 rounded-xl bg-[#5A3E2B] text-white text-xs font-medium hover:bg-[#432D1F]"
                >
                  Browse Catalogue
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Craftsmanship & Made-to-Order Promo */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#2C221E] text-white p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-xl">
          <div className="max-w-2xl relative z-10 space-y-6">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#D4A373]">
              Custom Furniture Craftsmanship
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold leading-tight">
              Have Specific Dimensions or Finish in Mind?
            </h2>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              Sai Furniture specializes in bespoke wooden furniture crafted to fit your room dimensions, upholstery choices, and stain finishes. Contact our team to submit a custom furniture enquiry.
            </p>
            <div className="pt-2">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#5A3E2B] text-white font-semibold text-sm hover:bg-[#6E4B34] transition-colors"
              >
                <MessageSquareText className="w-4 h-4 text-[#D4A373]" />
                <span>Submit a Product Enquiry</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
