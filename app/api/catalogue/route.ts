import { createClient } from "@supabase/supabase-js";
import { supabaseConfig } from "@/lib/supabase/config";
export async function GET(request: Request) {
  const { url, key } = supabaseConfig();
  // Always anonymous: admin cookies must never change the public catalogue.
  const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const rawPage = Number(new URL(request.url).searchParams.get("page") ?? 1);
  if (!Number.isSafeInteger(rawPage) || rawPage < 1 || rawPage > 10000) return Response.json({ error: "Invalid page." }, { status: 400 });
  const { data, count, error } = await supabase.from("products")
    .select("id,name,slug,description,selling_price,original_price,material,dimensions,colour,stock_status,is_featured,category_id,product_images(image_url,alt_text,display_order)", { count: "exact" })
    .eq("is_published", true).eq("is_archived", false).order("name").order("id").order("display_order", { referencedTable: "product_images" }).range((rawPage - 1) * 24, rawPage * 24 - 1);
  if (error) return Response.json({ error: "Catalogue temporarily unavailable." }, { status: 503 });
  return Response.json({ products: data, total: count, page: rawPage, pageSize: 24 }, { headers: { "Cache-Control": "no-store" } });
}
