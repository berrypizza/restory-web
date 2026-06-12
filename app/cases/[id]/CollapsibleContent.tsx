"use client";

import { useRef, useState, useEffect } from "react";

interface Props {
  content: string;
  collapsedHeight?: number;
}

export default function CollapsibleContent({
  content,
  collapsedHeight = 200,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const [needsCollapse, setNeedsCollapse] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      setNeedsCollapse(ref.current.scrollHeight > collapsedHeight + 24);
    }
  }, [content, collapsedHeight]);

  return (
    <div>
      {/* 본문 래퍼 */}
      <div className="relative">
        <div
          ref={ref}
          className="leading-8 whitespace-pre-line overflow-hidden"
          style={{
            color: "#475569",
            maxHeight: expanded || !needsCollapse ? "none" : collapsedHeight,
            // 접혔을 때 하단 블러
            WebkitMaskImage:
              !expanded && needsCollapse
                ? "linear-gradient(to bottom, black 40%, transparent 100%)"
                : "none",
            maskImage:
              !expanded && needsCollapse
                ? "linear-gradient(to bottom, black 40%, transparent 100%)"
                : "none",
          }}>
          {content}
        </div>
      </div>

      {/* 버튼 */}
      {needsCollapse && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-4 w-full flex items-center justify-center gap-1.5 rounded-xl py-3 text-[16px] font-bold transition-colors"
          style={{
            background: "rgba(31,102,255,0.06)",
            color: "#1f66ff",
            border: "1.5px solid rgba(31,102,255,0.15)",
            cursor: "pointer",
          }}>
          {expanded ? (
            <>
              접기
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M18 15l-6-6-6 6" />
              </svg>
            </>
          ) : (
            <>
              작업 내용 더 보기
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </>
          )}
        </button>
      )}
    </div>
  );
}
