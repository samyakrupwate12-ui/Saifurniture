import Link from "next/link";
import { fetchPublicCatalogue, fetchPublicCategories } from "@/lib/db";
import ProductCard from "@/components/product/ProductCard";
import { SlidersHorizontal, Search, ArrowLeft, ArrowRight } from "lucide-react";

export const revalidate = 0; // Fresh catalogue data

interface PageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    stock_status?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const page = Number(resolvedParams.page || "1");
  const categorySlug = resolvedParams.category || "";
  const searchQuery = resolvedParams.search || "";
  const stockStatus = resolvedParams.stock_status || "";
  const sortOption = resolvedParams.sort || "";

  const [{ products, total, pageSize, error }, categories] = await Promise.all([
    fetchPublicCatalogue({
      page,
      pageSize: 12,
      categorySlug,
      search: searchQuery,
      stockStatus,
      sort: sortOption as any,
    }),
    fetchPublicCategories(),
  ]);

  const totalPages = Math.ceil(total / pageSize) || 1;

  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#2C221E] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Breadcrumb & Title */}
        <div className="border-b border-[#E6DFD5] pb-6">
          <p className="text-xs text-stone-500 mb-1">
            <Link href="/" className="hover:underline">Home</Link> / <span className="font-semibold text-stone-700">Furniture Catalogue</span>
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#2C221E]">
                Furniture Showroom Catalogue
              </h1>
              <p className="text-sm text-stone-600 mt-1">
                Showing {products.length} of {total} published furniture pieces
              </p>
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white p-4 rounded-2xl border border-[#E6DFD5] shadow-2xs space-y-4">
          <form method="GET" action="/products" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                name="search"
                defaultValue={searchQuery}
                placeholder="Search furniture title..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-[#FAF7F2] border border-[#E6DFD5] text-[#2C221E] focus:outline-none focus:ring-2 focus:ring-[#5A3E2B]/30"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            </div>

            {/* Category Filter */}
            <div>
              <select
                name="category"
                defaultValue={categorySlug}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF7F2] border border-[#E6DFD5] text-[#2C221E] focus:outline-none focus:ring-2 focus:ring-[#5A3E2B]/30"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Availability Filter */}
            <div>
              <select
                name="stock_status"
                defaultValue={stockStatus}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#FAF7F2] border border-[#E6DFD5] text-[#2C221E] focus:outline-none focus:ring-2 focus:ring-[#5A3E2B]/30"
              >
                <option value="">All Availability</option>
                <option value="in_stock">In Stock</option>
                <option value="made_to_order">Made to Order</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>

            {/* Sort Filter & Submit */}
            <div className="flex gap-2">
              <select
                name="sort"
                defaultValue={sortOption}
                className="flex-1 px-3 py-2 text-xs rounded-xl bg-[#FAF7F2] border border-[#E6DFD5] text-[#2C221E] focus:outline-none focus:ring-2 focus:ring-[#5A3E2B]/30"
              >
                <option value="">Sort: Name A-Z</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
              <button
                type="submit"
                className="px-4 py-2 bg-[#5A3E2B] text-white text-xs font-semibold rounded-xl hover:bg-[#432D1F] transition-colors"
              >
                Filter
              </button>
            </div>
          </form>
        </div>

        {/* Product Grid State */}
        {error ? (
          <div className="bg-red-50 text-red-700 p-6 rounded-2xl border border-red-200 text-center">
            <p className="font-semibold text-sm">Unable to load catalogue items.</p>
            <p className="text-xs text-red-600 mt-1">{error}</p>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-2xl border border-dashed border-[#D5C9BD] text-center max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-full bg-[#FAF7F2] border border-[#E6DFD5] flex items-center justify-center mx-auto text-[#5A3E2B] mb-4">
              <SlidersHorizontal className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-bold text-[#2C221E]">No Products Found</h3>
            <p className="text-xs text-stone-600 mt-2">
              There are no published products matching your selected criteria right now.
            </p>
            <div className="mt-5">
              <Link
                href="/products"
                className="px-4 py-2 bg-[#5A3E2B] text-white text-xs font-semibold rounded-xl hover:bg-[#432D1F]"
              >
                Reset Filters
              </Link>
            </div>
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-[#E6DFD5] pt-6 text-xs text-stone-600">
            <span>
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              {page > 1 && (
                <Link
                  href={`/products?page=${page - 1}&category=${categorySlug}&search=${searchQuery}&stock_status=${stockStatus}&sort=${sortOption}`}
                  className="px-3 py-1.5 rounded-lg border border-[#E6DFD5] bg-white hover:bg-[#F3EEE6] flex items-center gap-1 font-medium"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Previous
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={`/products?page=${page + 1}&category=${categorySlug}&search=${searchQuery}&stock_status=${stockStatus}&sort=${sortOption}`}
                  className="px-3 py-1.5 rounded-lg border border-[#E6DFD5] bg-white hover:bg-[#F3EEE6] flex items-center gap-1 font-medium"
                >
                  Next <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
