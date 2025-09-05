import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /storage, /activity)
  const { pathname } = request.nextUrl

  // Define protected routes that require authentication
  const protectedRoutes = ["/storage", "/activity"]

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  if (isProtectedRoute) {
    // In a real app, you would check for a valid session token
    // For this demo, we'll check if there's a user in localStorage (client-side)
    // Since middleware runs on the server, we'll redirect to login and let client-side handle it

    // Check if user is coming from login/register pages
    const referer = request.headers.get("referer")
    const isFromAuth = referer && (referer.includes("/login") || referer.includes("/register"))

    // If not coming from auth pages and no session, redirect to login
    if (!isFromAuth) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Allow public routes and authenticated protected routes
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
