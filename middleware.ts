import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Define the protected routes
const protectedRoutes = [
  "/dashboard",
  "/appointments",
  "/patients",
  "/inventory",
  "/dentures",
  "/treatments",
];

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });

  // Check if the current path is in the protected routes
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // If it's a protected route and there's no token, redirect to login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // If the user is logged in and trying to access the login page, redirect to their dashboard
  if (token && request.nextUrl.pathname === "/auth/login") {
    const userRole =
      (token.role as string | undefined)?.toLowerCase() || "default";
    return NextResponse.redirect(
      new URL(`/dashboard/${userRole}`, request.url)
    );
  }

  // If the user is logged in and accessing a dashboard route, ensure they're on the correct one
  if (token && request.nextUrl.pathname.startsWith("/dashboard")) {
    const userRole =
      (token.role as string | undefined)?.toLowerCase() || "default";
    const allowedPath = `/dashboard/${userRole}`;

    if (
      request.nextUrl.pathname !== allowedPath &&
      !request.nextUrl.pathname.startsWith("/dashboard/token-test")
    ) {
      return NextResponse.redirect(new URL(allowedPath, request.url));
    }
  }

  // Handle logout
  if (request.nextUrl.pathname === "/api/auth/signout") {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/auth/login",
    "/api/auth/signout",
    "/appointments/:path*",
    "/patients/:path*",
    "/inventory/:path*",
    "/dentures/:path*",
    "/treatments/:path*",
  ],
};
