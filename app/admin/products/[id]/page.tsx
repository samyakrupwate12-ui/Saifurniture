import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import ProductForm from "@/components/admin/ProductForm";
import { ArrowLeft } from "lucide-react";
import type { DBProduct, DBCategory } from "@/types/supabase";

export const revalidate = 0;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;
  const { supabase } = await requireAdmin();

  const [{ data: productData }, { data: categoriesData }] = await Promise.all([
    supabase
      .from("products")
      .select("*, category:categories(id, name), product_images(id, image_url, alt_text, display_order)")
      .eq("id", id)
      .maybeSingle(),
    supabase.from("categories").select("id, name, slug").order("name"),
  ]);

  if (!productData) {
    notFound();
  }

  const product: DBProduct = productData as DBProduct;
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
          <h1 className="text-3xl font-serif font-bold text-stone-900">Edit Product: {product.name}</h1>
          <p className="text-xs text-stone-600 mt-1">
            Update pricing, specifications, images, and publication status.
          </p>
        </div>
      </div>

      <ProductForm product={product} categories={categories} />
    </div>
  );
}
