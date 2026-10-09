"use client";
export default function ErrorPage({ reset }: { reset: () => void }) { return <main className="p-10"><h1 className="text-2xl font-semibold">We couldn’t load this page</h1><p className="my-4">Please try again. If this continues, check the Supabase connection.</p><button onClick={reset} className="underline">Try again</button></main>; }
