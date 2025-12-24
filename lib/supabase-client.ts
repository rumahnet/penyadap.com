"use client";

// Browser-only Supabase client for client components
// This file should ONLY be imported in client components ("use client")
import { createClient } from "@supabase/supabase-js";
import { env } from "@/env.mjs";

// Client-side Supabase instance (for browser usage)
export const supabaseClient = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ?? ""
);

