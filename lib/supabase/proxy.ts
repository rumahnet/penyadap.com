import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Use process.env so missing server envs do not throw at module import time

/**
 * Supabase session update handler for middleware (Edge Runtime).
 * 
 * This function runs in Vercel Edge Runtime (Next.js middleware).
 * It uses @supabase/ssr's createServerClient which is optimized for edge environments.
 * 
 * Note: The indirect dependency on @supabase/supabase-js causes build warnings about 
 * Node.js APIs (process.version), but this is safe because:
 * - Supabase's realtime-js checks for process.versions at module load, not runtime
 * - The edge runtime only calls getClaims() which doesn't use realtime
 * - No actual Node.js code is executed in the edge context
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  const supabase = createServerClient(
    SUPABASE_URL!,
    SUPABASE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Write cookies into the response so the browser gets updated cookies
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options),
            );
          } catch (err) {
            // ignore
          }
        },
      },
    },
  );

  // We must call getClaims (or getUser) to validate the JWT & refresh if needed.
  // This will also cause the library to call `setAll` when it has cookies to set.
  // Wrap in a try/catch so token refresh errors do not throw from middleware.
  try {
    const { data } = await supabase.auth.getClaims();
    const user = data?.claims;
  } catch (err: any) {
    // Refresh token errors occasionally occur when cookies are partially present
    // or invalid. Don't propagate the error — treat as unauthenticated.
    // eslint-disable-next-line no-console
    console.debug("updateSession: supabase.getClaims error:", err?.message ?? err);
  }

  // If no user and not on login pages, optionally redirect. We will not auto-redirect
  // here to keep behavior consistent with existing app; pages will still call getCurrentUser().

  return supabaseResponse;
}
