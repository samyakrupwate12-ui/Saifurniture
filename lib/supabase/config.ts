export function supabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("Configure Sai Furniture Supabase environment variables.");
  if (url !== "https://koaflfdrucbawfplbmum.supabase.co") throw new Error("Unexpected Supabase project. Use the dedicated Sai Furniture project.");
  return { url, key };
}
