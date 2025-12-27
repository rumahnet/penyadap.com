import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { env } from "@/env.mjs";

// Explicitly set Node.js runtime for this API route (required for server-side Supabase)
export const runtime = "nodejs";

import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();

  // Validate required Supabase env vars and return a helpful 500 if missing
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !(env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ?? env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)) {
    console.error("Auth route misconfigured: missing NEXT_PUBLIC_SUPABASE_URL or publishable key");
    return NextResponse.json({ error: "Server misconfigured: missing Supabase environment variables" }, { status: 500 });
  }

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ?? env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
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

  // Forward the incoming request body to Supabase auth endpoint
  const body = await req.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ error: "Missing body" }, { status: 400 });
  }

  // This endpoint will be used by the client to relay auth events (e.g., sign-in)
  // and sync cookies server-side. For now we simply proxy the signIn request
  // to the Supabase token endpoint and set auth cookies via the helper.

  // Use the handler to sign in
  const { data, error } = await supabase.auth.signInWithPassword({
    email: body.email,
    password: body.password,
  });

  if (error) {
    console.error("Auth signIn error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Debug: enumerate cookies present after sign-in (dev-only)
  try {
    const names = cookieStore.getAll().map((c) => c.name);
    console.log("Auth signIn success, cookie names:", names);

    // Return cookie names to the client for debugging (only in non-production)
    const payload: any = { data };
    if (process.env.NODE_ENV !== "production") payload.cookieNames = names;

    return NextResponse.json(payload);
  } catch (e) {
    console.warn("Could not read cookies in auth route", e);
    return NextResponse.json(data);
  }
}
