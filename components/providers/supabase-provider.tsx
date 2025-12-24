"use client";

import * as React from "react";
import { supabaseClient } from "@/lib/supabase-client";

type SupabaseAuthContext = {
  session: any | null;
  user: any | null;
  isLoading: boolean;
  signInWithPassword: (email: string, password: string) => Promise<{ error?: any; data?: any }>;
  signInWithGoogle: (redirectTo?: string) => Promise<void>;
  signOut: () => Promise<void>;
};

export const SupabaseAuthContext = React.createContext<SupabaseAuthContext | undefined>(undefined);

export function useSupabaseAuth() {
  const ctx = React.useContext(SupabaseAuthContext);
  if (!ctx) throw new Error("useSupabaseAuth must be used within SupabaseProvider");
  return ctx;
}

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = React.useState<any | null>(null);
  const [user, setUser] = React.useState<any | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const { data } = await supabaseClient.auth.getSession();
        if (!mounted) return;
        setSession(data?.session ?? null);
        setUser(data?.session?.user ?? null);
      } catch (e) {
        console.error("supabase getSession error", e);
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();

    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((event, session) => {
      setSession(session ?? null);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  async function signInWithPassword(email: string, password: string) {
    const res = await supabaseClient.auth.signInWithPassword({ email, password });
    return res;
  }

  async function signInWithGoogle(redirectTo?: string) {
    await supabaseClient.auth.signInWithOAuth({ provider: "google", options: redirectTo ? { redirectTo } : undefined });
  }

  async function signOut() {
    await supabaseClient.auth.signOut();
  }

  return (
    <SupabaseAuthContext.Provider value={{ session, user, isLoading, signInWithPassword, signInWithGoogle, signOut }}>
      {children}
    </SupabaseAuthContext.Provider>
  );
}
