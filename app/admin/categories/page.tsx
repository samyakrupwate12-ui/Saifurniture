import { Suspense } from "react";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import CategoryManagerClient from "@/components/admin/CategoryManagerClient";

export const revalidate = 0;

export default async function CategoriesPage() {
  const { supabase } = await requireAdmin();

  // Query categories along with product count per category
  const { data: categoriesData, error } = await supabase
    .from("categories")
    .select("*, products:products(id)")
    .order("name");

  if (error) {
    throw new Error(`Unable to load categories: ${error.message}`);
  }

  const categories = (categoriesData || []).map((cat: any) => ({
    ...cat,
    product_count: cat.products?.length || 0,
  }));

  return (
    <div className="p-6 md:p-10 space-y-6 max-w-5xl mx-auto">
      <div className="border-b border-stone-200 pb-4">
        <p className="text-xs uppercase tracking-widest font-semibold text-stone-500">Catalogue Structure</p>
        <h1 className="text-3xl font-serif font-bold text-stone-900 mt-1">
          Categories ({categories.length})
        </h1>
        <p className="text-xs text-stone-600 mt-1">
          Organize your furniture catalogue into logical collections like Sofas, Beds, Dining, and Storage.
        </p>
      </div>

      <Suspense fallback={<p className="text-xs text-stone-500">Loading categories...</p>}>
        <CategoryManagerClient initialCategories={categories} />
      </Suspense>
    </div>
  );
}
