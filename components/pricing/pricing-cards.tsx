"use client";

import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
/* eslint-disable tailwindcss/classnames-order */

export function PricingCards() {
  return (
    <MaxWidthWrapper>
      {/* eslint-disable-next-line tailwindcss/classnames-order */}
      <section className="flex flex-col items-center text-center">
        <h2 className="text-2xl font-semibold">Pricing removed</h2>
        <p className="mt-4 text-muted-foreground max-w-xl">
          The subscription and billing features have been removed from this
          project. If you need a paid plan or billing support, please contact
          us at <a href="mailto:support@saas-starter.com">support@saas-starter.com</a>.
        </p>
      </section>
    </MaxWidthWrapper>
  );
}

