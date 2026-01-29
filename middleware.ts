import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {

    const pathname = req.nextUrl.pathname;

    // 🚫 Skip middleware for public & system routes
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

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // 🧠 LOG ONLY FOR REAL PAGE NAVIGATION
    if (req.headers.get("sec-fetch-dest") === "document") {
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("[MIDDLEWARE] Route:", pathname);

        if (!token) {
            console.log("[AUTH] Not logged in");
        } else {
            console.log("[AUTH] userType:", token.userType);

            if (token.userType === "admin") {
                console.log("[AUTH] adminRole:", token.adminRole); // admin | advisor
            }
        }
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    }

    // 🚫 Not logged in → protect routes
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

    // 👤 USER dashboard
    if (pathname.startsWith("/dashboard") && token.userType !== "user") {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // 🛠 ADMIN routes
    if (pathname.startsWith("/admin") && token.userType !== "admin") {
        return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    // 🔒 ADMIN-only sections
    if (
        pathname.startsWith("/admin/vehicles") ||
        pathname.startsWith("/admin/newsletters")
    ) {
        if (token.adminRole !== "admin") {
            return NextResponse.redirect(new URL("/admin/login", req.url));
        }
    }

    // 👨‍💼 ADVISOR routes
    if (pathname.startsWith("/advisor") && token.adminRole !== "advisor") {
        return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/admin/:path*",
        "/advisor/:path*",
    ],
};
