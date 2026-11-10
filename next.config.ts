import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/product/premium-super-matt",
        destination: "/product/gold-prime-super-matt-paint",
        permanent: false,
      },
      {
        source: "/product/premium-super-satin",
        destination: "/product/satin",
        permanent: false,
      },
      {
        source: "/product/satin-finish",
        destination: "/product/satin",
        permanent: false,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "*.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "xq9fobc7vnjjusv7.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
