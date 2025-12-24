import { env } from "@/env.mjs";

export const getUserByEmail = async (email: string) => {
  try {
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY ?? "");

    // Supabase admin does not expose a typed getUserByEmail in all versions; list users and match by email
    const res = await supabase.auth.admin.listUsers();
    const users = (res?.data as any)?.users ?? [];
    const found = users.find((u: any) => u.email?.toLowerCase() === email.toLowerCase());
    if (!found) return null;
    return {
      id: found.id,
      email: found.email,
      name: found.user_metadata?.name ?? null,
      password: undefined,
      emailVerified: (found.email_confirmed_at ?? found.confirmed_at) ?? null,
    } as any;
  } catch (e) {
    console.error("getUserByEmail error", e);
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY ?? "");

    const { data, error } = await supabase.auth.admin.getUserById(id);
    if (error || !data) return null;
    return data as any;
  } catch (e) {
    console.error("getUserById error", e);
    return null;
  }
};