import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { env } from '@/env.mjs';

// Create a server supabase client that reads/writes cookies via Next's cookie store
export async function createServerSupabaseClient() {
  const cookieStore = cookies();

  return createServerClient(
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
            // If this is called from a Server Component where cookies can't be set,
            // we can ignore the error. Middleware (proxy) will handle cookie syncing.
          }
        },
      },
    },
  );
}
