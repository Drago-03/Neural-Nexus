import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import { authOptions } from "@/lib/auth";

// Force this API route to use Node.js runtime
export const runtime = 'nodejs';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 