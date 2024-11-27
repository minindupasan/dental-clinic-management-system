import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      email: string;
      name: string;
      role: string;
      accessToken: string;
    };
  }

  interface User {
    id: number;
    email: string;
    name: string;
    role: string;
    accessToken?: string;
  }
}
