import NextAuth from "next-auth/next";
import { authOptions } from "@/lib/session";
import GithubProvider from "next-auth/providers/github";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
