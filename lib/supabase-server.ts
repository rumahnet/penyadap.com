// Lazy create a Supabase server client to avoid importing `@supabase/supabase-js`
// during module evaluation (useful for middleware / edge bundling).
export async function getSupabaseServer() {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(SUPABASE_URL ?? "", SERVICE_ROLE, {
    auth: { persistSession: false },
  });
  return supabase;
}

export default getSupabaseServer;