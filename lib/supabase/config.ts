export function supabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://koaflfdrucbawfplbmum.supabase.co";
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_sai_furniture_key";
  if (url !== "https://koaflfdrucbawfplbmum.supabase.co") {
    throw new Error("Unexpected Supabase project. Use the dedicated Sai Furniture project.");
  }
  return { url, key };
}
