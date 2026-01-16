import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // 1. PUBLIC ROUTES - Always allow these
  if (pathname === "/login" || pathname === "/admin-login") {
    return NextResponse.next();
  }

  // 2. ADMIN PROTECTION
  // Note: Using startsWith("/admin") but we already exempted "/admin-login" above
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/admin-login", req.url));
    }
    if (token.role !== "ADMIN") {
      // If a Pharmacist tries to enter /admin, kick them to /login or dashboard
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  // 3. OTHER PROTECTED ROUTES (Pharmacist/General)
  const protectedPaths = ["/dashboard", "/medicines", "/sales"];
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  // Match all paths except static files, api routes, and favicon
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};