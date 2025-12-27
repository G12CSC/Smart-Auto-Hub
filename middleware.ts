import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Clone the request URL
    const url = request.nextUrl.clone();

    // Check pathname starts with /admin
    if (url.pathname.startsWith('/admin')) {
        // Rewrite to /login
        url.pathname = url.pathname.replace('/admin', '/login');
        return NextResponse.rewrite(url);
    }
    // If no rewrite is needed, continue with the request
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/admin/:path*',
        "/admin"
    ],
    
}