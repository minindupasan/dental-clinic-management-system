import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });

  // If the user is not logged in and trying to access a protected route, redirect to login
  if (!token && request.nextUrl.pathname.startsWith("/dashboard")) {
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

    if (request.nextUrl.pathname !== allowedPath) {
      return NextResponse.redirect(new URL(allowedPath, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/login"],
};
