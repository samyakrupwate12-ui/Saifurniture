import Link from "next/link";
import Image from "next/image";
import LoginForm from "./form";
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#2C221E] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md rounded-3xl bg-white border border-[#E6DFD5] p-8 sm:p-10 shadow-lg space-y-6">
        <div className="text-center space-y-2">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-[#E6DFD5] bg-[#FAF7F2] mx-auto shadow-xs">
            <Image
              src="/images/logo.jpg"
              alt="Sai Furniture Logo"
              fill
              sizes="64px"
              className="object-contain p-1"
              priority
            />
          </div>
          <p className="text-[10px] uppercase tracking-widest font-semibold text-stone-500 pt-1">
            Sai Furniture · Showroom Portal
          </p>
          <h1 className="text-2xl font-serif font-bold text-[#2C221E]">
            Admin Sign In
          </h1>
          <p className="text-xs text-stone-600">
            Sign in with authorized administrator credentials to manage your catalogue, enquiries, and quotations.
          </p>
        </div>

        <LoginForm />

        <div className="pt-4 border-t border-[#E6DFD5] text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs text-stone-600 hover:text-[#5A3E2B] font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Public Showroom
          </Link>
        </div>
      </div>
    </main>
  );
}
