import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable Edge runtime
  experimental: {
    // Enable modern features
    typedRoutes: true,
  },
  // Configure image domains if you're using next/image
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'noves.fi',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'txshare.vercel.app',
      },
    ],
  },
  // Configure headers for OG image generation
  async headers() {
    return [
      {
        source: '/:chain/:txHash',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
