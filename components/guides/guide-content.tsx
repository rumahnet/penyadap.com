"use client";

import { useEffect, useState } from "react";
import { Mdx } from "@/components/content/mdx-components";
import { DashboardTableOfContents } from "@/components/shared/toc";
import { Lock } from "lucide-react";
import Link from "next/link";

interface GuideContentProps {
  slug: string;
  isAuthenticated: boolean;
  fakeContent: {
    title: string;
    description: string;
    toc: any;
  };
  redirectTo: string;
}

interface ContentData {
  success: boolean;
  title: string;
  description: string;
  body: string;
  images: string[];
  error?: string;
}

export function GuideContent({
  slug,
  isAuthenticated,
  fakeContent,
  redirectTo,
}: GuideContentProps) {
  const [content, setContent] = useState<ContentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If not authenticated, just show loading as done
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    // Fetch real content from API
    const fetchContent = async () => {
      try {
        const response = await fetch(`/api/guides/${slug}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }

        const data = await response.json();
        setContent(data);
      } catch (err) {
        console.error("Content fetch error:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [slug, isAuthenticated]);

  // If not authenticated: show blur overlay + fake content
  if (!isAuthenticated) {
    return (
      <div className="relative">
        {/* Fake Header (will be blurred) */}
        <div
          className="mx-auto w-full min-w-0 max-w-screen-2xl pb-4 pt-11"
          style={{
            filter: "blur(12px)",
          }}
        >
          <div className="space-y-2">
            <h1 className="inline-block scroll-m-20 font-heading text-4xl">Installation Guide</h1>
            <p className="text-balance text-lg text-muted-foreground">
              Step-by-step guide to install the application
            </p>
          </div>
        </div>

        {/* Fake Content Container (will be blurred) */}
        <div
          className="mx-auto w-full min-w-0 max-w-screen-2xl pb-4 pt-11"
          style={{
            filter: "blur(12px)",
          }}
        >
          <div className="prose max-w-none">
            <h2>Getting Started</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            <div className="h-40 rounded bg-muted" />
            <div className="h-20 rounded bg-muted" />
          </div>
        </div>

        {/* Login Overlay */}
        <div className="absolute inset-0 flex min-h-[400px] flex-col items-center justify-center">
          <div className="space-y-4 rounded-lg border-2 border-dashed border-muted-foreground/30 bg-background/80 p-8 backdrop-blur-sm">
            <Lock className="mx-auto size-12 text-muted-foreground/60" />
            <div className="space-y-2 text-center">
              <h3 className="text-xl font-semibold">Content Locked</h3>
              <p className="text-sm text-muted-foreground">
                Sign in to view the installation guide
              </p>
            </div>
            <Link
              href={redirectTo}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-6 py-2 font-medium text-primary-foreground hover:bg-primary/90"
            >
              <Lock className="size-4" />
              Sign In to Continue
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If authenticated but loading: show skeleton
  if (loading) {
    return (
      <div className="mx-auto w-full min-w-0 max-w-screen-2xl pb-4 pt-11">
        <div className="space-y-4">
          <div className="h-10 animate-pulse rounded bg-muted" />
          <div className="h-20 animate-pulse rounded bg-muted" />
          <div className="h-40 animate-pulse rounded bg-muted" />
        </div>
      </div>
    );
  }

  // If error
  if (error) {
    return (
      <div className="mx-auto w-full min-w-0 max-w-screen-2xl pb-4 pt-11">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950">
          <p className="text-sm text-red-900 dark:text-red-100">
            <span className="font-semibold">Error:</span> {error}
          </p>
        </div>
      </div>
    );
  }

  // If authenticated + content loaded: show real content (NO BLUR)
  if (content) {
    return (
      <div className="mx-auto w-full min-w-0 max-w-screen-2xl pb-4 pt-11">
        <Mdx
          code={content.body}
          images={content.images.map((src) => ({
            src,
            alt: src,
            blurDataURL: "",
          }))}
        />
      </div>
    );
  }

  return null;
}
