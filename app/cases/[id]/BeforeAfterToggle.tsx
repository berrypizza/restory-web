"use client";

import { useState } from "react";
import Image from "next/image";
import type { CaseItem } from "@/lib/case-data";

export default function BeforeAfterToggle({ item }: { item: CaseItem }) {
  const [view, setView] = useState<"before" | "after">("before");

  return (
    <>
      <div
        className="flex rounded-xl p-1 mb-4"
        style={{ backgroundColor: "#f3f4f6" }}>
        <button
          onClick={() => setView("before")}
          className="flex-1 rounded-lg py-2.5 text-sm font-bold transition-all"
          style={{
            backgroundColor: view === "before" ? "#ffffff" : "transparent",
            color: view === "before" ? "#ef4444" : "#94a3b8",
            boxShadow:
              view === "before" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
          }}>
          🔴 Before
        </button>

        <button
          onClick={() => setView("after")}
          className="flex-1 rounded-lg py-2.5 text-sm font-bold transition-all"
          style={{
            backgroundColor: view === "after" ? "#ffffff" : "transparent",
            color: view === "after" ? "#1f66ff" : "#94a3b8",
            boxShadow: view === "after" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
          }}>
          🔵 After
        </button>
      </div>

      <div
        className="relative overflow-hidden rounded-2xl mb-6"
        style={{ backgroundColor: "#f3f4f6", aspectRatio: "4/3" }}>
        <Image
          src={view === "before" ? item.beforeImg : item.afterImg}
          alt={`${item.title} ${view === "before" ? "수리 전" : "수리 후"}`}
          fill
          className="object-cover transition-opacity duration-300"
        />

        <div
          className="absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-black"
          style={{
            backgroundColor: view === "before" ? "#ef4444" : "#1f66ff",
            color: "white",
          }}>
          {view === "before" ? "BEFORE" : "AFTER"}
        </div>
      </div>
    </>
  );
}
