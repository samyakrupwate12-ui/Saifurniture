import { createClient } from "@supabase/supabase-js";
import { parseEnquiryPayload } from "@/lib/enquiries";
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

  let payload: ReturnType<typeof parseEnquiryPayload>;
  try {
    payload = parseEnquiryPayload(await request.json());
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Invalid enquiry request." }, { status: 400 });
  }

  try {
    const { url, key } = supabaseConfig();
    const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

    // Validate product_id if provided
    if (payload.product_id) {
      const { data: pData } = await supabase.from("products").select("id").eq("id", payload.product_id).eq("is_published", true).eq("is_archived", false).maybeSingle();
      if (!pData) {
        return Response.json({ error: "Selected product is not available for enquiry." }, { status: 400 });
      }
    }

    // Public callers can submit allowed fields but cannot read customer records.
    const { error } = await supabase.from("enquiries").insert(payload);

    if (error) {
      console.error("Public enquiry insert error:", error);
      return Response.json({ error: "Unable to process enquiry. Please try again later." }, { status: 500 });
    }

    return Response.json({ success: true, message: "Enquiry submitted successfully! Our showroom team will contact you shortly." });
  } catch {
    return Response.json({ error: "Unable to submit enquiry right now. Please try again." }, { status: 503 });
  }
}
