import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user?: {
      email?: string | null;
      role?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role?: string;
    customerId?: string | null;
    adminId?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    email?: string | null;
    role?: string;
    customerId?: string | null;
    adminId?: string | null;
  }
}