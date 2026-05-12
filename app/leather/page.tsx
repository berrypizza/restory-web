import { notFound } from "next/navigation";
import { BusinessLinePage } from "@/app/components/CategoryPages";
import { getBusinessLine } from "@/lib/site-config";

export const metadata = { title: "가죽 리폼 | Re'Story" };

export default function Page() {
  const line = getBusinessLine("leather");
  if (!line) return notFound();
  return <BusinessLinePage line={line} />;
}
