import { ACADEMY_OFFER } from "./offer";

export type AcademyCtaLocation = "nav" | "hero" | "curriculum" | "basic" | "premium" | "mobile";
export type AcademyAttribution = {
  source_plan: "basic" | "setup" | "undecided" | "direct";
  source_cta: AcademyCtaLocation | "direct";
};

const ctaLocations: readonly string[] = ["nav", "hero", "curriculum", "basic", "premium", "mobile"];
const direct: AcademyAttribution = { source_plan: "direct", source_cta: "direct" };

/** Entry interest, not an enrollment or a purchased course. */
export function attributionForCta(location: AcademyCtaLocation): AcademyAttribution {
  return {
    source_plan: location === "basic" ? "basic" : location === "premium" ? "setup" : "undecided",
    source_cta: location,
  };
}

export function consultationHref(location: AcademyCtaLocation): string {
  return `${ACADEMY_OFFER.consultHref}?${new URLSearchParams(attributionForCta(location))}`;
}

/** URL-scoped attribution survives reload/new tabs without inheriting an old visit. */
export function readAcademyAttribution(params: Pick<URLSearchParams, "getAll">): AcademyAttribution {
  const plans = params.getAll("source_plan");
  const locations = params.getAll("source_cta");
  if (plans.length !== 1 || locations.length !== 1 || !ctaLocations.includes(locations[0])) return direct;

  const attribution = attributionForCta(locations[0] as AcademyCtaLocation);
  // Ignore missing, unknown, duplicate or contradictory values; never forward arbitrary URL data.
  return plans[0] === attribution.source_plan ? attribution : direct;
}
