import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { supabaseConfig } from "@/lib/supabase/config";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  let response = NextResponse.next({ request });

  function makeRedirect(destination: string) {
    const redirectUrl = new URL(destination, request.url);
    const redirectRes = NextResponse.redirect(redirectUrl);
    response.cookies.getAll().forEach((cookie) => {
      redirectRes.cookies.set(cookie);
    });
    redirectRes.headers.set("Cache-Control", "private, no-store");
    return redirectRes;
  }

  try {
    const { url, key } = supabaseConfig();
    const supabase = createServerClient(url, key, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(values, headers) {
          values.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          values.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
          Object.entries(headers ?? {}).forEach(([name, value]) => response.headers.set(name, value));
        },
      },
    });

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    const isAuthenticated = !userError && !!user;

    let isAdmin = false;
    if (isAuthenticated) {
      const { data: adminRecord } = await supabase
        .from("admin_users")
        .select("role, is_active")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .maybeSingle();

      isAdmin = !!adminRecord && adminRecord.is_active === true;
    }

    // Handle Admin API routes
    if (pathname.startsWith("/api/admin")) {
      if (!isAuthenticated) {
        return NextResponse.json(
          { error: "Unauthorized: Administrator authentication required." },
          { status: 401, headers: { "Cache-Control": "private, no-store" } }
        );
      }
      if (!isAdmin) {
        return NextResponse.json(
          { error: "Forbidden: Verified administrator privileges required." },
          { status: 403, headers: { "Cache-Control": "private, no-store" } }
        );
      }
      response.headers.set("Cache-Control", "private, no-store");
      return response;
    }

    // Direct URL for admin login
    if (pathname === "/admin/login") {
      if (isAuthenticated && isAdmin) {
        return makeRedirect("/admin/dashboard");
      }
      response.headers.set("Cache-Control", "private, no-store");
      return response;
    }

    // Access Denied page
    if (pathname === "/admin/denied") {
      if (!isAuthenticated) {
        return makeRedirect("/admin/login");
      }
      if (isAdmin) {
        return makeRedirect("/admin/dashboard");
      }
      response.headers.set("Cache-Control", "private, no-store");
      return response;
    }

    // All other /admin/:path* routes (dashboard, products, categories, enquiries, quotations, settings, etc.)
    if (!isAuthenticated) {
      return makeRedirect("/admin/login");
    }

    if (!isAdmin) {
      return makeRedirect("/admin/denied");
    }
  } catch (error) {
    console.error(
      "[supabase proxy] session verification error",
      error instanceof Error ? error.message : "unknown error",
    );
    if (pathname !== "/admin/login") {
      return makeRedirect("/admin/login");
    }
  }

  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

