import { withContentlayer } from "next-contentlayer2";
import "./env.mjs";

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
