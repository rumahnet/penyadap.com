import { MagicLinkEmail } from "@/emails/magic-link-email";
import { Resend } from "resend";

import { env } from "@/env.mjs";
import { siteConfig } from "@/config/site";

type VerificationRequestArgs = { identifier: string; url: string; provider: { from: string } };

import { getUserByEmail } from "./user";

export const resend = new Resend(env.RESEND_API_KEY);

export const sendVerificationRequest = async ({ identifier, url, provider }: VerificationRequestArgs) => {
    const user = await getUserByEmail(identifier);
    if (!user || !user.name) return;

    const userVerified = user?.emailVerified ? true : false;
    const authSubject = userVerified
      ? `Sign-in link for ${siteConfig.name}`
      : "Activate your account";

    try {
      const { data, error } = await resend.emails.send({
        from: provider.from,
        to:
          process.env.NODE_ENV === "development"
            ? "delivered@resend.dev"
            : identifier,
        subject: authSubject,
        react: MagicLinkEmail({
          firstName: user?.name as string,
          actionUrl: url,
          mailType: userVerified ? "login" : "register",
          siteName: siteConfig.name,
        }),
        // Set this to prevent Gmail from threading emails.
        // More info: https://resend.com/changelog/custom-email-headers
        headers: {
          "X-Entity-Ref-ID": new Date().getTime() + "",
        },
      });

      if (error || !data) {
        throw new Error(error?.message);
      }

      // console.log(data)
    } catch (error) {
      throw new Error("Failed to send verification email.");
    }
  };

/**
 * Send a verification email for user registration using Supabase's email confirmation.
 * In development, sends to "delivered@resend.dev" for testing.
 */
export async function sendVerificationEmail({
  email,
  userId,
  mailType,
}: {
  email: string;
  userId: string;
  mailType: "register" | "login";
}) {
  // Build the confirmation link using Supabase's email confirmation callback
  const confirmUrl = new URL(env.NEXT_PUBLIC_APP_URL || "http://localhost:3000");
  confirmUrl.pathname = "/auth/confirm";
  confirmUrl.searchParams.set("token_hash", `verification-token-placeholder`);
  confirmUrl.searchParams.set("type", "email");

  try {
    const { data, error } = await resend.emails.send({
      from: env.EMAIL_FROM || "onboarding@resend.dev",
      to: process.env.NODE_ENV === "development" ? "delivered@resend.dev" : email,
      subject:
        mailType === "register"
          ? `Verify your email for ${siteConfig.name}`
          : `Sign in to ${siteConfig.name}`,
      react: MagicLinkEmail({
        firstName: email.split("@")[0],
        actionUrl: confirmUrl.toString(),
        mailType,
        siteName: siteConfig.name,
      }),
      headers: {
        "X-Entity-Ref-ID": new Date().getTime() + "",
      },
    });

    if (error || !data) {
      throw new Error(error?.message || "Failed to send email");
    }

    return { success: true };
  } catch (error) {
    console.error("sendVerificationEmail error:", error);
    throw error;
  }
}
