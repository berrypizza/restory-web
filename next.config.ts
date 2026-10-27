import type { NextConfig } from "next";
import { RESTORY_SUPABASE_PUBLISHABLE_KEY } from "./lib/supabase-public";

const nextConfig: NextConfig = {
  env: { NEXT_PUBLIC_SUPABASE_ANON_KEY: RESTORY_SUPABASE_PUBLISHABLE_KEY },
  turbopack: { root: process.cwd() },
  distDir: process.env.RESTORY_BUILD_DIRECTORY || ".next",
  // 이미지 최적화
  images: {
    formats: ["image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "qbotbuipbnkpxnvhgify.supabase.co",
        pathname: "/storage/**",
      },
    ],
    minimumCacheTTL: 5184000,
  },

  // 검색에 사용되던 주방 주소를 대표로 유지하고 www로 통일합니다.
  async redirects() {
    return [
      {
        source: "/kitchen/sink-door/:keyword",
        destination: "https://www.restorystudio.co.kr/kitchen/:keyword",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "restorystudio.co.kr" }],
        destination: "https://www.restorystudio.co.kr/:path*",
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [{ key: "X-Robots-Tag", value: "all" }],
      },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000, stale-while-revalidate=86400",
          },
        ],
      },
      {
        source: "/icons/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
