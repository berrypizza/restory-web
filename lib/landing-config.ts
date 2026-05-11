export interface LandingConfig {
  slug: string;
  title: string;
  description: string;
  heroTitle: string;
}

export const landingPages: LandingConfig[] = [
  { slug: "cheongali", title: "천갈이 | Re'Story", description: "천갈이 시공 전문", heroTitle: "천갈이" },
  { slug: "sangbujang", title: "싱크대 상부장 처짐 | Re'Story", description: "싱크대 상부장 처짐 수리 전문", heroTitle: "싱크대 상부장 처짐" },
  { slug: "cheongali-2", title: "천갈이 | Re'Story", description: "천갈이 시공 전문", heroTitle: "천갈이" },
  { slug: "cheongali-3", title: "천갈이 | Re'Story", description: "천갈이 시공 전문", heroTitle: "천갈이" },
  { slug: "cheongali-4", title: "천갈이 | Re'Story", description: "천갈이 시공 전문", heroTitle: "천갈이" },
  { slug: "cheongali-5", title: "천갈이 | Re'Story", description: "천갈이 시공 전문", heroTitle: "천갈이" },
  { slug: "cheongali-6", title: "천갈이 | Re'Story", description: "천갈이 시공 전문", heroTitle: "천갈이" },
];

export function getLandingBySlug(slug: string): LandingConfig | undefined {
  return landingPages.find((lp) => lp.slug === slug);
}
