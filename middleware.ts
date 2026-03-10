import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Routes that require authentication
const PROTECTED_ROUTES = ["/dashboard", "/sessions", "/messages", "/programmes", "/profile", "/admin"];
// Routes only accessible when NOT authenticated
const AUTH_ROUTES = ["/login", "/signup"];
// Routes only accessible by admin
const ADMIN_ROUTES = ["/admin"];

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
  const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r));
  const isAdminRoute = ADMIN_ROUTES.some((r) => pathname.startsWith(r));

  // Not logged in and trying to access protected route
  if (!user && isProtected) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Logged in and trying to access auth pages
  if (user && isAuthRoute) {
    const role = user.user_metadata?.role as string | undefined;
    const dest = role === "ADMIN" ? "/admin" : "/";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  // Admin route check
  if (isAdminRoute && user) {
    const role = user.user_metadata?.role as string | undefined;
    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Forward pathname as a header so server layouts can read it
  supabaseResponse.headers.set("x-pathname", pathname);
  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
