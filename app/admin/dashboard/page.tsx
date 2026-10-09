import { Suspense } from "react";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import {
  Package,
  PackageCheck,
  PackageMinus,
  Archive,
  MessageSquare,
  FileSpreadsheet,
  Plus,
  ArrowRight,
  Clock,
  UserCheck,
} from "lucide-react";

export const revalidate = 0; // Fresh metrics

async function Dashboard() {
  const { supabase, admin } = await requireAdmin();

  const [
    publishedRes,
    draftRes,
    archivedRes,
    outOfStockRes,
    newEnquiriesRes,
    sentQuotationsRes,
    recentEnquiriesRes,
  ] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }).eq("is_published", true).eq("is_archived", false),
    supabase.from("products").select("id", { count: "exact", head: true }).eq("is_published", false).eq("is_archived", false),
    supabase.from("products").select("id", { count: "exact", head: true }).eq("is_archived", true),
    supabase.from("products").select("id", { count: "exact", head: true }).eq("stock_status", "out_of_stock").eq("is_archived", false),
    supabase.from("enquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("quotations").select("id", { count: "exact", head: true }).eq("status", "sent"),
    supabase.from("enquiries").select("id, customer_name, customer_phone, status, created_at, product:products(name)").order("created_at", { ascending: false }).limit(5),
  ]);

  if ([publishedRes, draftRes, archivedRes, outOfStockRes, newEnquiriesRes, sentQuotationsRes].some((r) => r.error)) {
    throw new Error("Unable to load real dashboard metrics from database.");
  }

  const metrics = [
    { label: "Published Products", count: publishedRes.count ?? 0, icon: PackageCheck, color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
    { label: "Draft Products", count: draftRes.count ?? 0, icon: Package, color: "text-amber-700 bg-amber-50 border-amber-200" },
    { label: "Archived Products", count: archivedRes.count ?? 0, icon: Archive, color: "text-stone-700 bg-stone-100 border-stone-200" },
    { label: "Out of Stock", count: outOfStockRes.count ?? 0, icon: PackageMinus, color: "text-rose-700 bg-rose-50 border-rose-200" },
    { label: "New Customer Enquiries", count: newEnquiriesRes.count ?? 0, icon: MessageSquare, color: "text-blue-700 bg-blue-50 border-blue-200" },
    { label: "Sent Quotations", count: sentQuotationsRes.count ?? 0, icon: FileSpreadsheet, color: "text-purple-700 bg-purple-50 border-purple-200" },
  ];

  const recentEnquiries = recentEnquiriesRes.data || [];

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <p className="text-xs uppercase tracking-widest font-semibold text-stone-500">Overview</p>
          <h1 className="text-3xl font-serif font-bold text-stone-900 mt-1">
            Welcome{admin.full_name ? `, ${admin.full_name}` : " back"}
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            Live metrics across your furniture catalogue, customer enquiries, and active quotations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/new"
            className="px-4 py-2.5 rounded-xl bg-[#5A3E2B] text-white text-xs font-semibold hover:bg-[#432D1F] transition-colors shadow-2xs flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>
          <Link
            href="/admin/quotations/new"
            className="px-4 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-800 text-xs font-semibold hover:bg-stone-50 transition-colors shadow-2xs flex items-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#5A3E2B]" />
            <span>New Quotation</span>
          </Link>
        </div>
      </div>

      {/* Real Count Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <article
              key={m.label}
              className="rounded-2xl border border-stone-200 bg-white p-6 shadow-2xs flex items-center justify-between"
            >
              <div>
                <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wider">{m.label}</h3>
                <p className="text-3xl font-bold text-stone-900 mt-3">{m.count}</p>
              </div>
              <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${m.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </article>
          );
        })}
      </div>

      {/* Recent Enquiries & Management Shortcuts */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Recent Enquiries Inbox Table */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div>
              <h3 className="font-serif font-bold text-lg text-stone-900">Recent Customer Enquiries</h3>
              <p className="text-xs text-stone-500 mt-0.5">Latest customer messages from your storefront</p>
            </div>
            <Link
              href="/admin/enquiries"
              className="text-xs font-semibold text-[#5A3E2B] hover:underline flex items-center gap-1"
            >
              <span>View Inbox</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentEnquiries.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-stone-50 text-stone-500 uppercase font-semibold text-[10px] border-y border-stone-200">
                  <tr>
                    <th className="py-2.5 px-3">Customer</th>
                    <th className="py-2.5 px-3">Phone</th>
                    <th className="py-2.5 px-3">Product</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {recentEnquiries.map((enq: any) => (
                    <tr key={enq.id} className="hover:bg-stone-50 transition-colors">
                      <td className="py-3 px-3 font-semibold text-stone-900">{enq.customer_name}</td>
                      <td className="py-3 px-3">{enq.customer_phone}</td>
                      <td className="py-3 px-3">{enq.product?.name || "General Furniture"}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase ${
                            enq.status === "new"
                              ? "bg-blue-100 text-blue-800"
                              : enq.status === "in_progress"
                              ? "bg-amber-100 text-amber-800"
                              : enq.status === "quoted"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-stone-100 text-stone-600"
                          }`}
                        >
                          {enq.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-stone-400">
                        {new Date(enq.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-stone-500 border border-dashed border-stone-200 rounded-xl">
              No customer enquiries received yet.
            </div>
          )}
        </div>

        {/* Quick Action Navigation */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
          <h3 className="font-serif font-bold text-lg text-stone-900 border-b border-stone-100 pb-3">
            Quick Actions
          </h3>

          <div className="space-y-2.5">
            <Link
              href="/admin/products"
              className="flex items-center justify-between p-3.5 rounded-xl border border-stone-200 hover:border-[#5A3E2B] hover:bg-stone-50 transition-all text-xs font-medium text-stone-900"
            >
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4 text-[#5A3E2B]" />
                <span>Manage Catalogue Products</span>
              </div>
              <ArrowRight className="w-4 h-4 text-stone-400" />
            </Link>

            <Link
              href="/admin/categories"
              className="flex items-center justify-between p-3.5 rounded-xl border border-stone-200 hover:border-[#5A3E2B] hover:bg-stone-50 transition-all text-xs font-medium text-stone-900"
            >
              <div className="flex items-center gap-3">
                <PackageCheck className="w-4 h-4 text-[#5A3E2B]" />
                <span>Manage Categories</span>
              </div>
              <ArrowRight className="w-4 h-4 text-stone-400" />
            </Link>

            <Link
              href="/admin/enquiries"
              className="flex items-center justify-between p-3.5 rounded-xl border border-stone-200 hover:border-[#5A3E2B] hover:bg-stone-50 transition-all text-xs font-medium text-stone-900"
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4 text-[#5A3E2B]" />
                <span>Customer Enquiries Inbox</span>
              </div>
              <ArrowRight className="w-4 h-4 text-stone-400" />
            </Link>

            <Link
              href="/admin/quotations"
              className="flex items-center justify-between p-3.5 rounded-xl border border-stone-200 hover:border-[#5A3E2B] hover:bg-stone-50 transition-all text-xs font-medium text-stone-900"
            >
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="w-4 h-4 text-[#5A3E2B]" />
                <span>Quotations Manager</span>
              </div>
              <ArrowRight className="w-4 h-4 text-stone-400" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<p className="p-10 text-xs text-stone-500">Loading live dashboard metrics…</p>}>
      <Dashboard />
    </Suspense>
  );
}
