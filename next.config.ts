// next.config.js
import path from 'path';
/** @type {import('next').NextConfig} */

const nextConfig = {
  outputFileTracingRoot: path.join(__dirname, '../../'),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
      },
    ],
  },
};

module.exports = nextConfig;