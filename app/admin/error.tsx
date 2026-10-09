"use client";

import React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="p-10 flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="max-w-md bg-white p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-700 flex items-center justify-center mx-auto border border-red-200">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-serif font-bold text-stone-900">
          Unable to Load Admin Screen
        </h1>
        <p className="text-xs text-stone-600 leading-relaxed">
          An unexpected error occurred while fetching database records. Check your internet or Supabase connection and try again.
        </p>
        <button
          onClick={reset}
          className="px-5 py-2.5 bg-[#5A3E2B] text-white text-xs font-semibold rounded-xl hover:bg-[#432D1F] transition-colors inline-flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" /> Try Again
        </button>
      </div>
    </main>
  );
}
