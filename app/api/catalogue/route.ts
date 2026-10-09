import { createClient } from "@supabase/supabase-js";
import { supabaseConfig } from "@/lib/supabase/config";

export async function GET(request: Request) {
  const { url, key } = supabaseConfig();
  // Always anonymous: admin cookies must never change the public catalogue.
  const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  
  const searchParams = new URL(request.url).searchParams;
  const rawPage = Number(searchParams.get("page") ?? 1);
  const rawPageSize = Number(searchParams.get("pageSize") ?? 24);
  const categorySlug = searchParams.get("category")?.trim();
  const search = searchParams.get("search")?.trim();
  const stockStatus = searchParams.get("stock_status")?.trim();
  const sort = searchParams.get("sort")?.trim();

  if (!Number.isSafeInteger(rawPage) || rawPage < 1 || rawPage > 10000) {
    return Response.json({ error: "Invalid page." }, { status: 400 });
  }

  const pageSize = Math.min(Math.max(1, rawPageSize), 48);

  let query = supabase.from("products")
    .select("id,name,slug,description,selling_price,original_price,material,dimensions,colour,stock_status,is_featured,category_id,category:categories(id,name,slug),product_images(id,image_url,alt_text,display_order)", { count: "exact" })
    .eq("is_published", true)
    .eq("is_archived", false);

  if (categorySlug) {
    const { data: categoryData } = await supabase.from("categories").select("id").eq("slug", categorySlug).maybeSingle();
    if (categoryData?.id) {
      query = query.eq("category_id", categoryData.id);
    }
  }

  if (stockStatus) {
    query = query.eq("stock_status", stockStatus);
  }

  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  if (sort === "price-asc") {
    query = query.order("selling_price", { ascending: true });
  } else if (sort === "price-desc") {
    query = query.order("selling_price", { ascending: false });
  } else if (sort === "newest") {
    query = query.order("created_at", { ascending: false });
  } else {
    query = query.order("name", { ascending: true });
  }

  query = query.range((rawPage - 1) * pageSize, rawPage * pageSize - 1);

  const { data, count, error } = await query;
  if (error) {
    return Response.json({ error: "Catalogue temporarily unavailable." }, { status: 503 });
  }

  return Response.json({ products: data || [], total: count || 0, page: rawPage, pageSize }, { headers: { "Cache-Control": "no-store" } });
}
