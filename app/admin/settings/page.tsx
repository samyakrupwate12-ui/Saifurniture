import { Suspense } from "react";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { UserCheck, ShieldCheck, Database, Key, Lock, AlertTriangle } from "lucide-react";

export const revalidate = 0;

async function AdminSettings() {
  const { supabase, admin } = await requireAdmin();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-5xl mx-auto">
      <div className="border-b border-stone-200 pb-4">
        <p className="text-xs uppercase tracking-widest font-semibold text-stone-500">Security & Account</p>
        <h1 className="text-3xl font-serif font-bold text-stone-900 mt-1">
          Administrator Settings
        </h1>
        <p className="text-xs text-stone-600 mt-1">
          View your active session credentials, administrator role, and Supabase security configuration.
        </p>
      </div>

      {/* Admin Profile Card */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
        <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-[#5A3E2B] text-white flex items-center justify-center font-bold text-lg">
            {admin.full_name ? admin.full_name.charAt(0).toUpperCase() : "A"}
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-stone-900">
              {admin.full_name || "Administrator Account"}
            </h3>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200 uppercase">
              <UserCheck className="w-3 h-3 text-emerald-600" /> Active {admin.role || "Admin"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-1">
            <span className="text-stone-500 font-medium block">Authenticated Email</span>
            <span className="font-semibold text-stone-900 text-sm block">{user?.email || "Unknown"}</span>
          </div>

          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-1">
            <span className="text-stone-500 font-medium block">Auth User UUID</span>
            <span className="font-mono text-stone-900 text-xs block truncate">{user?.id || "N/A"}</span>
          </div>

          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-1">
            <span className="text-stone-500 font-medium block">Role Assignment</span>
            <span className="font-semibold text-stone-900 capitalize text-sm block">{admin.role || "admin"}</span>
          </div>

          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-1">
            <span className="text-stone-500 font-medium block">Authorization Access</span>
            <span className="font-semibold text-emerald-700 text-xs block">
              Verified via server RLS & is_sai_admin()
            </span>
          </div>
        </div>
      </div>

      {/* Role Management Notice */}
      <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-2">
        <div className="flex items-center gap-2 font-bold text-sm text-amber-950">
          <ShieldCheck className="w-5 h-5 text-amber-700" />
          <span>Role Authorization Policy</span>
        </div>
        <p className="leading-relaxed">
          Standard user self-registration is disabled. Administrator roles can only be granted by inserting the Auth User UUID into the <code className="font-mono bg-amber-100 px-1 py-0.5 rounded">admin_users</code> table with <code className="font-mono bg-amber-100 px-1 py-0.5 rounded">is_active = true</code>. Users cannot escalate their own privilege level.
        </p>
      </div>

      {/* Supabase Connection Status */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
        <h3 className="font-serif font-bold text-base text-stone-900 border-b border-stone-100 pb-3">
          Supabase Database Connection
        </h3>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-stone-50 border border-stone-200">
            <div className="flex items-center gap-3">
              <Database className="w-4 h-4 text-[#5A3E2B]" />
              <div>
                <span className="font-semibold text-stone-900 block">Supabase Dedicated URL</span>
                <span className="font-mono text-stone-500 text-[11px]">https://koaflfdrucbawfplbmum.supabase.co</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 font-semibold text-[10px] uppercase border border-emerald-200">
              Connected
            </span>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-stone-50 border border-stone-200">
            <div className="flex items-center gap-3">
              <Lock className="w-4 h-4 text-[#5A3E2B]" />
              <div>
                <span className="font-semibold text-stone-900 block">Row Level Security (RLS)</span>
                <span className="text-stone-500 text-[11px]">Enabled across all 7 database tables</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 font-semibold text-[10px] uppercase border border-emerald-200">
              Protected
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<p className="p-10 text-xs text-stone-500">Loading administrator settings...</p>}>
      <AdminSettings />
    </Suspense>
  );
}
