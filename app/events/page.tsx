"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { events, EVENT_FILTERS, type EventStatus } from "@/lib/event-data";

export default function EventsPage() {
  const [filter, setFilter] = useState<"전체" | EventStatus>("전체");

  const filtered =
    filter === "전체" ? events : events.filter((e) => e.status === filter);

  const activeCount = events.filter((e) => e.status === "진행중").length;
  const endedCount = events.filter((e) => e.status === "종료").length;

  return (
    <main className="min-h-screen bg-white pb-28">
      {/* 히어로 */}
      <section
        className="px-4 pt-10 pb-8"
        style={{ background: "linear-gradient(to bottom, #edf3ff, #ffffff)" }}>
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-bold mb-2" style={{ color: "#1f66ff" }}>
            EVENT
          </p>
          <h1
            className="text-2xl md:text-3xl font-black leading-tight mb-3"
            style={{ color: "#111827" }}>
            리스토리 이벤트
          </h1>
          <p className="text-base leading-relaxed" style={{ color: "#64748b" }}>
            진행 중인 할인·프로모션을 확인하고
            <br className="md:hidden" /> 더 합리적으로 이용하세요.
          </p>
        </div>
      </section>

      {/* 필터 탭 */}
      <div className="mx-auto max-w-3xl px-4">
        <div
          className="flex rounded-xl p-1 mb-6"
          style={{ backgroundColor: "#f3f4f6" }}>
          {(["전체", ...EVENT_FILTERS] as const).map((tab) => {
            const isActive = filter === tab;
            const count =
              tab === "전체"
                ? events.length
                : tab === "진행중"
                  ? activeCount
                  : endedCount;
            return (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className="flex-1 rounded-lg py-2.5 text-sm font-bold transition-all"
                style={{
                  backgroundColor: isActive ? "#ffffff" : "transparent",
                  color: isActive
                    ? tab === "종료"
                      ? "#94a3b8"
                      : "#1f66ff"
                    : "#94a3b8",
                  boxShadow: isActive ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                }}>
                {tab}{" "}
                <span className="ml-1 text-xs" style={{ opacity: 0.6 }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* 이벤트 목록 */}
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-base font-bold" style={{ color: "#94a3b8" }}>
              해당하는 이벤트가 없습니다
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((event) => {
              const isEnded = event.status === "종료";
              return (
                <Link
                  key={event.id}
                  href={`/events/${event.id}`}
                  className="block rounded-2xl overflow-hidden transition-all hover:shadow-lg"
                  style={{
                    border: "1px solid #e5e7eb",
                    opacity: isEnded ? 0.6 : 1,
                  }}>
                  {/* 썸네일 */}
                  <div
                    className="relative w-full"
                    style={{
                      aspectRatio: "16/9",
                      backgroundColor: "#f3f4f6",
                    }}>
                    <Image
                      src={event.thumbnail}
                      alt={event.title}
                      fill
                      className="object-cover"
                    />
                    {/* 상태 뱃지 */}
                    <div
                      className="absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-black"
                      style={{
                        backgroundColor: isEnded ? "#94a3b8" : "#1f66ff",
                        color: "white",
                      }}>
                      {event.status}
                    </div>
                    {/* 종료 오버레이 */}
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
                          종료된 이벤트
                        </span>
                      </div>
                    )}
                  </div>

                  {/* 텍스트 영역 */}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="text-xs font-bold"
                        style={{
                          color: isEnded ? "#94a3b8" : "#1f66ff",
                        }}>
                        {new Date(event.startDate).toLocaleDateString("ko-KR", {
                          month: "long",
                          day: "numeric",
                        })}{" "}
                        ~{" "}
                        {new Date(event.endDate).toLocaleDateString("ko-KR", {
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <h3
                      className="text-lg font-black mb-1"
                      style={{ color: "#111827" }}>
                      {event.title}
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "#64748b" }}>
                      {event.summary}
                    </p>

                    {/* 태그 */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {event.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs font-bold px-2.5 py-1 rounded-full"
                          style={{
                            backgroundColor: "#f3f4f6",
                            color: "#64748b",
                          }}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* 하단 CTA */}
      <div className="mx-auto max-w-3xl px-4 mt-10">
        <div
          className="rounded-2xl p-6 text-center"
          style={{
            background: "linear-gradient(135deg, #edf3ff 0%, #dbe8ff 100%)",
          }}>
          <p className="text-lg font-black mb-2" style={{ color: "#111827" }}>
            궁금한 점이 있으신가요?
          </p>
          <p className="text-sm mb-4" style={{ color: "#64748b" }}>
            이벤트 관련 문의는 카카오톡으로 편하게 상담하세요
          </p>
          <a
            href="https://pf.kakao.com/_aHYsX/chat"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-black transition hover:opacity-90"
            style={{ backgroundColor: "#FEE500", color: "#1a1a1a" }}>
            💬 카카오톡 문의하기
          </a>
        </div>
      </div>
    </main>
  );
}
