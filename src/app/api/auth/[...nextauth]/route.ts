import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";
declare module "next-auth" {
  interface Session {
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      id?: number;
      admin?: boolean;
    };
  }
    interface User {
    id: number;
    admin: boolean; 
  }
}

const handler = NextAuth(authOptions);

export const GET = handler;
export const POST = handler;
