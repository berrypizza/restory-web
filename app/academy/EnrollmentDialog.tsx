import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./gisal.module.css";

export function EnrollButton({ className }: { children?: ReactNode; className?: string }) {
  return <Link href="/academy/consult" className={className}>1 : 1 무료 진단 시작하기 <span aria-hidden="true">↗</span></Link>;
}

export function EnrollmentProvider({ children }: { children: ReactNode }) {
  return <div className={styles.page}>{children}</div>;
}
