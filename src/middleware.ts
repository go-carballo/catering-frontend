import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Next.js Edge Middleware — server-side route protection.
 *
 * Since auth tokens live in localStorage (not accessible from the edge),
 * we use a lightweight cookie `auth-session` as a proxy signal:
 *   - Set by the auth-provider on login
 *   - Cleared on logout
 *
 * This middleware does NOT validate the token — it simply prevents
 * unauthenticated users from ever loading the JS bundle for protected
 * routes, eliminating the flash-of-redirect problem.
 *
 * The client-side AuthProvider remains the actual source of truth.
 */

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/forgot-password",
  "/reset-password",
];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

function isStaticAsset(pathname: string): boolean {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") // files like favicon.ico, images, etc.
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static assets and API routes
  if (isStaticAsset(pathname)) {
    return NextResponse.next();
  }

  const hasSession = request.cookies.has("auth-session");

  // Unauthenticated user trying to access protected route → redirect to login
  if (!isPublicPath(pathname) && !hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Authenticated user trying to access login → redirect to dashboard
  if (pathname === "/login" && hasSession) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Run middleware on all routes except static files
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
