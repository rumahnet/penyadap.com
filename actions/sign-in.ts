"use server";

import { redirect } from "next/navigation";

export async function credentialsSignIn(email: string, password: string, callbackUrl: string = "/dashboard") {
  try {
    // Post form-urlencoded data to the NextAuth credentials signin endpoint.
    // NextAuth expects form data similar to client `signIn` calls.
    const body = new URLSearchParams();
    body.set("csrfToken", "");
    body.set("callbackUrl", callbackUrl);
    body.set("json", "true");
    body.set("email", email.toLowerCase());
    body.set("password", password);

    const base = process.env.NEXT_PUBLIC_APP_URL ?? "";
    const url = base ? `${base}/api/auth/signin/credentials` : `/api/auth/signin/credentials`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
      // ensure this request uses current cookies/session
      credentials: "include",
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const message = data?.error || "Invalid credentials";
      throw new Error(message);
    }

    // If NextAuth returned a URL, redirect to it; otherwise go to callbackUrl.
    const redirectTo = (data && data.url) || callbackUrl;
    redirect(redirectTo);
  } catch (error: any) {
    if (error.message?.includes("NEXT_REDIRECT")) {
      throw error;
    }
    throw new Error("Sign in failed: " + (error?.message ?? "unknown"));
  }
}

