import { allPosts } from "contentlayer/generated";

import { constructMetadata, getBlurDataURL } from "@/lib/utils";
import { BlogPosts } from "@/components/content/blog-posts";

export const metadata = constructMetadata({
  title: "Blog – Penyadap.com",
  description: "Layanan jasa aplikasi sadap untuk melindungi orang tercinta untuk ponsel Android dan iPhone / iPad semua pereangkat iOS.",
});

export default async function BlogPage() {

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
