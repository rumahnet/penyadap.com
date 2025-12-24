"use client";

import * as React from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

interface CustomerPortalButtonProps {
  userStripeId?: string | null;
}

export function CustomerPortalButton({ userStripeId }: CustomerPortalButtonProps) {
  // Subscriptions have been removed; provide a way for users to contact support.
  const supportEmail = siteConfig?.mailSupport ?? "support@saas-starter.com";

  return (
    <Link
      href={`mailto:${supportEmail}`}
      className={buttonVariants()}
      aria-disabled={!supportEmail}
    >
      Contact support
    </Link>
  );
}

export default CustomerPortalButton;
