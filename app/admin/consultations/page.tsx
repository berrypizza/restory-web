import type { Metadata } from "next";
import ConsultationAdmin from "./ConsultationAdmin";

export const metadata: Metadata = { title: "상담 신청 관리 | 리스토리", robots: { index: false, follow: false } };
export default function Page() { return <ConsultationAdmin />; }
