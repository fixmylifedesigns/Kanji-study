/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable edge runtime for API routes
  experimental: {
    serverActions: {},
  },
};

export default nextConfig;
