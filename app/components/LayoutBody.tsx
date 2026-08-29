"use client";

import { usePathname } from "next/navigation";
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
      {!isAdmin && <Navbar />}
      {children}
      {!isAdmin && <YoutubeProblemFinder />}
    </>
  );
}
