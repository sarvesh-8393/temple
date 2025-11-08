import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      displayName: string;
      plan?: string;
      role?: string;
      bio?: string;
    };
  }

  interface User {
    id: string;
    displayName: string;
    email: string;
    plan?: string;
    role?: string;
    bio?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    plan?: string;
    role?: string;
    bio?: string;
  }
}
