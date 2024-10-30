/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable edge runtime for API routes
  experimental: {
    serverActions: {},
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
  // Add in for mobile 
  // output: "export",
  // distDir: 'out',
};

export default nextConfig;
