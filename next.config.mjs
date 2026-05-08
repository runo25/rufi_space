/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'http',
        hostname: 'property.reworkstaging.name.ng',
      },
      {
        protocol: 'https',
        hostname: 'property.reworkstaging.name.ng',
      },
    ],
  },
};

export default nextConfig;
