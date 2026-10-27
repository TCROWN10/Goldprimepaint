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
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
