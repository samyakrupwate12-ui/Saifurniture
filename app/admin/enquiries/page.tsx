import { Suspense } from "react";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { Search, MessageSquare, ArrowRight, Eye, Phone, Mail } from "lucide-react";
import type { DBEnquiry } from "@/types/supabase";

export const revalidate = 0;

interface PageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
  }>;
}

async function EnquiriesList({ searchParams }: PageProps) {
  const { supabase } = await requireAdmin();
  const resolvedParams = await searchParams;

  const searchQuery = resolvedParams.search || "";
  const statusFilter = resolvedParams.status || "all";

  let query = supabase
    .from("enquiries")
    .select("*, product:products(id, name, selling_price, slug)")
    .order("created_at", { ascending: false });

  if (searchQuery) {
    query = query.or(`customer_name.ilike.%${searchQuery}%,customer_phone.ilike.%${searchQuery}%,customer_email.ilike.%${searchQuery}%`);
  }

  if (statusFilter && statusFilter !== "all") {
    query = query.eq("status", statusFilter);
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(`Unable to load customer enquiries: ${error.message}`);
  }

  const enquiries: DBEnquiry[] = (data as DBEnquiry[]) || [];

  return (
    <div className="p-6 md:p-10 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <p className="text-xs uppercase tracking-widest font-semibold text-stone-500">Customer Communication</p>
          <h1 className="text-3xl font-serif font-bold text-stone-900 mt-1">
            Enquiries Inbox ({enquiries.length})
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            Review customer product enquiries submitted through your storefront.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
        <form method="GET" action="/admin/enquiries" className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative col-span-2">
            <input
              type="text"
              name="search"
              defaultValue={searchQuery}
              placeholder="Search customer name, phone, or email..."
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
              <option value="new">New</option>
              <option value="in_progress">In Progress</option>
              <option value="quoted">Quoted</option>
              <option value="closed">Closed</option>
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

      {/* Enquiries Table */}
      {enquiries.length > 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-50 text-stone-500 uppercase font-semibold text-[10px] border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Requested Item</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Received Date</th>
                  <th className="py-3 px-4 text-right">View Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {enquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-stone-50 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-stone-900">
                      {enq.customer_name}
                    </td>
                    <td className="py-3.5 px-4 space-y-0.5">
                      <div className="flex items-center gap-1.5 font-medium text-stone-800">
                        <Phone className="w-3 h-3 text-[#5A3E2B]" />
                        <span>{enq.customer_phone}</span>
                      </div>
                      {enq.customer_email && (
                        <div className="flex items-center gap-1.5 text-stone-500 text-[11px]">
                          <Mail className="w-3 h-3 text-stone-400" />
                          <span>{enq.customer_email}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-stone-900 block">{enq.product?.name || "General Showroom Query"}</span>
                      <span className="text-[10px] text-stone-400">Qty: {enq.quantity}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase ${
                          enq.status === "new"
                            ? "bg-blue-100 text-blue-800 border border-blue-200"
                            : enq.status === "in_progress"
                            ? "bg-amber-100 text-amber-800 border border-amber-200"
                            : enq.status === "quoted"
                            ? "bg-purple-100 text-purple-800 border border-purple-200"
                            : "bg-stone-100 text-stone-600 border border-stone-200"
                        }`}
                      >
                        {enq.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-stone-500">
                      {new Date(enq.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/admin/enquiries/${enq.id}`}
                        className="p-1.5 rounded-lg bg-stone-100 text-stone-700 hover:bg-[#5A3E2B] hover:text-white transition-colors inline-flex items-center gap-1 font-medium"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white p-12 rounded-2xl border border-dashed border-stone-300 text-center max-w-md mx-auto">
          <MessageSquare className="w-8 h-8 text-stone-400 mx-auto mb-3" />
          <h3 className="font-serif font-bold text-base text-stone-900">No Enquiries Found</h3>
          <p className="text-xs text-stone-500 mt-1">
            No customer enquiries match your current filter query.
          </p>
        </div>
      )}
    </div>
  );
}

export default function Page({ searchParams }: PageProps) {
  return (
    <Suspense fallback={<p className="p-10 text-xs text-stone-500">Loading inbox...</p>}>
      <EnquiriesList searchParams={searchParams} />
    </Suspense>
  );
}
