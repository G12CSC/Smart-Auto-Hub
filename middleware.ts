import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
    // Check pathname starts with /admin
    // if (request.nextUrl.pathname.startsWith("/admin")) {
    //     const token = await getToken({ req: request });
        
    //     // Check if token exists and user is admin
    //     if (!token || !token.isAdmin) {
    //         const url = new URL("/login", request.url);
    //         url.searchParams.set("callbackUrl", encodeURI(request.url));
    //         return NextResponse.redirect(url);
    //     }
    // }
    // If no rewrite is needed, continue with the request
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/admin/:path*',
        "/admin"
    ],
}
