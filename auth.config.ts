import Credentials from "next-auth/providers/credentials";
import Resend from "next-auth/providers/resend";
import { z } from "zod";

import { env } from "@/env.mjs";

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

        if (!parsedCredentials.success) return null;

        const { email, password } = parsedCredentials.data;

        // delegate authentication to Supabase (lazy import to avoid bundling in middleware)
        const { createClient } = await import("@supabase/supabase-js");
        const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY ?? "");
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.toLowerCase(),
          password,
        } as any);

        if (error || !data?.user) return null;

        const user = data.user;
        return {
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name ?? null,
          emailVerified: (user.email_confirmed_at ?? user.confirmed_at) ?? null,
        } as any;
      },
    }),
  ],
} satisfies unknown;
