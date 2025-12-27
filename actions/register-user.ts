"use server";

import { userRegisterSchema } from "@/lib/validations/auth";

export type FormData = {
  email: string;
  password: string;
  confirmPassword?: string;
};

export async function registerUser(data: FormData) {
  try {
    const parsed = userRegisterSchema.parse(data);

    // Ensure service role key is set (required for admin user creation)
    const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (!SERVICE_ROLE || !SUPABASE_URL) {
      console.error("registerUser error: SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL is not set");
      return { status: "error", message: "Server misconfigured: missing Supabase service role or URL" } as const;
    }

    // create user using Supabase Admin API (lazy import)
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);
    
    // Always auto-confirm emails for testing (will remove this later for production)
    const autoConfirmEmail = true;
    
    console.log("Creating user with email_confirm:", autoConfirmEmail, "NODE_ENV:", process.env.NODE_ENV);
    
    const { data: created, error } = await supabase.auth.admin.createUser({
      email: parsed.email.toLowerCase(),
      password: parsed.password,
      email_confirm: autoConfirmEmail,
    } as any);

    if (error) {
      console.error("Supabase createUser error:", error);
      // if user already exists, return exists
      if ((error as any).message?.includes("duplicate")) {
        return { status: "exists" } as const;
      }
      return { status: "error" } as const;
    }

    if (!created) {
      console.error("No user created");
      return { status: "error" } as const;
    }

    console.log("User registered successfully:", created.user.id);
    return { status: "success" } as const;
  } catch (error) {
    console.error("registerUser error:", error);
    return { status: "error" } as const;
  }
}
