import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { AuthOptions, User } from "next-auth";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

// Extend NextAuth types for custom user role
declare module "next-auth" {
  interface Session {
    user: User & {
      role: "dentist" | "receptionist" | "assistant" | null;
    };
  }
  interface User {
    role?: "dentist" | "receptionist" | "assistant" | null;
  }
}

// Define authentication options
export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          name: `${profile.given_name} ${profile.family_name}`,
          email: profile.email,
          image: profile.picture,
          role: profile.role ? profile.role : "assistant", // Default role is "assistant"
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as
          | "dentist"
          | "receptionist"
          | "assistant"
          | null;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};

// API route handlers for NextAuth
const handler = NextAuth(authOptions);

export async function GET(req: NextRequest) {
  return handler(req, NextResponse);
}

export async function POST(req: NextRequest) {
  return handler(req, NextResponse);
}
