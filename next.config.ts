import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['fs', 'path'],

  experimental: {},
  compress: true,

  eslint: {
    ignoreDuringBuilds: true,
  },
  ...(process.env.NODE_ENV === 'production' && {
    poweredByHeader: false,
    generateEtags: false,
  }),
};

export default nextConfig;
