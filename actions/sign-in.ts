"use server";

import { signIn } from "@/auth";
import { redirect } from "next/navigation";

export async function credentialsSignIn(email: string, password: string, callbackUrl: string = "/dashboard") {
  try {
    const result = await signIn("credentials", {
      email: email.toLowerCase(),
      password,
      redirect: false,
    });

    if (!result?.ok) {
      throw new Error("Invalid credentials");
    }

    redirect(callbackUrl);
  } catch (error: any) {
    if (error.message?.includes("NEXT_REDIRECT")) {
      throw error;
    }
    throw new Error("Sign in failed");
  }
}

