import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Suppress the workspace root warning since we intentionally have a nested Next.js project
  experimental: {},
  // Improve image optimization 
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
