import Link from "next/link";
import { logout } from "../actions";
import { ShieldAlert, ArrowLeft, LogOut } from "lucide-react";

export default function DeniedPage() {
  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#2C221E] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md rounded-3xl bg-white border border-[#E6DFD5] p-8 text-center shadow-lg space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-serif font-bold text-[#2C221E]">
          Active Administrator Access Required
        </h1>
        <p className="text-xs text-stone-600 leading-relaxed">
          Your account is authenticated with Supabase Auth, but has not been granted an active role in the <code className="font-mono bg-stone-100 px-1 py-0.5 rounded">admin_users</code> registry. Please contact the project owner to activate your admin privileges.
        </p>

        <div className="pt-2 flex flex-col gap-3">
          <form action={logout}>
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-[#5A3E2B] text-white text-xs font-semibold rounded-xl hover:bg-[#432D1F] transition-colors flex items-center justify-center gap-2"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out Account</span>
            </button>
          </form>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-1 text-xs text-stone-600 hover:text-[#5A3E2B] font-medium py-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Storefront
          </Link>
        </div>
      </div>
    </main>
  );
}
