import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// List of public routes that don't require authentication
const publicRoutes = ['/login', '/signup'];

export function middleware(request: NextRequest) {
    // Get the pathname of the request (e.g. /, /protected-route)
    const path = request.nextUrl.pathname;

    // Get the token from the cookies
    const token = request.cookies.get('token')?.value;
    const isLoggedIn = !!token;

    // If the path is public, allow access
    if (publicRoutes.includes(path)) {
        if (isLoggedIn) {
            // If user is logged in and tries to access login/signup, redirect to home
            return NextResponse.redirect(new URL('/', request.url));
        }
        return NextResponse.next();
    }

    // If no token and trying to access protected route, redirect to login
    if (!isLoggedIn) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('from', path);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
    matcher: [
        // Match all routes except api, static files, and images
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}