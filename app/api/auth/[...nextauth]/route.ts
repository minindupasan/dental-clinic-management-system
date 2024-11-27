import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";

interface LoginResponse {
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
  accessToken: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const res = await fetch("http://localhost:8080/api/auth/login", {
            method: "POST",
            body: JSON.stringify(credentials),
            headers: { "Content-Type": "application/json" },
          });

          if (!res.ok) {
            throw new Error("Authentication failed");
          }

          const loginResponse: LoginResponse = await res.json();

          if (loginResponse.user) {
            return {
              id: loginResponse.user.id,
              name: loginResponse.user.name,
              email: loginResponse.user.email,
              role: loginResponse.user.role,
              accessToken: loginResponse.accessToken,
            };
          }
        } catch (error) {
          console.error("Authentication error:", error);
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user: any }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: JWT }) {
      session.user = {
        id: token.id as number,
        email: token.email as string,
        name: token.name as string,
        role: token.role as string,
        accessToken: token.accessToken as string,
      };
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
