import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;

    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    const path = req.nextUrl.pathname;
    const role = token.role as string;

    if (path.startsWith("/dashboard/dentist") && role !== "DENTIST") {
      return NextResponse.redirect(
        new URL("/auth/login?message=You Are Not Authorized!", req.url)
      );
    }

    if (path.startsWith("/dashboard/receptionist") && role !== "RECEPTIONIST") {
      return NextResponse.redirect(
        new URL("/auth/login?message=You Are Not Authorized!", req.url)
      );
    }

    if (path.startsWith("/dashboard/assistant") && role !== "ASSISTANT") {
      return NextResponse.redirect(
        new URL("/auth/login?message=You Are Not Authorized!", req.url)
      );
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/dentist/:path*",
    "/dashboard/receptionist/:path*",
    "/dashboard/assistant/:path*",
  ],
};
