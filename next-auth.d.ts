import NextAuth from "next-auth";
import { Session } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string | null | undefined;
      name?: string | null | undefined;
      email?: string | null | undefined;
      image?: string | null | undefined;
    };
  }
}
