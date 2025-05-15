import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable Edge runtime
  experimental: {
    // Enable modern features
    typedRoutes: true,
  },
  // Configure image domains if you're using next/image
  images: {
    domains: ['noves.fi'], // Add any domains you need for images
  }
};

export default nextConfig;
