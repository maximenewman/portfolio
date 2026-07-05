import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      // Tigris object storage (blog/project media served from the bucket CDN).
      { protocol: "https", hostname: "*.fly.storage.tigris.dev" },
      { protocol: "https", hostname: "fly.storage.tigris.dev" },
    ],
  },
};

export default nextConfig;
