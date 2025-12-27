"use client";

// Browser-only Supabase client for client components
// This file should ONLY be imported in client components ("use client")
import { createClient } from "@supabase/supabase-js";

// Client-side Supabase instance (for browser usage). Use process.env so import
// time doesn't throw if server-side env validation fails.
export const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? ""
);

