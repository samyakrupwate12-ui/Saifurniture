"use server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function login(_previous: { error: string }, form: FormData) {
  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");
  if (!email || email.length > 254 || !password || password.length > 1024) return { error: "Enter a valid email and password." };
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) return { error: "Unable to sign in. Check your credentials and try again." };
  const { data: admin, error: permissionError } = await supabase.from("admin_users")
    .select("user_id").eq("user_id", data.user.id).eq("is_active", true).maybeSingle();
  if (permissionError || !admin) {
    await supabase.auth.signOut();
    return { error: "This account does not have active administrator access." };
  }
  redirect("/admin/dashboard");
}
export async function logout() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error("Sign out failed. Please try again.");
  redirect("/admin/login");
}
