import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { requireAdmin } from "@/lib/auth";
import {
  togglePublishProductAction,
  toggleArchiveProductAction,
} from "../admin-actions";
import {
  Plus,
  Search,
  Edit,
  Eye,
  EyeOff,
  Archive,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";
import type { DBProduct, DBCategory } from "@/types/supabase";

export const revalidate = 0; // Fresh product listing

interface PageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    status?: string; // published, draft, archived, all
  }>;
}

async function ProductsList({ searchParams }: PageProps) {
  const { supabase } = await requireAdmin();
  const resolvedParams = await searchParams;

  const searchQuery = resolvedParams.search || "";
  const categoryId = resolvedParams.category || "";
  const statusFilter = resolvedParams.status || "active"; // active (non-archived), published, draft, archived, all

  const [{ data: categoriesData }, productsQuery] = await Promise.all([
    supabase.from("categories").select("id, name").order("name"),
    (() => {
      let query = supabase
        .from("products")
        .select("*, category:categories(id, name, slug), product_images(id, image_url, display_order)")
        .order("created_at", { ascending: false });

      if (searchQuery) {
        query = query.ilike("name", `%${searchQuery}%`);
      }
      if (categoryId) {
        query = query.eq("category_id", categoryId);
      }

      if (statusFilter === "published") {
        query = query.eq("is_published", true).eq("is_archived", false);
      } else if (statusFilter === "draft") {
        query = query.eq("is_published", false).eq("is_archived", false);
      } else if (statusFilter === "archived") {
        query = query.eq("is_archived", true);
      } else if (statusFilter === "active") {
        query = query.eq("is_archived", false);
      }

      return query;
    })(),
  ]);

  const categories: DBCategory[] = (categoriesData as DBCategory[]) || [];
  const products: DBProduct[] = (productsQuery.data as DBProduct[]) || [];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="p-6 md:p-10 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <p className="text-xs uppercase tracking-widest font-semibold text-stone-500">Catalogue Management</p>
          <h1 className="text-3xl font-serif font-bold text-stone-900 mt-1">
            Products ({products.length})
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            Create, edit, publish, or archive furniture items across your showroom catalogue.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="px-4 py-2.5 rounded-xl bg-[#5A3E2B] text-white text-xs font-semibold hover:bg-[#432D1F] transition-colors shadow-2xs flex items-center gap-2 w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Product</span>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
        <form method="GET" action="/admin/products" className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <div className="relative">
            <input
              type="text"
              name="search"
              defaultValue={searchQuery}
              placeholder="Search product title..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-stone-50 border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#5A3E2B]/40"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          </div>

          <div>
            <select
              name="category"
              defaultValue={categoryId}
              className="w-full px-3 py-2 text-xs rounded-xl bg-stone-50 border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#5A3E2B]/40"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              name="status"
              defaultValue={statusFilter}
              className="w-full px-3 py-2 text-xs rounded-xl bg-stone-50 border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#5A3E2B]/40"
            >
              <option value="active">Active Non-Archived</option>
              <option value="published">Published Only</option>
              <option value="draft">Drafts Only</option>
              <option value="archived">Archived Only</option>
              <option value="all">All Statuses</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="w-full py-2 px-4 bg-[#5A3E2B] text-white text-xs font-semibold rounded-xl hover:bg-[#432D1F] transition-colors"
            >
              Apply Filter
            </button>
          </div>
        </form>
      </div>

      {/* Products Table & Cards */}
      {products.length > 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-50 text-stone-500 uppercase font-semibold text-[10px] border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Item</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Availability</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {products.map((p) => {
                  const firstImg = p.product_images && p.product_images.length > 0
                    ? p.product_images[0].image_url
                    : "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=300&q=80";

                  return (
                    <tr key={p.id} className="hover:bg-stone-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-xl bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                            <Image
                              src={firstImg}
                              alt={p.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <span className="font-semibold text-stone-900 block line-clamp-1">{p.name}</span>
                            <span className="text-[10px] text-stone-400 font-mono">/{p.slug}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-stone-600 font-medium">
                        {p.category?.name || "Uncategorized"}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-stone-900">{formatPrice(p.selling_price)}</span>
                        {p.original_price && p.original_price > p.selling_price && (
                          <span className="block text-[10px] text-stone-400 line-through">
                            {formatPrice(p.original_price)}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase ${
                            p.stock_status === "in_stock"
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : p.stock_status === "made_to_order"
                              ? "bg-amber-50 text-amber-800 border border-amber-200"
                              : "bg-stone-100 text-stone-600 border border-stone-200"
                          }`}
                        >
                          {p.stock_status.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {p.is_archived ? (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-stone-100 text-stone-600 border border-stone-200 uppercase">
                            Archived
                          </span>
                        ) : p.is_published ? (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 uppercase">
                            Published
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-300 uppercase">
                            Draft
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/admin/products/${p.id}`}
                            className="p-1.5 rounded-lg bg-stone-100 text-stone-700 hover:bg-[#5A3E2B] hover:text-white transition-colors"
                            title="Edit Product"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Link>

                          {/* Quick Publish / Unpublish Toggle */}
                          {!p.is_archived && (
                            <form action={togglePublishProductAction.bind(null, p.id, !p.is_published)}>
                              <button
                                type="submit"
                                className={`p-1.5 rounded-lg border transition-colors ${
                                  p.is_published
                                    ? "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100"
                                    : "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                                }`}
                                title={p.is_published ? "Unpublish Product" : "Publish Product"}
                              >
                                {p.is_published ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                            </form>
                          )}

                          {/* Archive / Restore Toggle */}
                          <form action={toggleArchiveProductAction.bind(null, p.id, !p.is_archived)}>
                            <button
                              type="submit"
                              className={`p-1.5 rounded-lg border transition-colors ${
                                p.is_archived
                                  ? "bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100"
                                  : "bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200"
                              }`}
                              title={p.is_archived ? "Restore Product" : "Archive Product"}
                            >
                              {p.is_archived ? <RotateCcw className="w-3.5 h-3.5" /> : <Archive className="w-3.5 h-3.5" />}
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white p-12 rounded-2xl border border-dashed border-stone-300 text-center max-w-md mx-auto">
          <SlidersHorizontal className="w-8 h-8 text-stone-400 mx-auto mb-3" />
          <h3 className="font-serif font-bold text-base text-stone-900">No Products Found</h3>
          <p className="text-xs text-stone-500 mt-1">
            No furniture products match your current search or filter query.
          </p>
          <div className="mt-5">
            <Link
              href="/admin/products/new"
              className="px-4 py-2 bg-[#5A3E2B] text-white text-xs font-semibold rounded-xl hover:bg-[#432D1F]"
            >
              Add First Product
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Page({ searchParams }: PageProps) {
  return (
    <Suspense fallback={<p className="p-10 text-xs text-stone-500">Loading products dataset…</p>}>
      <ProductsList searchParams={searchParams} />
    </Suspense>
  );
}
