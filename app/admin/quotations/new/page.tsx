import Link from "next/link";
import { notFound } from "next/navigation";
import { UUID_PATTERN } from "@/lib/enquiries";
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

  const { data: productsData, error: productsError } = await supabase
    .from("products")
    .select("id, name, selling_price, material, dimensions")
    .eq("is_archived", false)
    .order("name");

  if (productsError) throw new Error("Unable to load catalogue products. Please try again.");
  let enquiry = null;
  if (resolvedParams.enquiry_id) {
    if (!UUID_PATTERN.test(resolvedParams.enquiry_id)) notFound();
    const { data, error } = await supabase.from("enquiries")
      .select("*, product:products(id,name,selling_price,material,dimensions)")
      .eq("id", resolvedParams.enquiry_id).maybeSingle();
    if (error) throw new Error("Unable to load enquiry details. Please try again.");
    if (!data) notFound();
    enquiry = data;
  }

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
        defaultCustomerName={enquiry?.customer_name || resolvedParams.customer_name || ""}
        defaultCustomerPhone={enquiry?.phone || resolvedParams.customer_phone || ""}
        defaultCustomerEmail={enquiry?.email || resolvedParams.customer_email || ""}
        defaultEnquiryId={enquiry?.id || ""}
        defaultItems={enquiry?.product ? [{
          product_id: enquiry.product.id, item_name: enquiry.product.name,
          description: [enquiry.product.material, enquiry.product.dimensions].filter(Boolean).join(" — "),
          quantity: enquiry.quantity, unit_price: enquiry.product.selling_price,
        }] : undefined}
      />
    </div>
  );
}
