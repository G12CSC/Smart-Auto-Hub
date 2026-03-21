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
    if (pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (
      pathname.startsWith("/admin") ||
      pathname.startsWith("/advisor-dashboard")
    ) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    return NextResponse.next();
  }

  // if (pathname === "/" && token?.adminRole === "advisor") {
  //     return NextResponse.redirect(new URL("/advisor-dashboard", req.url));
  // }

  if (!token) {
    if (
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/admin") ||
      pathname.startsWith("/advisor-dashboard")
    ) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  // USER
  if (pathname.startsWith("/dashboard") && token.userType !== "user") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ADMIN
  if (pathname.startsWith("/admin") && token.adminRole !== "admin") {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  // ADVISOR
  if (
    pathname.startsWith("/advisor-dashboard") &&
    token.adminRole !== "advisor"
  ) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/advisor/:path*",
    "/advisor-dashboard/:path*",
  ],
};
