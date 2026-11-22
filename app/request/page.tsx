import type { Metadata } from "next";
import Image from "next/image";
import { INTAKE_LABEL, intakeItemFor, isService } from "@/lib/consultation-services";
import CustomerRequestForm from "./CustomerRequestForm";
import s from "./request.module.css";

export const metadata: Metadata = {
  title: INTAKE_LABEL,
  description: "상담할 품목과 방문 주소를 남겨 주시면 리스토리 스튜디오 담당자가 확인 후 답변드려요.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/request" },
  openGraph: { title: `리스토리 스튜디오 ${INTAKE_LABEL}`, description: "상담 품목과 연락처를 남겨 주시면 담당자가 확인 후 답변드려요.", url: "/request" },
};

export default async function RequestPage({ searchParams }: { searchParams: Promise<{ service?: string | string[] }> }) {
  const { service } = await searchParams;
  const initialItem = isService(service) ? intakeItemFor(service) : "";
  return <main className={s.page}>
    <div className={s.shell}>
      <header className={s.brand}><Image src="/images/logo-cc.png" alt="" width={32} height={32} />리스토리 스튜디오</header>
      <CustomerRequestForm key={initialItem} initialItem={initialItem} />
    </div>
  </main>;
}
