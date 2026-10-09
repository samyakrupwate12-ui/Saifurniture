"use client";

import React, { useState } from "react";
import { Mail, CheckCircle2 } from "lucide-react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <section className="py-12 md:py-16 bg-[#F3EEE6]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-[#FAF7F2] p-8 sm:p-12 rounded-3xl border border-[#E6DFD5] shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-[#5A3E2B] text-white flex items-center justify-center mx-auto mb-4">
            <Mail className="w-6 h-6" />
          </div>

          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#2C221E] mb-3">
            Stay Inspired
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto mb-6">
            Get new furniture collections, exclusive seasonal offers, and home styling inspiration delivered directly to your inbox.
          </p>

          {subscribed ? (
            <div className="bg-[#5A3E2B]/10 border border-[#5A3E2B]/30 text-[#5A3E2B] p-4 rounded-xl max-w-md mx-auto flex items-center justify-center gap-2 font-medium text-xs sm:text-sm">
              <CheckCircle2 className="w-5 h-5 text-[#5A3E2B]" />
              <span>Thank you! You have successfully subscribed to Sai Furniture updates.</span>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full sm:flex-1 px-4 py-3 rounded-xl bg-white border border-[#E6DFD5] text-xs sm:text-sm text-[#2C221E] placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#5A3E2B]"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-[#5A3E2B] text-white hover:bg-[#432D1F] text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-xs shrink-0"
              >
                Subscribe
              </button>
            </form>
          )}

          <p className="text-[10px] text-stone-400 mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
}
