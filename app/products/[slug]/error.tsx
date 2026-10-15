"use client";

export default function ProductError({ reset }: { reset: () => void }) {
  return (
    <main className="mx-auto max-w-xl px-4 py-16 text-center">
      <h1 className="text-2xl font-semibold">Unable to load this product</h1>
      <p className="mt-3 text-stone-600">Please try again in a moment.</p>
      <button type="button" onClick={reset} className="mt-6 rounded-xl bg-[#5A3E2B] px-6 py-3 text-white">Try again</button>
    </main>
  );
}
