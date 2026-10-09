import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";

// Call this in each protected page and mutation, not just a layout.
export async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) redirect("/admin/login");
  const { data: admin, error: permissionError } = await supabase.from("admin_users")
    .select("full_name,role,is_active").eq("user_id", user.id).eq("is_active", true).maybeSingle();
  if (permissionError) throw new Error("Unable to verify administrator access.");
  if (!admin) redirect("/admin/denied");
  return { supabase, admin };
}
