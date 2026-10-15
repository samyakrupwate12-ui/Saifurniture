export default function ProductLoading() {
  return (
    <main className="min-h-screen bg-[#FAF7F2] px-4 py-10 sm:px-6 lg:px-8" role="status" aria-label="Loading product details" aria-busy="true">
      <span className="sr-only">Loading product details…</span>
      <div aria-hidden="true" className="mx-auto max-w-7xl space-y-8 motion-safe:animate-pulse">
        <div className="h-5 w-40 rounded bg-stone-200" />
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-7">
            <div className="aspect-4/3 rounded-2xl bg-stone-200" />
            <div className="h-40 rounded-2xl bg-white" />
          </div>
          <div className="space-y-6 lg:col-span-5">
            <div className="space-y-5 rounded-2xl bg-white p-6">
              <div className="h-6 w-24 rounded bg-stone-200" />
              <div className="h-10 w-3/4 rounded bg-stone-200" />
              <div className="h-10 w-1/2 rounded bg-stone-200" />
            </div>
            <div className="h-80 rounded-2xl bg-white" />
          </div>
        </div>
      </div>
    </main>
  );
}
