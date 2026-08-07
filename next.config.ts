import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    if (!process.env.VERCEL) return [];

    return [
      {
        source: "/:path*",
        destination: "https://findrive-academy.kredavto.chatgpt.site/:path*",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
