/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable edge runtime for API routes
  experimental: {
    serverActions: true,
  },
  images: {
    unoptimized: true,
    domains: ['*'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  output: "export",
  distDir: 'out',
};

export default nextConfig;
