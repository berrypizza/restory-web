export function LocalBusinessJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: "리스토리 Re'Story",
    url: "https://restorystudio.co.kr",
    logo: "https://restorystudio.co.kr/images/logo.png",
    image: "https://restorystudio.co.kr/images/og-image.png",
    description:
      "싱크대 상부장 수리, 싱크대 문짝 리폼, 식당 의자 가죽 교체, 소파 쿠션 복원 전문. 서울·경기·인천 전 지역 출장.",
    telephone: "010-6855-0957",
    areaServed: [
      { "@type": "State", name: "서울특별시" },
      { "@type": "State", name: "경기도" },
      { "@type": "State", name: "인천광역시" },
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "서울",
      addressRegion: "서울특별시",
      addressCountry: "KR",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "519",
      bestRating: "5",
    },
    priceRange: "₩₩",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "08:00",
      closes: "22:00",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "가구 수리 서비스",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "싱크대 상부장 수리",
            description:
              "상부장 처짐·추락 증상 합판 시공목으로 수리. 3년 무상 A/S.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "싱크대 문짝 리폼",
            description: "문짝 교체로 새 주방처럼. 100가지 이상 색상 선택.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "식당 의자 가죽 교체",
            description: "식당·카페·병원 의자 가죽 천갈이. 영업 외 시간 시공.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "소파 쿠션 복원",
            description:
              "소파 쿠션 꺼짐 복원. HR 고탄성 스펀지 사용. 당일 시공.",
          },
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function ServiceJsonLd({
  name,
  description,
  url,
}: {
  name: string;
  description: string;
  url: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url,
    provider: {
      "@type": "HomeAndConstructionBusiness",
      name: "리스토리 Re'Story",
      telephone: "010-6855-0957",
      url: "https://restorystudio.co.kr",
    },
    areaServed: ["서울특별시", "경기도", "인천광역시"],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "519",
      bestRating: "5",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function FAQJsonLd({ faqs }: { faqs: { q: string; a: string }[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
