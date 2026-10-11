"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import type { EnquiryStatus, QuotationStatus } from "@/types/supabase";

import { MAX_PRODUCT_IMAGES, parseProductImage } from "@/lib/product-images";
import { supabaseConfig } from "@/lib/supabase/config";

// ----------------------------------------------------
// PRODUCT ACTIONS
// ----------------------------------------------------

export async function saveProductAction(
  _prevState: { error: string; productId?: string }, formData: FormData,
): Promise<{ error: string; productId?: string }> {
  const { supabase } = await requireAdmin();

  const id = formData.get("id") ? String(formData.get("id")) : null;
  const name = String(formData.get("name") ?? "").trim();
  let slug = String(formData.get("slug") ?? "").trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-");
  const description = formData.get("description") ? String(formData.get("description")).trim() : null;
  const category_id = formData.get("category_id") ? String(formData.get("category_id")) : null;
  const selling_price = Number(formData.get("selling_price") ?? 0);
  const original_price_val = formData.get("original_price") ? Number(formData.get("original_price")) : null;
  const original_price = original_price_val && original_price_val > 0 ? original_price_val : null;
  const material = formData.get("material") ? String(formData.get("material")).trim() : null;
  const dimensions = formData.get("dimensions") ? String(formData.get("dimensions")).trim() : null;
  const colour = formData.get("colour") ? String(formData.get("colour")).trim() : null;
  const stock_status = String(formData.get("stock_status") || "available");
  const is_featured = formData.get("is_featured") === "true" || formData.get("is_featured") === "on";
  const is_published = formData.get("is_published") === "true" || formData.get("is_published") === "on";
  const is_archived = formData.get("is_archived") === "true" || formData.get("is_archived") === "on";

  const rawImages = formData.getAll("image_urls[]").map(String).filter((url) => url.trim().length > 0);

  if (!name || name.length < 2) {
    return { productId: id || undefined, error: "Product name must be at least 2 characters long." };
  }

  if (!slug) {
    slug = name.toLowerCase().replace(/[^a-z0-9-]+/g, "-");
  }

  if (!Number.isFinite(selling_price) || selling_price <= 0) {
    return { productId: id || undefined, error: "Selling price must be a positive number." };
  }

  if (original_price && original_price < selling_price) {
    return { productId: id || undefined, error: "Original price cannot be lower than the selling price." };
  }

  if (!["available", "made_to_order", "out_of_stock"].includes(stock_status)) {
    return { productId: id || undefined, error: "Choose a valid stock status." };
  }
  if (rawImages.length > MAX_PRODUCT_IMAGES) {
    return { productId: id || undefined, error: `Use up to ${MAX_PRODUCT_IMAGES} images per product.` };
  }
  let images: ReturnType<typeof parseProductImage>[];
  try {
    images = [...new Set(rawImages)].map((url) => parseProductImage(url, supabaseConfig().url));
  } catch (error) {
    return { productId: id || undefined, error: error instanceof Error ? error.message : "Invalid image link." };
  }

  // Check unique slug
  let slugCheck = supabase.from("products").select("id").eq("slug", slug);
  if (id) slugCheck = slugCheck.neq("id", id);
  const { data: existingSlug, error: slugError } = await slugCheck.maybeSingle();
  if (slugError) return { productId: id || undefined, error: "Unable to check product slug. Please try again." };

  if (existingSlug) {
    return { productId: id || undefined, error: `Product slug "${slug}" is already in use by another product.` };
  }

  const productPayload = {
    name,
    slug,
    description,
    category_id: category_id || null,
    selling_price,
    original_price,
    material,
    dimensions,
    colour,
    stock_status,
    is_featured,
    is_published,
    is_archived,
    updated_at: new Date().toISOString(),
  };

  let productId = id;

  if (id) {
    const { data: updated, error: updateErr } = await supabase.from("products").update(productPayload).eq("id", id).select("id").single();
    if (updateErr || !updated) {
      console.error("Product update error:", updateErr);
      return { productId: id || undefined, error: `Failed to update product: ${updateErr?.message || "Product not found"}` };
    }
  } else {
    const { data: newProd, error: insertErr } = await supabase
      .from("products")
      .insert(productPayload)
      .select("id")
      .single();

    if (insertErr || !newProd) {
      console.error("Product insert error:", insertErr);
      return { productId: id || undefined, error: `Failed to create product: ${insertErr?.message || "Unknown error"}` };
    }
    productId = newProd.id;
  }

  // Replace image metadata in one transaction; a failure preserves the previous gallery.
  const { error: imageError } = await supabase.rpc("replace_sai_product_images", {
    p_product_id: productId,
    p_images: images.map((image, idx) => ({
      ...image,
      alt_text: `${name} photo ${idx + 1}`,
      display_order: idx,
    })),
  });
  if (imageError) {
    console.error("Product image save error:", imageError);
    return {
      error: "Product details were saved, but the photos could not be saved. Please retry Save; your previous gallery has been kept.",
      productId: productId!,
    };
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/products/[slug]", "page");
  revalidatePath("/");

  redirect("/admin/products");
}

export async function togglePublishProductAction(id: string, is_published: boolean) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from("products")
    .update({ is_published, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(`Unable to update publication status: ${error.message}`);

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
}

export async function toggleArchiveProductAction(id: string, is_archived: boolean) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from("products")
    .update({ is_archived, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(`Unable to update archive status: ${error.message}`);

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
}

// ----------------------------------------------------
// CATEGORY ACTIONS
// ----------------------------------------------------

export async function saveCategoryAction(_prevState: any, formData: FormData) {
  const { supabase } = await requireAdmin();

  const id = formData.get("id") ? String(formData.get("id")) : null;
  const name = String(formData.get("name") ?? "").trim();
  let slug = String(formData.get("slug") ?? "").trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-");
  const description = formData.get("description") ? String(formData.get("description")).trim() : null;
  const is_active = formData.get("is_active") === "true" || formData.get("is_active") === "on";

  if (!name || name.length < 2) {
    return { error: "Category name must be at least 2 characters long." };
  }

  if (!slug) {
    slug = name.toLowerCase().replace(/[^a-z0-9-]+/g, "-");
  }

  const payload = {
    name,
    slug,
    description,
    is_active,
  };

  if (id) {
    const { error } = await supabase.from("categories").update(payload).eq("id", id);
    if (error) return { error: `Failed to update category: ${error.message}` };
  } else {
    const { error } = await supabase.from("categories").insert(payload);
    if (error) return { error: `Failed to create category: ${error.message}` };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/products");
  return { success: true };
}

export async function deleteCategoryAction(id: string) {
  const { supabase } = await requireAdmin();

  // Safety check: verify if products use this category
  const { count, error: countErr } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("category_id", id);

  if (countErr) throw new Error(`Unable to verify category relations: ${countErr.message}`);

  if (count && count > 0) {
    return { error: `Cannot delete category: ${count} product(s) are currently linked to this category. Reassign or remove linked products first.` };
  }

  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) return { error: `Failed to delete category: ${error.message}` };

  revalidatePath("/admin/categories");
  revalidatePath("/products");
  return { success: true };
}

// ----------------------------------------------------
// ENQUIRY ACTIONS
// ----------------------------------------------------

export async function updateEnquiryStatusAction(id: string, status: EnquiryStatus, internal_notes?: string | null) {
  const { supabase } = await requireAdmin();
  const payload: any = { status, updated_at: new Date().toISOString() };
  if (internal_notes !== undefined) {
    payload.internal_notes = internal_notes;
  }

  const { error } = await supabase.from("enquiries").update(payload).eq("id", id);
  if (error) throw new Error(`Unable to update enquiry: ${error.message}`);

  revalidatePath("/admin/enquiries");
  revalidatePath("/admin/dashboard");
}

// ----------------------------------------------------
// QUOTATION ACTIONS
// ----------------------------------------------------

export async function saveQuotationAction(_prevState: any, formData: FormData) {
  const { supabase } = await requireAdmin();

  const id = formData.get("id") ? String(formData.get("id")) : null;
  const customer_name = String(formData.get("customer_name") ?? "").trim();
  const customer_email = formData.get("customer_email") ? String(formData.get("customer_email")).trim() : null;
  const customer_phone = formData.get("customer_phone") ? String(formData.get("customer_phone")).trim() : null;
  const customer_address = formData.get("customer_address") ? String(formData.get("customer_address")).trim() : null;
  const enquiry_id = formData.get("enquiry_id") ? String(formData.get("enquiry_id")) : null;
  const valid_until = formData.get("valid_until") ? String(formData.get("valid_until")) : null;
  const terms = formData.get("terms") ? String(formData.get("terms")).trim() : null;
  const status = (formData.get("status") as QuotationStatus) || "draft";

  const discount = Math.max(0, Number(formData.get("discount") ?? 0));
  const delivery_charge = Math.max(0, Number(formData.get("delivery_charge") ?? 0));
  const tax_rate = Math.max(0, Number(formData.get("tax_rate") ?? 0)); // percentage, e.g. 18%

  const itemNames = formData.getAll("item_name[]").map(String);
  const itemDescriptions = formData.getAll("item_description[]").map(String);
  const itemQuantities = formData.getAll("item_quantity[]").map(Number);
  const itemPrices = formData.getAll("item_unit_price[]").map(Number);
  const itemProductIds = formData.getAll("item_product_id[]").map((v) => (v ? String(v) : null));

  if (!customer_name || customer_name.length < 2) {
    return { error: "Customer name is required." };
  }

  if (itemNames.length === 0) {
    return { error: "At least one line item is required for a quotation." };
  }

  // Authoritative server-side calculations
  let subtotal = 0;
  const quotationItems = itemNames.map((name, i) => {
    const qty = Math.max(1, itemQuantities[i] || 1);
    const unitPrice = Math.max(0, itemPrices[i] || 0);
    const itemSubtotal = qty * unitPrice;
    subtotal += itemSubtotal;
    return {
      product_id: itemProductIds[i] || null,
      item_name: name.trim(),
      description: itemDescriptions[i]?.trim() || null,
      quantity: qty,
      unit_price: unitPrice,
      subtotal: itemSubtotal,
    };
  });

  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = Math.round((taxableAmount * tax_rate) / 100);
  const total = taxableAmount + tax + delivery_charge;

  const quotationNumber = id
    ? String(formData.get("quotation_number"))
    : `QT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const quotationPayload = {
    quotation_number: quotationNumber,
    enquiry_id: enquiry_id || null,
    customer_name,
    customer_email,
    customer_phone,
    customer_address,
    subtotal,
    discount,
    tax,
    delivery_charge,
    total,
    valid_until,
    terms,
    status,
    updated_at: new Date().toISOString(),
  };

  let quotationId = id;

  if (id) {
    const { error: qErr } = await supabase.from("quotations").update(quotationPayload).eq("id", id);
    if (qErr) return { error: `Failed to update quotation: ${qErr.message}` };
  } else {
    const { data: newQ, error: qErr } = await supabase
      .from("quotations")
      .insert(quotationPayload)
      .select("id")
      .single();

    if (qErr || !newQ) return { error: `Failed to create quotation: ${qErr?.message}` };
    quotationId = newQ.id;
  }

  // Sync quotation line items (historical snapshots)
  if (quotationId) {
    await supabase.from("quotation_items").delete().eq("quotation_id", quotationId);
    const itemsToInsert = quotationItems.map((item) => ({
      ...item,
      quotation_id: quotationId!,
    }));
    await supabase.from("quotation_items").insert(itemsToInsert);
  }

  // If created from enquiry, update enquiry status to 'quoted'
  if (enquiry_id) {
    await supabase.from("enquiries").update({ status: "quoted" }).eq("id", enquiry_id);
  }

  revalidatePath("/admin/quotations");
  revalidatePath("/admin/dashboard");

  redirect("/admin/quotations");
}
