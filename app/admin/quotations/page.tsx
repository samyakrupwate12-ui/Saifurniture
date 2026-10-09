import { Suspense } from "react";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { Plus, Search, Eye, FileSpreadsheet, Printer } from "lucide-react";
import type { DBQuotation } from "@/types/supabase";

export const revalidate = 0;

interface PageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
  }>;
}

async function QuotationsList({ searchParams }: PageProps) {
  const { supabase } = await requireAdmin();
  const resolvedParams = await searchParams;

  const searchQuery = resolvedParams.search || "";
  const statusFilter = resolvedParams.status || "all";

  let query = supabase
    .from("quotations")
    .select("*, quotation_items(*)")
    .order("created_at", { ascending: false });

  if (searchQuery) {
    query = query.or(`customer_name.ilike.%${searchQuery}%,quotation_number.ilike.%${searchQuery}%`);
  }

  if (statusFilter && statusFilter !== "all") {
    query = query.eq("status", statusFilter);
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(`Unable to load quotations: ${error.message}`);
  }

  const quotations: DBQuotation[] = (data as DBQuotation[]) || [];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="p-6 md:p-10 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <p className="text-xs uppercase tracking-widest font-semibold text-stone-500">Sales & Pricing</p>
          <h1 className="text-3xl font-serif font-bold text-stone-900 mt-1">
            Quotations Manager ({quotations.length})
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            Create, manage, preview, and print official price estimates for customers.
          </p>
        </div>

        <Link
          href="/admin/quotations/new"
          className="px-4 py-2.5 rounded-xl bg-[#5A3E2B] text-white text-xs font-semibold hover:bg-[#432D1F] transition-colors shadow-2xs flex items-center gap-2 w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Quotation</span>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
        <form method="GET" action="/admin/quotations" className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative col-span-2">
            <input
              type="text"
              name="search"
              defaultValue={searchQuery}
              placeholder="Search customer name or quotation number (e.g. QT-2026)..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-stone-50 border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#5A3E2B]/40"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          </div>

          <div className="flex gap-2">
            <select
              name="status"
              defaultValue={statusFilter}
              className="flex-1 px-3 py-2 text-xs rounded-xl bg-stone-50 border border-stone-300 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#5A3E2B]/40"
            >
              <option value="all">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
              <option value="expired">Expired</option>
            </select>
            <button
              type="submit"
              className="px-4 py-2 bg-[#5A3E2B] text-white text-xs font-semibold rounded-xl hover:bg-[#432D1F]"
            >
              Filter
            </button>
          </div>
        </form>
      </div>

      {/* Quotations Table */}
      {quotations.length > 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-50 text-stone-500 uppercase font-semibold text-[10px] border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Quotation No.</th>
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-4">Line Items</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {quotations.map((q) => (
                  <tr key={q.id} className="hover:bg-stone-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#5A3E2B]">
                      {q.quotation_number}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-stone-900">
                      {q.customer_name}
                      {q.customer_phone && (
                        <span className="block text-[10px] text-stone-400 font-normal">
                          {q.customer_phone}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-stone-600">
                      {q.quotation_items?.length || 0} item(s)
                    </td>
                    <td className="py-3.5 px-4 font-bold text-stone-900">
                      {formatPrice(q.total)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase ${
                          q.status === "accepted"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            : q.status === "sent"
                            ? "bg-blue-100 text-blue-800 border border-blue-200"
                            : q.status === "rejected"
                            ? "bg-rose-100 text-rose-800 border border-rose-200"
                            : q.status === "expired"
                            ? "bg-amber-100 text-amber-800 border border-amber-200"
                            : "bg-stone-100 text-stone-600 border border-stone-200"
                        }`}
                      >
                        {q.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-stone-500">
                      {new Date(q.created_at).toLocaleDateString("en-IN")}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/quotations/${q.id}`}
                          className="p-1.5 rounded-lg bg-stone-100 text-stone-700 hover:bg-[#5A3E2B] hover:text-white transition-colors"
                          title="View & Edit Quotation"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white p-12 rounded-2xl border border-dashed border-stone-300 text-center max-w-md mx-auto">
          <FileSpreadsheet className="w-8 h-8 text-stone-400 mx-auto mb-3" />
          <h3 className="font-serif font-bold text-base text-stone-900">No Quotations Found</h3>
          <p className="text-xs text-stone-500 mt-1">
            No official quotations have been generated matching your query.
          </p>
          <div className="mt-5">
            <Link
              href="/admin/quotations/new"
              className="px-4 py-2 bg-[#5A3E2B] text-white text-xs font-semibold rounded-xl hover:bg-[#432D1F]"
            >
              Create First Quotation
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Page({ searchParams }: PageProps) {
  return (
    <Suspense fallback={<p className="p-10 text-xs text-stone-500">Loading quotations...</p>}>
      <QuotationsList searchParams={searchParams} />
    </Suspense>
  );
}
