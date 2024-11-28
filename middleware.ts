import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // If the user is not authenticated, redirect to root
    if (!token) {
      // Allow access to the root path
      if (path === "/") {
        return NextResponse.next();
      }
      // Redirect to root for all other paths
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Protected routes that require authentication
    const protectedRoutes = [
      "/patients",
      "/appointments",
      "/inventory",
      "/dentures",
      "/treatments",
    ];

    // Redirect authenticated users to their dashboard if trying to access root
    if (path === "/") {
      return NextResponse.redirect(
        new URL(`/dashboard/${token.role}`, req.url)
      );
    }

    // Role-based access control
    const roleAccessMap = {
      dentist: ["/dashboard/dentist", ...protectedRoutes],
      receptionist: ["/dashboard/receptionist", "/inventory", "/appointments"],
      assistant: ["/dashboard/assistant", "/appointments"],
    };

    const allowedPaths =
      roleAccessMap[token.role as keyof typeof roleAccessMap] || [];

    // Check if the current path is allowed for the user's role
    if (!allowedPaths.some((allowedPath) => path.startsWith(allowedPath))) {
      return NextResponse.redirect(
        new URL(`/dashboard/${token.role}`, req.url)
      );
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true, // We'll handle authorization in the middleware function
    },
  }
);

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/appointments",
    "/patients",
    "/inventory",
    "/dentures",
    "/treatments",
  ],
};
