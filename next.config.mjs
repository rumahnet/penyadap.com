import { withContentlayer } from "next-contentlayer2";

// Importing `env.mjs` validates env vars during build. On preview/CI setups
// where not all envs are present we should not crash the build — warn instead.
try {
  // Top-level await is supported in Node ESM; use dynamic import and swallow
  // validation errors so the build can continue in environments that don't
  // provide all secret values.
  await import("./env.mjs").catch((e) => {
    // eslint-disable-next-line no-console
    console.warn("env.mjs validation warning:", e?.message || e);
  });
} catch (e) {
  // eslint-disable-next-line no-console
  console.warn("env.mjs import failed:", e?.message || e);
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
    ],
  },
  serverExternalPackages: ["@prisma/client"],
  turbopack: {},
  // Note: `serverExternalPackages` replaces the old experimental.serverComponentsExternalPackages
  // and Turbopack is configured explicitly here with an empty object to avoid errors during build.
};

export default withContentlayer(nextConfig);
