"use client";

import * as React from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { SubscriptionPlan } from "@/types";
import { UserSubscriptionPlan } from "@/types";

interface BillingFormButtonProps {
  year?: boolean;
  offer: SubscriptionPlan;
  subscriptionPlan?: UserSubscriptionPlan;
}

export function BillingFormButton({ offer }: BillingFormButtonProps) {
  // Minimal placeholder: navigate to pricing page. Integrate real billing flow later.
  return (
    <Link
      href="/pricing"
      className={buttonVariants({ rounded: "full" })}
    >
      Choose plan
    </Link>
  );
}

export default BillingFormButton;
