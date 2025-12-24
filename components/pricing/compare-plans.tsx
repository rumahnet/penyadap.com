import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

export function ComparePlans() {
  return (
    <MaxWidthWrapper>
      {/* eslint-disable-next-line tailwindcss/classnames-order */}
      <section className="text-center py-8">
        <h3 className="text-lg font-semibold">Plan comparison removed</h3>
        <p className="mt-2 text-muted-foreground">
          The plan comparison table has been removed as subscriptions are no
          longer supported in this project.
        </p>
      </section>
    </MaxWidthWrapper>
  );
}

