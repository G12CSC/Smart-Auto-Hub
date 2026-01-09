import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(req: NextRequest) {

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    const pathname = req.nextUrl.pathname

    // 🚫 Not logged in
    if (!token) {
        if (
            pathname.startsWith("/admin") ||
            pathname.startsWith("/advisor") ||
            pathname.startsWith("/dashboard")
        ) {
            return NextResponse.redirect(new URL("/auth/login", req.url))
            //sends them to login page to login before accessing protected routes
        }
        return NextResponse.next()
        //allow access to findVehicle, dashboard, aboutUs, ContactUs pages (public pages)
    }

    /**
     * USER ROUTES
     */
    if (pathname.startsWith("/dashboard")) {
        if (token.userType !== "user") {
            return NextResponse.redirect(new URL("/admin/dashboard", req.url))
            //restricts admins and advisors from logging in
        }
    }

    /**
     * ADMIN ROUTES (Admin + Advisor)
     */
    if (pathname.startsWith("/admin")) {
        if (token.userType !== "admin") {
            return NextResponse.redirect(new URL("/auth/login", req.url));
            //block users from entering admin protected routes
        }
    }

    /**
     * ADMIN-ONLY ROUTES
     */
    if (
        pathname.startsWith("/admin/vehicles") ||
        pathname.startsWith("/admin/newsletters")
    ) {
        if (!["ADMIN", "SUPER_ADMIN"].includes(token.adminRole as string)) {
            return NextResponse.redirect(new URL("/admin/dashboard", req.url))
        }
    }

    /**
     * ADVISOR ROUTES
     */
    if (pathname.startsWith("/advisor")) {
        if (token.adminRole !== "ADVISOR") {
            return NextResponse.redirect(new URL("/admin/dashboard", req.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/admin/:path*",
        "/advisor/:path*"
    ]
    //these specify the routes middleware should run
}
