import { type NextRequest, NextResponse } from "next/server"

const protectedRoutes = ["/dashboard", "/submit"]

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Check if route requires authentication
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  if (isProtectedRoute) {
    const authToken = request.cookies.get("auth_token")

    if (!authToken) {
      // Redirect to login if not authenticated
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon).*)"],
}
