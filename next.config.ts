import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.prishandel.no",
          },
        ],
        destination: "https://prishandel.no/:path*",
        permanent: true, // 308
      },
    ];
  },
};

export default nextConfig;
