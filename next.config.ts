import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'stcdn.business-online.ru',
        port: '',
        pathname: '/**',
        search: '',
      },
      {
        protocol: 'https',
        hostname: 'img-sport.business-gazeta.ru',
        port: '',
        pathname: '/**',
        search: '',
      },
    ],
    domains: ['https://img-sport.business-gazeta.ru/','https://stcdn.business-online.ru']
  }
};

export default nextConfig;
