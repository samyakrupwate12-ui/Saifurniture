import { Suspense } from "react";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { logout } from "../actions";

async function Dashboard() {
  const { supabase, admin } = await requireAdmin();
  const results = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }).eq("is_published", true).eq("is_archived", false),
    supabase.from("products").select("id", { count: "exact", head: true }).eq("is_published", false).eq("is_archived", false),
    supabase.from("products").select("id", { count: "exact", head: true }).eq("is_archived", true),
    supabase.from("products").select("id", { count: "exact", head: true }).eq("stock_status", "out_of_stock").eq("is_archived", false),
    supabase.from("enquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("quotations").select("id", { count: "exact", head: true }).eq("status", "sent"),
  ]);
  if (results.some(r => r.error)) throw new Error("Unable to load dashboard data.");
  const labels = ["Published products", "Draft products", "Archived products", "Out of stock", "New enquiries", "Sent quotations"];
  return <main className="min-h-screen bg-stone-100 text-stone-900 md:flex">
    <aside className="md:w-64 bg-stone-900 text-stone-100 p-8"><p className="text-xs uppercase tracking-widest text-stone-400">Administration</p><h1 className="text-2xl font-semibold mt-3">Sai Furniture</h1><nav className="mt-10 space-y-5"><Link aria-current="page" href="/admin/dashboard" className="block">Overview</Link><Link href="/" className="block text-stone-300">View website ↗</Link></nav><form action={logout} className="mt-10"><button className="text-sm underline">Sign out</button></form></aside>
    <section className="flex-1 p-6 md:p-12"><p className="text-sm text-stone-500">Business overview</p><h2 className="text-3xl font-semibold mt-2">Welcome{admin.full_name ? `, ${admin.full_name}` : " back"}</h2><p className="text-stone-600 mt-3">Your catalogue and customer activity, in one place.</p><div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5 mt-10">{results.map((r,i) => <article key={labels[i]} className="rounded-xl border border-stone-200 bg-white p-6"><h3 className="text-sm text-stone-600">{labels[i]}</h3><p className="text-4xl font-semibold mt-4">{r.count ?? 0}</p></article>)}</div><p className="mt-8 text-sm text-stone-500">Product editing, enquiries and quotation tools will be added in the next implementation stages.</p></section>
  </main>;
}
export default function Page() { return <Suspense fallback={<p className="p-10">Loading dashboard…</p>}><Dashboard /></Suspense>; }
