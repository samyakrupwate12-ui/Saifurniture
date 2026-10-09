const SAI_SUPABASE_URL = "https://koaflfdrucbawfplbmum.supabase.co";

// This is a Supabase publishable key. It is intentionally safe to use in public
// application code. Environment variables still take precedence so the key can
// be rotated without changing source files.
const DEFAULT_SAI_PUBLISHABLE_KEY =
  "sb_publishable_frfC0ITegkQ1K-x7zTctfw_WUpfjc2E";

export function supabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || SAI_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    DEFAULT_SAI_PUBLISHABLE_KEY;

  if (url !== SAI_SUPABASE_URL) {
    throw new Error(
      "Unexpected Supabase project. Use the dedicated Sai Furniture project.",
    );
  }

  if (!key.startsWith("sb_publishable_") && !key.startsWith("eyJ")) {
    throw new Error(
      "Invalid Sai Furniture Supabase publishable key. Set NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
    );
  }

  return { url, key };
}
