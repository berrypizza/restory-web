import { notFound } from "next/navigation";
import { BusinessLinePage } from "@/app/components/CategoryPages";
import { getBusinessLine } from "@/lib/site-config";

export const metadata = { title: "repair | Re'Story" };

export default function Page() {
  const line = getBusinessLine("repair" as any);
  if (!line) return notFound();
  return <BusinessLinePage line={line} />;
}
