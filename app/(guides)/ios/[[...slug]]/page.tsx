import { notFound } from "next/navigation";
import { allDocs } from "contentlayer/generated";

import { getCurrentUser } from "@/lib/session";
import { getTableOfContents } from "@/lib/toc";
import { Mdx } from "@/components/content/mdx-components";
import { DocsPageHeader } from "@/components/docs/page-header";
import { DocsPager } from "@/components/docs/pager";
import { DashboardTableOfContents } from "@/components/shared/toc";
import { LoginRequiredButton } from "@/components/guides/login-required-button";

import "@/styles/mdx.css";

import { Metadata } from "next";

import { constructMetadata, getBlurDataURL } from "@/lib/utils";

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

  const images = await Promise.all(
    doc.images.map(async (src: string) => ({
      src,
      blurDataURL: await getBlurDataURL(src),
    })),
  );

  // Check if user is authenticated
  const isAuthenticated = !!user;

  return (
    <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]">
      <div className="mx-auto w-full min-w-0">
        <DocsPageHeader heading={doc.title} text={doc.description} />
        
        {/* Content Container */}
        {!isAuthenticated ? (
          <div className="container flex min-h-screen max-w-screen-2xl items-center justify-center">
            <div className="space-y-4 text-center">
              <h3 className="text-lg font-semibold">Login Required</h3>
              <p className="text-sm text-muted-foreground">
                Sign in with your credentials to view this content
              </p>
              <LoginRequiredButton redirectPath="/login?from=/ios" />
            </div>
          </div>
        ) : (
          <>
            <div className="pb-4 pt-11">
              <Mdx code={doc.body.code} images={images} />
            </div>
            <hr className="my-4 md:my-6" />
            <DocsPager doc={doc} />
          </>
        )}
      </div>
      <div className="hidden text-sm xl:block">
        <div className="sticky top-16 -mt-10 max-h-[calc(var(--vh)-4rem)] overflow-y-auto pt-8">
          <DashboardTableOfContents toc={toc} />
        </div>
      </div>
    </main>
  );
}
