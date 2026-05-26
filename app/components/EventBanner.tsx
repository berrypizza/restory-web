"use client";

import Image from "next/image";
import Link from "next/link";
import { events } from "@/lib/event-data";

export default function EventBanner() {
  const activeEvents = events.filter((e) => e.status === "진행중");

  if (activeEvents.length === 0) return null;

  return (
    <section className="bg-white px-4 py-14 md:px-10 md:py-20">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div>
            <p
              className="text-xs font-bold tracking-widest mb-1"
              style={{ color: "#1f66ff" }}>
              EVENT
            </p>
            <h2 className="text-2xl font-black" style={{ color: "#111827" }}>
              진행 중인 이벤트
            </h2>
          </div>
          <Link
            href="/events"
            className="text-sm font-bold border-2 border-transparent rounded-xl px-3 py-2 bg-gradient-to-r from-[#1f66ff] to-[#4f8fff]"
            style={{ color: "#ffffff", textDecoration: "none" }}>
            전체 보기 ›
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          {activeEvents.map((event) => (
            <Link
              key={event.id}
              href={`/events/${event.id}`}
              className="flex gap-4 rounded-2xl p-3 transition hover:shadow-lg"
              style={{
                border: "1px solid #e5e7eb",
                textDecoration: "none",
                backgroundColor: "#ffffff",
              }}>
              <div
                className="flex-shrink-0 rounded-xl overflow-hidden relative"
                style={{ width: 100, height: 100, backgroundColor: "#f3f4f6" }}>
                <Image
                  src={event.thumbnail}
                  alt={event.title}
                  width={100}
                  height={100}
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute top-1.5 left-1.5 rounded-full px-2 py-0.5 text-[9px] font-black"
                  style={{ backgroundColor: "#1f66ff", color: "white" }}>
                  진행중
                </div>
              </div>
              <div className="flex-1 min-w-0 py-0.5">
                <h3
                  className="text-[15px] font-black truncate mb-1"
                  style={{ color: "#111827" }}>
                  {event.title}
                </h3>
                <p
                  className="text-xs mb-2 line-clamp-2"
                  style={{ color: "#64748b" }}>
                  {event.summary}
                </p>
                <div className="flex items-center gap-2">
                  <span
                    className="text-[11px] font-bold"
                    style={{ color: "#1f66ff" }}>
                    {new Date(event.startDate).toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                    {" ~ "}
                    {new Date(event.endDate).toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
