import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { UserService } from "./models/user";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Authenticate user with MongoDB
          const user = await UserService.authenticateUser(
            credentials.email,
            credentials.password
          );

          if (!user) {
            return null;
          }

          return {
            id: user._id!.toString(),
            email: user.email,
            name: user.name,
            image: user.avatar,
            username: user.username,
            role: user.role,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        if (account.provider === "google") {
          // Check if user exists in our MongoDB
          const existingUser = await UserService.getUserByEmail(user.email as string);
          
          if (existingUser) {
            // Update the user's Google info if needed
            token.id = existingUser._id!.toString();
            token.username = existingUser.username;
            token.role = existingUser.role;
          } else {
            // Create new user from Google account
            const newUser = await UserService.createUser({
              email: user.email as string,
              password: Math.random().toString(36).slice(-10), // Random password
              name: user.name || "Google User",
              username: (user.email as string).split("@")[0], // Use part of email as username
              avatar: user.image || undefined, // Fix: Ensure avatar is string or undefined, not null
              bio: "",
              preferences: {
                theme: "system",
                emailNotifications: true,
                twoFactorEnabled: false,
              },
            });

            if (newUser) {
              token.id = newUser._id!.toString();
              token.username = newUser.username;
              token.role = newUser.role;
            }
          }
        } else {
          // Regular credentials login, add custom claims
          token.id = user.id;
          token.username = user.username;
          token.role = user.role;
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.role = token.role as string;
      }
      
      return session;
    },
  },
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Extend NextAuth types
declare module "next-auth" {
  interface User {
    id: string;
    username: string;
    role: string;
  }
  
  interface Session {
    user: {
      id: string;
      username: string;
      role: string;
      email: string;
      name?: string | null;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    role: string;
  }
} 