import { notFound } from "next/navigation";
import { ServiceLandingPage } from "@/app/components/CategoryPages";
import { getService } from "@/lib/site-config";

export async function generateMetadata() {
  const service = getService("repair" as any, "hinge");
  return {
    title: service ? `${service.title} | Re'Story` : "Re'Story",
    description: service?.description,
  };
}

export default function Page() {
  const service = getService("repair" as any, "hinge");
  if (!service) return notFound();
  return <ServiceLandingPage service={service} />;
}
