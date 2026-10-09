import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import EnquiryDetailClient from "@/components/admin/EnquiryDetailClient";
import { ArrowLeft } from "lucide-react";
import type { DBEnquiry } from "@/types/supabase";

export const revalidate = 0;

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EnquiryDetailPage({ params }: PageProps) {
  const { id } = await params;
  const { supabase } = await requireAdmin();

  const { data, error } = await supabase
    .from("enquiries")
    .select("*, product:products(id, name, selling_price, slug)")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    notFound();
  }

  const enquiry: DBEnquiry = data as DBEnquiry;

  return (
    <div className="p-6 md:p-10 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between border-b border-stone-200 pb-4">
        <div>
          <Link
            href="/admin/enquiries"
            className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-[#5A3E2B] mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Inbox
          </Link>
          <h1 className="text-3xl font-serif font-bold text-stone-900">Enquiry Detail</h1>
          <p className="text-xs text-stone-600 mt-1">
            Submitted on {new Date(enquiry.created_at).toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      <EnquiryDetailClient enquiry={enquiry} />
    </div>
  );
}
