import { notFound } from "next/navigation";
import { allDocs } from "contentlayer/generated";

import { getCurrentUser } from "@/lib/session";
import { getTableOfContents } from "@/lib/toc";
import { DocsPageHeader } from "@/components/docs/page-header";
import { DashboardTableOfContents } from "@/components/shared/toc";
import { GuideContent } from "@/components/guides/guide-content";

import "@/styles/mdx.css";

export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { constructMetadata } from "@/lib/utils";

interface DocPageProps {
  params: {
    slug: string[];
  };
}

async function getDocFromParams(params) {
  const slug = params.slug?.join("/") || "";
  const doc = allDocs.find((doc) => doc.slugAsParams === slug);

  if (!doc) return null;

  return doc;
}

export async function generateMetadata({
  params,
}: DocPageProps): Promise<Metadata> {
  const doc = await getDocFromParams(params);

  if (!doc) return {};

  const { title, description } = doc;

  return constructMetadata({
    title: `${title} – iOS Guide`,
    description: description,
  });
}

export async function generateStaticParams(): Promise<
  DocPageProps["params"][]
> {
  return allDocs.map((doc) => ({
    slug: doc.slugAsParams.split("/"),
  }));
}

export default async function iOSPage({ params }: DocPageProps) {
  const user = await getCurrentUser();
  const doc = await getDocFromParams(params);

  if (!doc) {
    notFound();
  }

  const toc = await getTableOfContents(doc.body.raw);

  // Check if user is authenticated
  const isAuthenticated = !!user;
  const slug = params.slug?.join("/") || "";

  // Fake content for unauthenticated users
  const fakeContent = {
    title: "Installation Guide",
    description: "Step-by-step guide to install the application",
    toc: [],
  };

  return (
    <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]">
      <div className="mx-auto w-full min-w-0">
        <DocsPageHeader heading={doc.title} text={doc.description} />
        
        {/* Content fetching handled by client component */}
        <GuideContent
          slug={slug}
          isAuthenticated={isAuthenticated}
          fakeContent={fakeContent}
          redirectTo="/login?from=/ios"
        />
      </div>
      {isAuthenticated ? (
        <div className="hidden text-sm xl:block">
          <div className="sticky top-16 -mt-10 max-h-[calc(var(--vh)-4rem)] overflow-y-auto pt-8">
            <DashboardTableOfContents toc={toc} />
          </div>
        </div>
      ) : (
        <div className="hidden text-sm xl:block">
          <div className="sticky top-16 -mt-10 max-h-[calc(var(--vh)-4rem)] overflow-y-auto pt-8" style={{ filter: "blur(12px)" }}>
            <div className="space-y-2">
              <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
              <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
