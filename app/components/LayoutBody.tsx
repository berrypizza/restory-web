"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import AttributionTracker from "@/app/components/AttributionTracker";
import Navbar from "@/app/components/Navbar";
import YoutubeProblemFinder from "@/app/components/YoutubeProblemFinder";

export default function LayoutBody({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <>
      {!isAdmin && (
        <Suspense fallback={null}>
          <AttributionTracker />
        </Suspense>
      )}
      {!isAdmin && <Navbar />}
      {children}
      {!isAdmin && <YoutubeProblemFinder />}
    </>
  );
}
