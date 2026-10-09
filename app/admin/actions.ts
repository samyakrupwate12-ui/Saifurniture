"use server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function login(_previous: { error: string }, form: FormData) {
  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");
  if (!email || email.length > 254 || !password || password.length > 1024) return { error: "Enter a valid email and password." };

  let supabase: Awaited<ReturnType<typeof createClient>>;
  try {
    supabase = await createClient();
  } catch (error) {
    console.error(
      "[admin login] configuration error",
      error instanceof Error ? error.message : "unknown error",
    );
    return {
      error: "Admin login is not connected to Supabase. Restart the app and check its Supabase settings.",
    };
  }

  let data: Awaited<ReturnType<typeof supabase.auth.signInWithPassword>>["data"];
  let signInError: Awaited<ReturnType<typeof supabase.auth.signInWithPassword>>["error"];
  try {
    ({ data, error: signInError } = await supabase.auth.signInWithPassword({ email, password }));
  } catch (error) {
    console.error(
      "[admin login] Supabase network error",
      error instanceof Error ? error.message : "unknown error",
    );
    return { error: "The login service is temporarily unavailable. Please try again." };
  }

  if (signInError || !data.user) {
    // Keep provider details out of the UI, while leaving a safe diagnostic in
    // the server log so configuration failures are not misreported as bad
    // passwords.
    console.error("[admin login] Supabase sign-in failed", {
      code: signInError?.code ?? "unknown",
      status: signInError?.status ?? "unknown",
    });
    if (signInError?.status === 400 || signInError?.code === "invalid_credentials") {
      return { error: "Invalid email or password." };
    }
    return { error: "The login service is temporarily unavailable. Please try again." };
  }

  let admin: { user_id: string } | null = null;
  let permissionError: { code?: string } | null = null;
  try {
    const result = await supabase
      .from("admin_users")
      .select("user_id")
      .eq("user_id", data.user.id)
      .eq("is_active", true)
      .maybeSingle();
    admin = result.data;
    permissionError = result.error;
  } catch (error) {
    console.error(
      "[admin login] active-admin check network error",
      error instanceof Error ? error.message : "unknown error",
    );
    await supabase.auth.signOut();
    return { error: "Unable to verify administrator access. Please try again." };
  }

  if (permissionError || !admin) {
    console.error("[admin login] active-admin check failed", {
      code: permissionError?.code ?? "not_an_admin",
    });
    await supabase.auth.signOut();
    return { error: "This account does not have active administrator access." };
  }

  // redirect() throws a framework control-flow error. Keep it outside the
  // try/catch blocks above so a successful login is not turned into an error.
  redirect("/admin/dashboard");
}
export async function logout() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error("Sign out failed. Please try again.");
  redirect("/admin/login");
}
