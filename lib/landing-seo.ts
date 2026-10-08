import type { Metadata } from "next";

export const SITE_URL = "https://www.restorystudio.co.kr";
export const SITE_NAME = "리스토리";
export const DEFAULT_OG_IMAGE = "/images/og-image.png";
const DEFAULT_ROBOTS: Metadata["robots"] = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-video-preview": -1,
    "max-image-preview": "large",
    "max-snippet": -1,
  },
};

type AnyMetadata = Metadata & {
  openGraph?: Metadata["openGraph"] & {
    images?: unknown;
  };
  twitter?: Metadata["twitter"] & {
    images?: unknown;
  };
};

function toAbsoluteUrl(value: unknown): string | undefined {
  if (!value) return undefined;
  if (value instanceof URL) return value.toString();
  if (typeof value !== "string") return undefined;
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }
  return new URL(value.startsWith("/") ? value : `/${value}`, SITE_URL).toString();
}

function metadataText(value: unknown): string | undefined {
  if (!value) return undefined;
  if (typeof value === "string") return value;
  if (value instanceof URL) return value.toString();
  if (typeof value === "object" && "absolute" in value) {
    const absolute = (value as { absolute?: unknown }).absolute;
    return typeof absolute === "string" ? absolute : undefined;
  }
  return undefined;
}

function normalizeCanonical(metadata: AnyMetadata): string | undefined {
  const canonical = (metadata.alternates as { canonical?: unknown } | undefined)
    ?.canonical;
  return toAbsoluteUrl(canonical);
}

function normalizeOpenGraphImages(images: unknown) {
  const input = images ?? [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630 }];
  const list = Array.isArray(input) ? input : [input];

  return list
    .map((image) => {
      if (typeof image === "string" || image instanceof URL) {
        return toAbsoluteUrl(image);
      }

      if (image && typeof image === "object") {
        const source = image as { url?: unknown };
        const url = toAbsoluteUrl(source.url);
        if (!url) return undefined;
        return { ...image, url };
      }

      return undefined;
    })
    .filter(Boolean);
}

function imageUrls(images: ReturnType<typeof normalizeOpenGraphImages>) {
  return images
    .map((image) => {
      if (typeof image === "string") return image;
      if (image && typeof image === "object" && "url" in image) {
        return typeof image.url === "string" ? image.url : undefined;
      }
      return undefined;
    })
    .filter((url): url is string => Boolean(url));
}

function normalizeRobots(robots: Metadata["robots"]): Metadata["robots"] {
  if (!robots || typeof robots === "string" || Array.isArray(robots)) {
    return robots ?? DEFAULT_ROBOTS;
  }

  if (robots.index === false) return robots;

  const defaultRobots = DEFAULT_ROBOTS as Record<string, unknown> & {
    googleBot?: Record<string, unknown>;
  };
  const robotOverrides = robots as Record<string, unknown> & {
    googleBot?: unknown;
  };
  const googleBotOverrides =
    robotOverrides.googleBot &&
    typeof robotOverrides.googleBot === "object" &&
    !Array.isArray(robotOverrides.googleBot)
      ? (robotOverrides.googleBot as Record<string, unknown>)
      : {};

  return {
    ...defaultRobots,
    ...robotOverrides,
    googleBot: {
      ...defaultRobots.googleBot,
      ...googleBotOverrides,
    },
  } as Metadata["robots"];
}

export function withLandingSeo(metadata: AnyMetadata): Metadata {
  const canonical = normalizeCanonical(metadata);
  const openGraph = metadata.openGraph ?? {};
  const openGraphImages = normalizeOpenGraphImages(openGraph.images);
  const title =
    metadataText(openGraph.title) ?? metadataText(metadata.title) ?? SITE_NAME;
  const description =
    metadataText(openGraph.description) ?? metadataText(metadata.description);

  return {
    ...metadata,
    robots: normalizeRobots(metadata.robots),
    alternates: canonical
      ? {
          ...metadata.alternates,
          canonical,
        }
      : metadata.alternates,
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "ko_KR",
      ...openGraph,
      title,
      description,
      url: toAbsoluteUrl(openGraph.url) ?? canonical,
      images: openGraphImages as Metadata["openGraph"] extends infer O
        ? O extends { images?: infer I }
          ? I
          : never
        : never,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageUrls(openGraphImages),
      ...metadata.twitter,
    },
  };
}

export type BreadcrumbItem = {
  name: string;
  url: string;
};

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: toAbsoluteUrl(item.url),
    })),
  };
}

export function buildWebPageJsonLd({
  name,
  description,
  url,
  image,
}: {
  name: string;
  description: string;
  url: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    inLanguage: "ko-KR",
    url: toAbsoluteUrl(url),
    image: toAbsoluteUrl(image),
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}
