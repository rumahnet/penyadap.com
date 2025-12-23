"use client";

import * as React from "react";
import { toast } from "sonner";
import { buttonVariants } from "@/components/ui/button";

interface CustomerPortalButtonProps {
  userStripeId: string;
}

export function CustomerPortalButton({ userStripeId }: CustomerPortalButtonProps) {
  const [loading, setLoading] = React.useState(false);

  async function handleOpenPortal() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: userStripeId }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to open customer portal");
      }

      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No portal URL returned");
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Unable to open customer portal");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      className={buttonVariants()}
      onClick={handleOpenPortal}
      disabled={loading || !userStripeId}
    >
      {loading ? "Opening..." : "Manage billing"}
    </button>
  );
}

export default CustomerPortalButton;
