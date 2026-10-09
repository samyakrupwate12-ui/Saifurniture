import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import ProductForm from "@/components/admin/ProductForm";
import { ArrowLeft } from "lucide-react";
import type { DBCategory } from "@/types/supabase";

export const revalidate = 0;

export default async function NewProductPage() {
  const { supabase } = await requireAdmin();

  const { data: categoriesData } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("name");

  const categories: DBCategory[] = (categoriesData as DBCategory[]) || [];

  return (
    <div className="p-6 md:p-10 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between border-b border-stone-200 pb-4">
        <div>
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-[#5A3E2B] mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Products
          </Link>
          <h1 className="text-3xl font-serif font-bold text-stone-900">Create New Product</h1>
          <p className="text-xs text-stone-600 mt-1">
            Add a new furniture item to your showroom catalogue.
          </p>
        </div>
      </div>

      <ProductForm categories={categories} />
    </div>
  );
}
