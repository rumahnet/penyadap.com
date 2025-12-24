import authConfig from "@/auth.config";
import { env } from "@/env.mjs";
import NextAuth, { type DefaultSession } from "next-auth";

import { getUserById } from "@/lib/user";

// Note: session/user types are declared in `types/next-auth.d.ts`.
// Avoid duplicating module augmentation here to prevent conflicting declarations.

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  session: { strategy: "jwt" },
  trustHost: true,
  pages: {
    signIn: "/login",
    // error: "/auth/error",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // If the callback URL is a relative path starting with /, redirect to it
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      // Otherwise, redirect to base URL (home)
      return baseUrl;
    },

    async session({ token, session }) {
      if (session.user) {
        if (token.sub) {
          session.user.id = token.sub;
        }

        if (token.email) {
          session.user.email = token.email;
        }
        if (token.emailVerified !== undefined) {
          // `User.emailVerified` is a Date | null in NextAuth types; preserve original shape
          session.user.emailVerified = token.emailVerified as unknown as Date | null;
        }

        if (token.role) {
          session.user.role = token.role;
        }

        session.user.name = token.name;
        session.user.image = token.picture;
      }

      return session;
    },

    async jwt({ token }) {
      if (!token.sub) return token;

      const dbUser = await getUserById(token.sub);

      if (!dbUser) return token;

      token.name = dbUser.name;
      token.email = dbUser.email;
      token.picture = dbUser.image;
      token.role = dbUser.role;
      // keep the original `emailVerified` value (Date | null) on the token
      token.emailVerified = dbUser.emailVerified;

      return token;
    },
  },
  ...authConfig,
  // Ensure NextAuth uses the validated secret from `env.mjs` so runtime
  // behavior is identical in dev and Vercel/production deployments.
  secret: env.AUTH_SECRET,
  // debug: process.env.NODE_ENV !== "production"
});
