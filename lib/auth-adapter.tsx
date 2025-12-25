"use client";

import { supabaseClient } from "@/lib/supabase-client";
import { useSupabaseAuth } from "@/components/providers/supabase-provider";

// Hook similar to other auth libraries' useSession implementations
export function useSession() {
  const { session, isLoading } = useSupabaseAuth();
  const status = isLoading ? "loading" : session ? "authenticated" : "unauthenticated";

  async function update() {
    // Refresh session/user information from Supabase
    try {
      const { data } = await supabaseClient.auth.getSession();
      return data;
    } catch (e) {
      console.error("session update error", e);
      return null;
    }
  }

  return { data: session, status, update } as const;
}

// Sign out helper (callable from event handlers)
export async function signOut() {
  await supabaseClient.auth.signOut();
  if (typeof window !== "undefined") {
    // Reload so any server-rendered content can update
    window.location.reload();
  }
}

// Sign in helper for providers - supports OAuth providers and credentials
export async function signIn(provider: string, options?: any) {
  if (provider === "google") {
    await supabaseClient.auth.signInWithOAuth({ provider: "google" });
    return { ok: true };
  }

  if (provider === "credentials") {
    const { email, password } = options || {};
    try {
      const res = await supabaseClient.auth.signInWithPassword({
        email: email?.toLowerCase?.(),
        password,
      });

      if (res.error) {
        return { ok: false, error: res.error.message };
      }

      // Successful sign in — return a URL for the client to redirect to
      return { ok: true, url: options?.callbackUrl || "/dashboard" };
    } catch (e: any) {
      console.error("signIn error", e);
      return { ok: false, error: String(e) };
    }
  }

  throw new Error(`Unsupported provider: ${provider}`);
}
