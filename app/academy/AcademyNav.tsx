"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./academy.module.css";

const pages = [
  { href: "/academy", label: "과정소개" },
  { href: "/academy/operator", label: "운영자 소개" },
];

export default function AcademyNav() {
  const pathname = usePathname();

  return (
    <div className={styles.navigation}>
      <div className={styles.navigationInner}>
        <Link href="/academy" className={styles.wordmark}>
          기술로 살아남기<span>by restory</span>
        </Link>
        <nav aria-label="기술로 살아남기" className={styles.tabs}>
          {pages.map((page) => (
            <Link
              key={page.href}
              href={page.href}
              aria-current={pathname === page.href ? "page" : undefined}
              className={pathname === page.href ? styles.activeTab : undefined}>
              {page.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
