import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });

  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Check user role and redirect accordingly
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
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
  matcher: ["/dashboard/:path*"],
};
