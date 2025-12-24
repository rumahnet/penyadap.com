import { env } from "@/env.mjs";

// Lazy create a Supabase server client to avoid importing `@supabase/supabase-js`
// during module evaluation (useful for middleware / edge bundling).
export async function getSupabaseServer() {
  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY ?? "", {
    auth: { persistSession: false },
  });
  return supabase;
}

export default getSupabaseServer;