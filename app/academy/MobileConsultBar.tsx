"use client";

import { useEffect, useState } from "react";
import { EnrollButton } from "./EnrollmentDialog";
import styles from "./gisal.module.css";

export default function MobileConsultBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("academy-hero");
    if (!hero || typeof IntersectionObserver === "undefined") return;

    const inlineButtons = document.querySelectorAll('[data-academy-cta]:not([data-academy-cta="mobile"])');
    const visibleButtons = new Set<Element>();
    let heroPassed = false;
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.target === hero) heroPassed = entry.boundingClientRect.bottom <= 0;
        else if (entry.isIntersecting) visibleButtons.add(entry.target);
        else visibleButtons.delete(entry.target);
      }
      // The inline CTA stays unobstructed, including at the bottom of the viewport.
      setVisible(heroPassed && visibleButtons.size === 0);
    });

    observer.observe(hero);
    inlineButtons.forEach(button => observer.observe(button));
    return () => observer.disconnect();
  }, []);

  return <div className={styles["mobile-apply"]} hidden={!visible}>
    <EnrollButton location="mobile" label="나에게 맞는 과정 찾기" className={`${styles.button} ${styles["button-green"]}`} />
    <p className={styles["mobile-consult-note"]}>무료 1:1 창업 진단 · 과정 선택 전에도 신청할 수 있습니다.</p>
  </div>;
}
