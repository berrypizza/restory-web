"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const KAKAO_URL = "http://pf.kakao.com/_hQExjX/chat";
const STORAGE_KEY = "restory-youtube-problem-finder-dismissed";

const choices = [
  {
    label: "상부장이 처지거나 벌어졌어요",
    desc: "벽에서 뜸, 내려앉음, 추락 위험",
    href: "/repair/sangbujang?utm_source=youtube&utm_medium=problem_finder&utm_campaign=choice_sangbujang",
    icon: CabinetIcon,
    color: "#1f66ff",
  },
  {
    label: "싱크대 문짝이 낡았어요",
    desc: "문짝 교체, 색상 변경, 주방 분위기 개선",
    href: "/kitchen/sink-door?utm_source=youtube&utm_medium=problem_finder&utm_campaign=choice_sink_door",
    icon: DoorIcon,
    color: "#00a884",
  },
  {
    label: "소파가 푹~ 꺼졌어요",
    desc: "쿠션 꺼짐, 좌방석 처짐, 오래 앉으면 불편함",
    href: "/sofa/소파-꺼짐?utm_source=youtube&utm_medium=problem_finder&utm_campaign=choice_sofa_sag",
    icon: SofaIcon,
    color: "#f59e0b",
  },
  {
    label: "의자·소파 가죽이 벗겨졌어요",
    desc: "식당 의자, 회의실 의자, 소파 가죽 교체",
    href: "/leather/restaurant-chair?utm_source=youtube&utm_medium=problem_finder&utm_campaign=choice_leather",
    icon: ChairIcon,
    color: "#7c3aed",
  },
];

export default function YoutubeProblemFinder() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const forced = searchParams.get("finder") === "1";
    const sourceValues = [
      searchParams.get("utm_source"),
      searchParams.get("source"),
      searchParams.get("from"),
      searchParams.get("ref"),
      searchParams.get("utm_campaign"),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const referrer =
      typeof document !== "undefined" ? document.referrer.toLowerCase() : "";
    const fromYoutube =
      sourceValues.includes("youtube") ||
      sourceValues.includes("youtu") ||
      referrer.includes("youtube.com") ||
      referrer.includes("youtu.be");

    const dismissed =
      typeof sessionStorage !== "undefined" &&
      sessionStorage.getItem(STORAGE_KEY) === "1";

    if (forced || (fromYoutube && !dismissed)) {
      const timer = window.setTimeout(() => setOpen(true), 450);
      return () => window.clearTimeout(timer);
    }
  }, []);

  const close = () => {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  };

  const dismissForSelection = () => {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-black/45 px-4 pb-4 pt-10 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="youtube-problem-finder-title"
      onClick={close}>
      <div
        className="w-full max-w-[460px] rounded-[20px] bg-white p-5 shadow-2xl sm:p-6"
        onClick={(event) => event.stopPropagation()}>
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="mb-1 text-[13px] font-bold text-[#1f66ff]">
              리스토리 빠른 선택
            </p>
            <h2
              id="youtube-problem-finder-title"
              className="text-[22px] font-black leading-tight text-neutral-950">
              나에게 맞는 서비스 찾기
            </h2>
            <p className="mt-2 text-[14px] leading-relaxed text-neutral-500">
              지금 불편한 증상에 가까운 항목을 선택해 주세요.
            </p>
          </div>
          <button
            type="button"
            aria-label="닫기"
            onClick={close}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700">
            <CloseIcon />
          </button>
        </div>

        <div className="space-y-2.5">
          {choices.map((choice) => {
            const Icon = choice.icon;
            return (
              <Link
                key={choice.href}
                href={choice.href}
                onClick={dismissForSelection}
                className="flex min-h-[76px] items-center gap-4 rounded-xl bg-[#f4f6fa] px-4 py-3 text-left transition hover:-translate-y-0.5 hover:bg-[#eef2f8] active:translate-y-0"
                style={{ textDecoration: "none" }}>
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white"
                  style={{ color: choice.color }}>
                  <Icon />
                </span>
                <span className="min-w-0">
                  <span className="block text-[15px] font-extrabold leading-snug text-neutral-950">
                    {choice.label}
                  </span>
                  <span className="mt-1 block text-[12px] font-medium leading-snug text-neutral-500">
                    {choice.desc}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>

        <a
          href={`${KAKAO_URL}?utm_source=youtube&utm_medium=problem_finder&utm_campaign=choice_unknown`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={dismissForSelection}
          className="mt-4 flex min-h-[52px] items-center justify-center rounded-xl bg-[#fee500] px-4 text-[15px] font-black text-[#241f1f]"
          style={{ textDecoration: "none" }}>
          잘 모르겠어요. 사진으로 먼저 확인할게요
        </a>
      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M6 6l12 12M18 6L6 18"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function CabinetIcon() {
  return (
    <svg width="25" height="25" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M5 4h14v16H5V4Zm7 0v16M8 12h1m6 0h1"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function DoorIcon() {
  return (
    <svg width="25" height="25" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M7 3h10v18H7V3Zm7 9h1.2"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function SofaIcon() {
  return (
    <svg width="25" height="25" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M6 12V9a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v3M5 12h14a2 2 0 0 1 2 2v4H3v-4a2 2 0 0 1 2-2Zm1 6v2m12-2v2"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function ChairIcon() {
  return (
    <svg width="25" height="25" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M7 4h10v7H7V4Zm-1 9h12v4H6v-4Zm2 4v3m8-3v3"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}
