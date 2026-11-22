"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import AttributionTracker from "@/app/components/AttributionTracker";
import ServiceAnalytics from "@/app/components/ServiceAnalytics";
import Navbar from "@/app/components/Navbar";
import YoutubeProblemFinder from "@/app/components/YoutubeProblemFinder";

export default function LayoutBody({
  children,
  analytics,
}: {
  children: React.ReactNode;
  analytics: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const isIntake = pathname === "/request";
  const isAcademy = pathname === "/academy" || pathname?.startsWith("/academy/");

  return (
    <>
      {!isAdmin && !isIntake && (
        <>
          {analytics}
          <Suspense fallback={null}>
            <AttributionTracker />
            <ServiceAnalytics />
          </Suspense>
        </>
      )}
      {!isAdmin && !isAcademy && !isIntake && <Navbar />}
      {children}
      {!isAdmin && !isAcademy && !isIntake && <YoutubeProblemFinder />}
    </>
  );
}
