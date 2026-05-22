"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { events } from "@/lib/event-data";

export default function EventDetailPage() {
  const { id } = useParams();
  const item = events.find((e) => e.id === id);

  if (!item) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-lg font-bold" style={{ color: "#111827" }}>
            이벤트를 찾을 수 없어요
          </p>
          <Link
            href="/events"
            className="mt-4 inline-block text-sm font-bold"
            style={{ color: "#1f66ff" }}>
            ← 목록으로 돌아가기
          </Link>
        </div>
      </main>
    );
  }

  const isEnded = item.status === "종료";

  const formattedStart = new Date(item.startDate).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedEnd = new Date(item.endDate).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="min-h-screen bg-white pb-28">
      {/* 상단 네비 */}
      <div
        className="sticky top-0 z-30 bg-white px-4 py-3 flex items-center gap-3"
        style={{ borderBottom: "1px solid #f3f4f6" }}>
        <Link
          href="/events"
          className="text-lg"
          style={{ color: "#64748b", textDecoration: "none" }}>
          ←
        </Link>
        <h1
          className="text-base font-bold truncate"
          style={{ color: "#111827" }}>
          {item.title}
        </h1>
      </div>

      <div className="mx-auto max-w-2xl px-4 pt-5">
        {/* 상태 뱃지 + 기간 */}
        <div className="flex items-center gap-2 mb-4">
          <span
            className="text-xs font-black px-3 py-1 rounded-full"
            style={{
              backgroundColor: isEnded ? "#f3f4f6" : "#1f66ff15",
              color: isEnded ? "#94a3b8" : "#1f66ff",
            }}>
            {item.status}
          </span>
          <span className="text-xs" style={{ color: "#94a3b8" }}>
            {formattedStart} ~ {formattedEnd}
          </span>
        </div>

        {/* 제목 */}
        <h2 className="text-2xl font-black mb-2" style={{ color: "#111827" }}>
          {item.title}
        </h2>
        <p
          className="text-base leading-relaxed mb-6"
          style={{ color: "#64748b" }}>
          {item.summary}
        </p>

        {/* 종료 안내 배너 */}
        {isEnded && (
          <div
            className="flex items-center gap-3 rounded-2xl px-5 py-4 mb-6"
            style={{
              backgroundColor: "#f8f9fa",
              border: "1px solid #e5e7eb",
            }}>
            <span className="text-2xl">⏰</span>
            <div>
              <p className="text-sm font-black" style={{ color: "#6b7280" }}>
                종료된 이벤트입니다
              </p>
              <p className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>
                진행 중인 다른 이벤트를 확인해 보세요
              </p>
            </div>
          </div>
        )}

        {/* 상세 이미지 */}
        <div
          className="relative overflow-hidden rounded-2xl mb-6"
          style={{
            backgroundColor: "#f3f4f6",
            aspectRatio: "4/3",
          }}>
          <Image
            src={item.detailImg}
            alt={item.title}
            fill
            className="object-cover"
          />
          {isEnded && (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ backgroundColor: "rgba(0,0,0,0.3)" }}>
              <span
                className="text-lg font-black px-5 py-2 rounded-full"
                style={{
                  backgroundColor: "rgba(0,0,0,0.6)",
                  color: "white",
                }}>
                종료
              </span>
            </div>
          )}
        </div>

        {/* 상세 설명 */}
        <div
          className="rounded-2xl p-5 mb-6"
          style={{ backgroundColor: "#fafafa", border: "1px solid #f3f4f6" }}>
          <p className="text-sm font-black mb-3" style={{ color: "#111827" }}>
            이벤트 상세
          </p>
          <p className="text-sm leading-[1.8]" style={{ color: "#4b5563" }}>
            {item.description}
          </p>
        </div>

        {/* 이벤트 정보 */}
        <div
          className="rounded-2xl p-5 mb-6"
          style={{ backgroundColor: "#fafafa", border: "1px solid #f3f4f6" }}>
          <div className="flex flex-col gap-3">
            {[
              {
                label: "이벤트 기간",
                value: `${formattedStart} ~ ${formattedEnd}`,
              },
              { label: "이벤트 상태", value: item.status },
              { label: "적용 지역", value: "서울 · 경기 · 인천 전 지역" },
            ].map((info, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-xs" style={{ color: "#94a3b8" }}>
                  {info.label}
                </span>
                <span
                  className="text-xs font-bold"
                  style={{
                    color:
                      info.label === "이벤트 상태" && !isEnded
                        ? "#1f66ff"
                        : "#4b5563",
                  }}>
                  {info.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 태그 */}
        <div className="flex flex-wrap gap-2 mb-8">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-bold px-3 py-1.5 rounded-full"
              style={{ backgroundColor: "#f3f4f6", color: "#64748b" }}>
              #{tag}
            </span>
          ))}
        </div>

        {/* 구분선 */}
        <div className="h-px mb-6" style={{ backgroundColor: "#f3f4f6" }} />

        {/* 블로그 링크 (있을 경우) */}
        {item.blogUrl && (
          <a
            href={item.blogUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-2xl px-5 py-4 mb-6 transition hover:shadow-md"
            style={{
              backgroundColor: "#f8fbff",
              border: "1px solid #dbe8ff",
              textDecoration: "none",
            }}>
            <div>
              <p
                className="text-sm font-black mb-0.5"
                style={{ color: "#1f66ff" }}>
                블로그에서 자세히 보기
              </p>
              <p className="text-xs" style={{ color: "#94a3b8" }}>
                이벤트 상세 내용을 확인하세요
              </p>
            </div>
            <span className="text-lg" style={{ color: "#1f66ff" }}>
              ›
            </span>
          </a>
        )}

        {/* CTA */}
        {!isEnded ? (
          <div className="flex flex-col gap-2.5">
            <a
              href="https://pf.kakao.com/_aHYsX/chat"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-black transition hover:opacity-90"
              style={{ backgroundColor: "#FEE500", color: "#1a1a1a" }}>
              💬 이벤트 참여 · 카카오톡 상담
            </a>
            <a
              href="tel:010-9127-3024"
              className="flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-black text-white"
              style={{
                background: "linear-gradient(to right, #1f66ff, #4f8fff)",
              }}>
              📞 전화 문의
            </a>
          </div>
        ) : (
          <Link
            href="/events"
            className="flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-black transition hover:opacity-90"
            style={{
              backgroundColor: "#f3f4f6",
              color: "#64748b",
              textDecoration: "none",
            }}>
            ← 진행 중인 이벤트 보러 가기
          </Link>
        )}
      </div>
    </main>
  );
}
