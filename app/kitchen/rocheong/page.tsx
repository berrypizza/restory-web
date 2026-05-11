import { notFound } from "next/navigation";
import { ServiceLandingPage } from "@/app/components/CategoryPages";
import { getService } from "@/lib/site-config";

export async function generateMetadata() {
  const service = getService("kitchen" as any, "rocheong");
  return {
    title: service ? `${service.title} | Re'Story` : "Re'Story",
    description: service?.description,
  };
}

export default function Page() {
  const service = getService("kitchen" as any, "rocheong");
  if (!service) return notFound();
  return <ServiceLandingPage service={service} />;
}
