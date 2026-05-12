import { notFound } from "next/navigation";
import { BusinessLinePage } from "@/app/components/CategoryPages";
import { getBusinessLine } from "@/lib/site-config";

export const metadata = { title: "주방 리폼 | Re'Story" };

export default function Page() {
  const line = getBusinessLine("kitchen");
  if (!line) return notFound();
  return <BusinessLinePage line={line} />;
}
