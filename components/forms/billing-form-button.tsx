"use client";

import * as React from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

interface BillingFormButtonProps {
  // Dummy props kept for compatibility; billing is removed.
}

export function BillingFormButton(_: BillingFormButtonProps) {
  const supportEmail = siteConfig?.mailSupport ?? "support@saas-starter.com";

  return (
    <Link href={`mailto:${supportEmail}`} className={buttonVariants({ rounded: "full" })}>
      Contact support
    </Link>
  );
}

export default BillingFormButton;
