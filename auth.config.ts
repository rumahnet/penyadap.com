import Credentials from "next-auth/providers/credentials";
import Resend from "next-auth/providers/resend";
import { z } from "zod";

import { env } from "@/env.mjs";
import { prisma } from "@/lib/db";
import { getUserByEmail } from "@/lib/user";

export default {
  providers: [
    Resend({
      apiKey: env.RESEND_API_KEY,
      from: env.EMAIL_FROM,
    }),
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          // No dev shortcuts — authenticate only against DB users
          const user = await getUserByEmail(email);
          if (!user || !user.password) return null;

          // Lazy import bcrypt to prevent Node-only APIs being loaded in Edge runtime
          const { compare } = await import("bcryptjs");
          const passwordsMatch = await compare(password, user.password);

          if (passwordsMatch) return user;
        }

        return null;
      },
    }),
  ],
} satisfies unknown;
