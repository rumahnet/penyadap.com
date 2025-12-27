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
  // In Next 16, `params` can be a Promise and must be awaited before
  // accessing its properties. Awaiting works whether `params` is a plain
  // object or a Promise, so this is safe for both legacy and new behavior.
  const resolved = await params;
  const slug = resolved?.slug?.join("/") || "";

  // Base directory for this page (since the route lives in /android)
  const base = "android";

  // Try to find the doc by slug; allow fallbacks for index files and flattened path variants
  let doc = allDocs.find((doc) => doc.slugAsParams === slug);

  if (!doc) {
    // When slug is empty, first try to find a doc whose `slugAsParams` equals the base
    if (!slug) {
      doc = allDocs.find((d) => d.slugAsParams === base);
    }

    if (!doc) {
      doc = allDocs.find((d) => {
        const fp = String(d._raw?.flattenedPath || "");

        // When slug is empty (visiting /android), prefer a doc whose flattenedPath equals base
        if (!slug) {
          return fp === base || fp === `${base}/index`;
        }

        // Match exact flattened path, trailing '/index', or ending with the slug segment
        return (
          fp === slug ||
          fp === `${slug}/index` ||
          fp.endsWith(`/${slug}`) ||
          fp.endsWith(`/${slug}/index`)
        );
      });
    }
  }

  if (!doc) return null;

  // Normalize slug to pass to the client: prefer `doc.slugAsParams`, or derive from flattenedPath
  const finalSlug = doc.slugAsParams || (String(doc._raw?.flattenedPath || "").replace(/\/index$/, ""));

  return doc;
}

export async function generateMetadata({
  params,
}: DocPageProps): Promise<Metadata> {
  const doc = await getDocFromParams(params);

  if (!doc) return {};

  const { title, description } = doc;

  return constructMetadata({
    title: `${title} – SaaS Starter`,
    description: description,
  });
}

export async function generateStaticParams(): Promise<
  DocPageProps["params"][]
> {
  const base = "android";
  return allDocs
    .filter((doc) => String(doc._raw?.flattenedPath || "").startsWith(base))
    .map((doc) => {
      const fp = String(doc._raw?.flattenedPath || "");
      // If this doc is the base index (android/index or android), yield an empty slug
      if (fp === base || fp === `${base}/index` || doc.slugAsParams === base) {
        return { slug: [] };
      }

      return { slug: doc.slugAsParams.split("/") };
    });
}

export default async function DocPage({ params }: DocPageProps) {
  const user = await getCurrentUser();
  const doc = await getDocFromParams(params);

  if (!doc) {
    notFound();
  }

  const toc = await getTableOfContents(doc.body.raw);

  // Check if user is authenticated
  const isAuthenticated = !!user;
  // params may be a Promise; await it before accessing
  const resolvedParams = await params;
  const slug = resolvedParams?.slug?.join("/") || "";

  // Fake content for unauthenticated users
  const fakeContent = {
    title: "Installation Guide",
    description: "Step-by-step guide to install the application",
    toc: [],
  };

  // Compute final slug to pass to the client component
  const finalSlug = doc.slugAsParams || String(doc._raw?.flattenedPath || "").replace(/\/index$/, "");

  // Debug: log the resolved slug and document slug for diagnosis
  try {
    // eslint-disable-next-line no-console
    console.debug("DocPage debug:", { resolvedSlug: slug, docSlug: doc?.slugAsParams, finalSlug, docFlattenedPath: doc?._raw?.flattenedPath });
  } catch (e) {
    /* ignore */
  }

  return (
    <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]">
      <div className="mx-auto w-full min-w-0">
        <DocsPageHeader heading={doc.title} text={doc.description} />
        
        {/* Content fetching handled by client component */}
        <GuideContent
          slug={finalSlug}
          isAuthenticated={isAuthenticated}
          fakeContent={fakeContent}
          redirectTo="/login?from=/android"
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
