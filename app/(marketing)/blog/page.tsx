import { allPosts } from "contentlayer/generated";

import { constructMetadata, getBlurDataURL } from "@/lib/utils";
import { BlogPosts } from "@/components/content/blog-posts";

export const metadata = constructMetadata({
  title: "Blog – SaaS Starter",
  description: "Latest news and updates from Next SaaS Starter.",
});

export default async function BlogPage() {
  // Debug: log the detected `allPosts` length at render/build time to help
  // diagnose why the blog list is empty in production preview.
  try {
    // eslint-disable-next-line no-console
    console.debug("BlogPage build-time allPosts length:", Array.isArray(allPosts) ? allPosts.length : typeof allPosts);
  } catch (e) {
    /* ignore */
  }

  try {
    // eslint-disable-next-line no-console
    console.debug(
      "BlogPage sample posts:",
      Array.isArray(allPosts)
        ? allPosts.slice(0, 5).map((p) => ({
            _id: p._id,
            title: p.title,
            image: p.image ?? null,
            authors: p.authors ?? null,
            published: p.published ?? null,
            date: p.date ?? null,
          }))
        : allPosts,
    );
  } catch (e) {
    /* ignore */
  }

  const posts = await Promise.all(
    allPosts
      .filter((post) => post && (post.published ?? true))
      .sort((a, b) => b.date.localeCompare(a.date))
      .map(async (post) => ({
        ...post,
        blurDataURL: await getBlurDataURL(post?.image ?? null),
      })),
  );

  return <BlogPosts posts={posts} />;
}
