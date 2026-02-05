import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export default async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  if (
    pathname === "/login" ||
    pathname === "/admin/login" ||
    pathname === "/admin/register" ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    if (
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/admin") ||
      pathname.startsWith("/advisor")
    ) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/dashboard") && token.userType !== "user") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (pathname.startsWith("/admin") && token.userType !== "admin") {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  if (
    pathname.startsWith("/admin/vehicles") ||
    pathname.startsWith("/admin/newsletters")
  ) {
    if (token.adminRole !== "admin") {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  if (pathname.startsWith("/advisor") && token.adminRole !== "advisor") {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/advisor/:path*"],
};
