import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function proxy(req) {
  const { pathname } = req.nextUrl;
  const isProduction = process.env.NODE_ENV === "production";

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: isProduction,
    cookieName: isProduction
      ? "__Secure-next-auth.session-token"
      : "next-auth.session-token",
  });

  // PUBLIC ROUTES
  if (pathname === "/login" || pathname === "/admin-login") {
    return NextResponse.next();
  }

  // ADMIN ROUTES
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/admin-login", req.url));
    }
    if (token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  // OTHER PROTECTED ROUTES
  const protectedPaths = ["/dashboard", "/medicines", "/sales"];
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));
  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// Config for which routes to apply the proxy to
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
