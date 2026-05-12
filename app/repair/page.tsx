import { notFound } from "next/navigation";
import { BusinessLinePage } from "@/app/components/CategoryPages";
import { getBusinessLine } from "@/lib/site-config";

export const metadata = { title: "가구 수리 | Re'Story" };

export default function Page() {
  const line = getBusinessLine("repair");
  if (!line) return notFound();
  return <BusinessLinePage line={line} />;
}
