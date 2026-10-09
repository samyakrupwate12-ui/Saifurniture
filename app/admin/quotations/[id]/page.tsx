import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import QuotationForm from "@/components/admin/QuotationForm";
import { ArrowLeft } from "lucide-react";
import type { DBQuotation, DBProduct } from "@/types/supabase";

export const revalidate = 0;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditQuotationPage({ params }: PageProps) {
  const { id } = await params;
  const { supabase } = await requireAdmin();

  const [{ data: quotationData }, { data: productsData }] = await Promise.all([
    supabase
      .from("quotations")
      .select("*, quotation_items(*)")
      .eq("id", id)
      .maybeSingle(),
    supabase.from("products").select("id, name, selling_price, material, dimensions").eq("is_archived", false).order("name"),
  ]);

  if (!quotationData) {
    notFound();
  }

  const quotation: DBQuotation = quotationData as DBQuotation;
  const products: DBProduct[] = (productsData as DBProduct[]) || [];

  return (
    <div className="p-6 md:p-10 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between border-b border-stone-200 pb-4 print:hidden">
        <div>
          <Link
            href="/admin/quotations"
            className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-[#5A3E2B] mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Quotations
          </Link>
          <h1 className="text-3xl font-serif font-bold text-stone-900">
            Quotation: {quotation.quotation_number}
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            Customer: {quotation.customer_name}
          </p>
        </div>
      </div>

      <QuotationForm quotation={quotation} products={products} />
    </div>
  );
}
