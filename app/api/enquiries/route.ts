import { createClient } from "@supabase/supabase-js";
import { supabaseConfig } from "@/lib/supabase/config";

// Simple in-memory rate limiting map for public enquiries per IP
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "anon";
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 5;

  const currentLimit = rateLimitMap.get(ip);
  if (currentLimit && currentLimit.resetAt > now) {
    if (currentLimit.count >= maxRequests) {
      return Response.json(
        { error: "Too many enquiry requests. Please wait a few minutes before trying again." },
        { status: 429 }
      );
    }
    currentLimit.count += 1;
  } else {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
  }

  try {
    const body = await request.json();
    const customer_name = String(body.customer_name ?? "").trim();
    const customer_phone = String(body.customer_phone ?? "").trim();
    const customer_email = body.customer_email ? String(body.customer_email).trim() : null;
    const product_id = body.product_id ? String(body.product_id).trim() : null;
    const quantity = Math.max(1, Number(body.quantity ?? 1));
    const message = body.message ? String(body.message).trim() : null;

    if (!customer_name || customer_name.length < 2 || customer_name.length > 100) {
      return Response.json({ error: "Please enter a valid full name." }, { status: 400 });
    }
    if (!customer_phone || customer_phone.length < 8 || customer_phone.length > 20) {
      return Response.json({ error: "Please enter a valid phone number." }, { status: 400 });
    }
    if (customer_email && (customer_email.length > 254 || !customer_email.includes("@"))) {
      return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    if (message && message.length > 2000) {
      return Response.json({ error: "Enquiry message is too long (max 2000 characters)." }, { status: 400 });
    }

    const { url, key } = supabaseConfig();
    const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

    // Validate product_id if provided
    if (product_id) {
      const { data: pData } = await supabase.from("products").select("id").eq("id", product_id).eq("is_published", true).maybeSingle();
      if (!pData) {
        return Response.json({ error: "Selected product is not available for enquiry." }, { status: 400 });
      }
    }

    const { data, error } = await supabase
      .from("enquiries")
      .insert({
        customer_name,
        customer_phone,
        customer_email,
        product_id,
        quantity,
        message,
        status: "new",
      })
      .select("id")
      .single();

    if (error) {
      console.error("Public enquiry insert error:", error);
      return Response.json({ error: "Unable to process enquiry. Please try again later." }, { status: 500 });
    }

    return Response.json({ success: true, message: "Enquiry submitted successfully! Our showroom team will contact you shortly.", enquiry_id: data.id });
  } catch {
    return Response.json({ error: "Invalid enquiry request payload." }, { status: 400 });
  }
}
