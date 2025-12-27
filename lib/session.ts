import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
// Use process.env to avoid throwing at module import time if env validation fails


export const getCurrentUser = cache(async () => {
  try {
    const cookieStore = await cookies();

    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (!SUPABASE_URL || !SUPABASE_KEY) {
      // Don't throw — return unauthenticated so pages can still render.
      console.error("getCurrentUser skipped: missing Supabase public env vars");
      return undefined;
    }

    const supabase = createServerClient(
      SUPABASE_URL,
      SUPABASE_KEY,
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

    // If there are no cookies, skip calling Supabase which will return an
    // "Auth session missing!" error in the common unauthenticated case.
    const allCookies = cookieStore.getAll();
    const hasSupabaseCookie = allCookies.some((c) =>
      // common Supabase cookie names / prefixes
      c.name.includes("sb-") ||
      c.name.includes("supabase") ||
      c.name.includes("auth") ||
      c.name.includes("session")
    );

    if (!hasSupabaseCookie) {
      return undefined;
    }

    // Preferably use getUser to get the current user associated with cookies
    const { data, error } = await supabase.auth.getUser();

    // Avoid noisy logs for the expected unauthenticated response from the
    // Supabase client ("Auth session missing!"). Only log unexpected errors.
    if (error) {
      if (typeof error.message === "string" && error.message.includes("Auth session missing")) {
        return undefined;
      }
      console.error("getCurrentUser error:", error.message);
      return undefined;
    }

    return data.user ?? undefined;
  } catch (error) {
    console.error("getCurrentUser exception:", error);
    return undefined;
  }
});