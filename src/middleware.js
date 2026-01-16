import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // ← This is the key fix for Vercel / HTTPS environments
  const isProduction = process.env.NODE_ENV === "production";

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    // This tells getToken to look for the correct cookie name
    secureCookie: isProduction,  
    // Optional but recommended: explicitly set cookie name (prevents 99% of issues)
    cookieName: isProduction 
      ? "__Secure-next-auth.session-token" 
      : "next-auth.session-token",
  });

  console.log("Middleware → pathname:", pathname);
  console.log("Token in middleware:", token ? "exists" : "MISSING/NULL");

  // 1. PUBLIC ROUTES
  if (pathname === "/login" || pathname === "/admin-login") {
    return NextResponse.next();
  }

  // 2. ADMIN PROTECTION
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/admin-login", req.url));
    }
    if (token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  // 3. OTHER PROTECTED ROUTES
  const protectedPaths = ["/dashboard", "/medicines", "/sales"];
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};