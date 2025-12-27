import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Use process.env to avoid throwing at module import time if env validation fails.
// Doing this makes the module safe to import even when deploy env vars are not present.
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    // Fail early with a clear message so callers can handle it. This avoids an
    // import-time crash due to `env.mjs` validation and makes the error visible.
    console.error("createServerSupabaseClient: missing Supabase public env vars");
    throw new Error("Server misconfigured: missing Supabase public env vars");
  }

  return createServerClient(
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
            // If this is called from a Server Component where cookies can't be set,
            // we can ignore the error. Middleware (proxy) will handle cookie syncing.
          }
        },
      },
    },
  );
}
