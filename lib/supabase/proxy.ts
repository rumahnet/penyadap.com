import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { env } from '@/env.mjs';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL!,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ?? env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
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
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  // If no user and not on login pages, optionally redirect. We will not auto-redirect
  // here to keep behavior consistent with existing app; pages will still call getCurrentUser().

  return supabaseResponse;
}
