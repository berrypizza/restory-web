import { notFound } from "next/navigation";
import { BusinessLinePage } from "@/app/components/CategoryPages";
import { getBusinessLine } from "@/lib/site-config";
import Sofacushionlanding from "@/app/components/landing/Sofacushionlanding";

export const metadata = { title: "소파 쿠션 복원 | Re'Story" };

export default function Page() {
  const line = getBusinessLine("sofa");
  if (!line) return notFound();
  return <Sofacushionlanding />;
}
