import { createClient as createPublicClient } from "@supabase/supabase-js";
import { supabaseConfig } from "@/lib/supabase/config";
import type { DBProduct, DBCategory } from "@/types/supabase";

// Anonymous public client for public storefront queries
export function getAnonymousClient() {
  const { url, key } = supabaseConfig();
  return createPublicClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export interface CatalogueQueryParams {
  page?: number;
  pageSize?: number;
  categorySlug?: string;
  stockStatus?: string;
  search?: string;
  sort?: "name" | "price-low-high" | "price-high-low" | "newest";
}

// Public Storefront Catalogue query
export async function fetchPublicCatalogue(params: CatalogueQueryParams = {}) {
  const page = Math.max(1, params.page || 1);
  const pageSize = params.pageSize || 12;
  const supabase = getAnonymousClient();

  let query = supabase
    .from("products")
    .select("*, category:categories(id, name, slug), product_images(id, image_url, alt_text, display_order)", { count: "exact" })
    .eq("is_published", true)
    .eq("is_archived", false);

  if (params.categorySlug) {
    const { data: categoryData } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", params.categorySlug)
      .maybeSingle();

    if (categoryData?.id) {
      query = query.eq("category_id", categoryData.id);
    }
  }

  if (params.stockStatus) {
    query = query.eq("stock_status", params.stockStatus);
  }

  if (params.search) {
    query = query.ilike("name", `%${params.search}%`);
  }

  if (params.sort === "price-low-high") {
    query = query.order("selling_price", { ascending: true });
  } else if (params.sort === "price-high-low") {
    query = query.order("selling_price", { ascending: false });
  } else if (params.sort === "newest") {
    query = query.order("created_at", { ascending: false });
  } else {
    query = query.order("name", { ascending: true });
  }

  const fromIndex = (page - 1) * pageSize;
  const toIndex = page * pageSize - 1;
  query = query.range(fromIndex, toIndex);

  const { data, count, error } = await query;
  if (error) {
    console.error("Public catalogue error:", error);
    return { products: [] as DBProduct[], total: 0, page, pageSize, error: error.message };
  }

  return { products: (data as DBProduct[]) || [], total: count || 0, page, pageSize, error: null };
}

// Public Product by Slug query
export async function fetchPublicProductBySlug(slug: string) {
  const supabase = getAnonymousClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(id, name, slug), product_images(id, image_url, alt_text, display_order)")
    .eq("slug", slug)
    .eq("is_published", true)
    .eq("is_archived", false)
    .maybeSingle();

  if (error || !data) return null;
  return data as DBProduct;
}

// Public Categories list
export async function fetchPublicCategories() {
  const supabase = getAnonymousClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, description, is_active")
    .eq("is_active", true)
    .order("name");

  if (error) return [] as DBCategory[];
  return (data as DBCategory[]) || [];
}
