import type { Metadata } from "next";
import IntakeDesk from "./IntakeDesk";

export const metadata: Metadata = { title: "고객 접수함", robots: { index: false, follow: false } };

export default function IntakePage() {
  return <IntakeDesk />;
}
