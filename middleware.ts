

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from "next-auth/jwt";

export function middleware(request: NextRequest) {

/*
// Clone the request URL
const url = request.nextUrl.clone();

// Check pathname starts with /admin
if (request.nextUrl.pathname.startsWith("/admin")) {
const isAdmin = request.cookies.get("isAdmin");
if (!isAdmin) {
  return NextResponse.redirect(new URL("/login", request.url));
}
}

 */
// If no rewrite is needed, continue with the request
return NextResponse.next();
}

export const config = {
matcher: [
    '/admin/:path*',
    "/admin"
],

}

