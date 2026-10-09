"use client";

import React, { useActionState, useState } from "react";
import { login } from "../actions";
import { Eye, EyeOff, Lock, Mail, Loader2, AlertCircle } from "lucide-react";

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, { error: "" });
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={action} className="space-y-5">
      {state?.error && (
        <div
          role="alert"
          className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2.5"
        >
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <span>{state.error}</span>
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-xs font-semibold text-stone-700 mb-1.5">
          Administrator Email
        </label>
        <div className="relative">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            maxLength={254}
            required
            placeholder="admin@saifurniture.com"
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-[#FAF7F2] border border-[#E6DFD5] text-[#2C221E] focus:outline-none focus:ring-2 focus:ring-[#5A3E2B]/40 focus:border-[#5A3E2B]"
          />
          <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-xs font-semibold text-stone-700 mb-1.5">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            maxLength={1024}
            required
            placeholder="••••••••••••"
            className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl bg-[#FAF7F2] border border-[#E6DFD5] text-[#2C221E] focus:outline-none focus:ring-2 focus:ring-[#5A3E2B]/40 focus:border-[#5A3E2B]"
          />
          <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-stone-400 hover:text-stone-700 text-xs font-medium"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full py-3 px-4 rounded-xl bg-[#5A3E2B] text-white font-semibold text-xs hover:bg-[#432D1F] transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {pending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Signing in to portal...</span>
          </>
        ) : (
          <span>Sign In to Admin Dashboard</span>
        )}
      </button>
    </form>
  );
}
