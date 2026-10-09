import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import QuotationForm from "@/components/admin/QuotationForm";
import { ArrowLeft } from "lucide-react";
import type { DBProduct } from "@/types/supabase";

export const revalidate = 0;

interface PageProps {
  searchParams: Promise<{
    enquiry_id?: string;
    customer_name?: string;
    customer_phone?: string;
    customer_email?: string;
  }>;
}

export default async function NewQuotationPage({ searchParams }: PageProps) {
  const { supabase } = await requireAdmin();
  const resolvedParams = await searchParams;

  const { data: productsData } = await supabase
    .from("products")
    .select("id, name, selling_price, material, dimensions")
    .eq("is_archived", false)
    .order("name");

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
          <h1 className="text-3xl font-serif font-bold text-stone-900">Create Official Quotation</h1>
          <p className="text-xs text-stone-600 mt-1">
            Build and calculate a custom price estimate for your customer.
          </p>
        </div>
      </div>

      <QuotationForm
        products={products}
        defaultCustomerName={resolvedParams.customer_name || ""}
        defaultCustomerPhone={resolvedParams.customer_phone || ""}
        defaultCustomerEmail={resolvedParams.customer_email || ""}
        defaultEnquiryId={resolvedParams.enquiry_id || ""}
      />
    </div>
  );
}
