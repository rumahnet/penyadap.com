import Link from "next/link";
import * as React from "react";

import { CustomerPortalButton } from "@/components/forms/customer-portal-button";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn, formatDate } from "@/lib/utils";
import { UserSubscriptionPlan } from "types";

interface BillingInfoProps extends React.HTMLAttributes<HTMLFormElement> {
  userSubscriptionPlan?: {
    title?: string;
    description?: string;
    stripeCustomerId?: string | null;
    isPaid?: boolean;
    isCanceled?: boolean;
    stripeCurrentPeriodEnd?: string | Date | null;
  } | null;
}

export function BillingInfo({ userSubscriptionPlan }: BillingInfoProps) {
  if (!userSubscriptionPlan) return null;

  const {
    title,
    description,
    stripeCustomerId,
    isPaid,
    isCanceled,
    stripeCurrentPeriodEnd,
  } = userSubscriptionPlan;

  // If there is no subscription info (project uses only Auth/Supabase), render nothing
  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Plan</CardTitle>
        <CardDescription>
          You are currently on the <strong>{title}</strong> plan.
        </CardDescription>
      </CardHeader>
      <CardContent>{description}</CardContent>
      <CardFooter className="flex flex-col items-center space-y-2 border-t bg-accent py-2 md:flex-row md:justify-between md:space-y-0">
        {isPaid ? (
          <p className="text-sm font-medium text-muted-foreground">
            {isCanceled ? "Your plan will be canceled on " : "Your plan renews on "}
            {
              // Safely format the period end only when present and a valid type
              (() => {
                if (!stripeCurrentPeriodEnd) return "unknown";
                if (typeof stripeCurrentPeriodEnd === "string") return formatDate(stripeCurrentPeriodEnd);
                if (stripeCurrentPeriodEnd instanceof Date) return formatDate(stripeCurrentPeriodEnd.getTime());
                if (typeof stripeCurrentPeriodEnd === "number") return formatDate(stripeCurrentPeriodEnd);
                return "unknown";
              })()
            }.
          </p>
        ) : null}

        {isPaid && stripeCustomerId ? (
          <CustomerPortalButton userStripeId={stripeCustomerId} />
        ) : (
          <Link href="/pricing" className={cn(buttonVariants())}>
            Choose a plan
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}
