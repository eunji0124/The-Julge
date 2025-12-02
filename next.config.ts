import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'cdn.example.com' },
      { protocol: 'https', hostname: 'image-server.myapp.co.kr' },
      //공용api 접속에 필요
      {
        protocol: 'https',
        hostname: 'bootcamp-project-api.s3.ap-northeast-2.amazonaws.com',
      },
      { protocol: 'https', hostname: 'i.pinimg.com' },
      { protocol: 'https', hostname: 'example.com' },
    ],
  },

  async redirects() {
    return [
      {
        source: '/',
        destination: '/staff/notices',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
