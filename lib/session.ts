import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { env } from "@/env.mjs";

export const getCurrentUser = cache(async () => {
  try {
    const cookieStore = cookies();

    const supabase = createServerClient(
      env.NEXT_PUBLIC_SUPABASE_URL!,
      env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ?? env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
            } catch {
              // ignore when called from Server Component context where cookies cannot be set
            }
          },
        },
      },
    );

    // Preferably use getUser to get the current user associated with cookies
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error("getCurrentUser error:", error.message);
      return undefined;
    }
    
    return data.user ?? undefined;
  } catch (error) {
    console.error("getCurrentUser exception:", error);
    return undefined;
  }
});