import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 이미지 최적화
  images: {
    // WebP/AVIF 포맷 자동 변환 (용량 50~80% 감소)
    formats: ["image/avif", "image/webp"],
    // 필요한 사이즈만 생성 (불필요한 리사이징 방지)
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    // 외부 이미지 도메인 (Supabase 스토리지 등)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "qbotbuipbnkpxnvhgify.supabase.co",
        pathname: "/storage/**",
      },
    ],
    // 캐시 유지 기간 (초) — 한 번 최적화된 이미지 60일 캐시
    minimumCacheTTL: 5184000,
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [{ key: "X-Robots-Tag", value: "all" }],
      },
      // 정적 자산 장기 캐시
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
