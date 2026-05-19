"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { businessLines } from "@/lib/site-config";

/* ?Ä?Ä ?úÎπÑ???ÑÏù¥ÏΩ?Îß§Ìïë ?Ä?Ä */
const serviceIcons: Record<
  string,
  { icon: string; label: string; href: string }[]
> = {
  repair: [
    {
      icon: "/images/icon/icon-upper.png",
      label: "?ÅÎ???Ï≤òÏßê",
      href: "/repair/sangbujang",
    },
    {
      icon: "/images/icon/icon-down.png",
      label: "?òÎ???Î∞ëÌåê",
      href: "/repair/habujang",
    },
    {
      icon: "/images/icon/icon-door-drop.png",
      label: "Î¨∏Ïßù ?®Ïñ¥Ïß?,
      href: "/repair/door-fall",
    },
    {
      icon: "/images/icon/icon-door-gear.png",
      label: "Í≤ΩÏ≤© ÍµêÏ≤¥",
      href: "/repair/hinge",
    },
    {
      icon: "/images/icon/icon-rail.png",
      label: "?úÎûç ?àÏùº",
      href: "/repair/drawer-rail",
    },
    {
      icon: "/images/icon/icon-bed.png",
      label: "Ïπ®Î? ?ÑÎ†à??,
      href: "/repair/bed-frame",
    },
    {
      icon: "/images/icon/icon-table.png",
      label: "?ùÌÉÅ ?§Î¶¨",
      href: "/repair/table-leg",
    },
  ],
  kitchen: [
    {
      icon: "/images/icon/icon-door-reform.png",
      label: "?±ÌÅ¨?Ä Î¨∏Ïßù",
      href: "/kitchen/sink-door",
    },
    {
      icon: "/images/icon/icon-refre.png",
      label: "?âÏû•Í≥†Ïû•",
      href: "/kitchen/fridge-cabinet",
    },
    {
      icon: "/images/icon/icon-robo.png",
      label: "Î°úÏ≤≠??,
      href: "/kitchen/rocheong",
    },
  ],
  leather: [
    {
      icon: "/images/icon/icon-chair-reform.png",
      label: "?òÏûê Ï≤úÍ∞à??,
      href: "/leather/restaurant-chair",
    },
    {
      icon: "/images/icon/icon-chair-reform.png",
      label: "Í∏∞Ì? Í∞ÄÏ£?,
      href: "/leather/custom",
    },
  ],
  sofa: [
    {
      icon: "/images/icon/icon-sofa-sag.png",
      label: "?åÌåå Í∫ºÏßê Î≥µÏõê",
      href: "/sofa",
    },
  ],
};

const PHONE = "tel:010-9127-3024";
const KAKAO_URL = "https://pf.kakao.com/_aHYsX/chat";
const PHOTO_URL = "https://blog.naver.com/sofaresq/224129090889";

export default function DrawerMenu() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!mounted) return null;

  return (
    <>
      {/* ?ÑÎ≤ÑÍ±?Î≤ÑÌäº */}
      <button
        onClick={() => setOpen(true)}
        aria-label="?ÑÏ≤¥ ?úÎπÑ??Î©îÎâ¥ ?¥Í∏∞"
        className="flex flex-col justify-center items-center gap-[5px] w-9 h-9 rounded-lg transition-all hover:bg-neutral-100"
        style={{ border: "1px solid #e5e5e5" }}>
        <span
          className="block rounded-full"
          style={{ width: 16, height: 2, backgroundColor: "#1a1a1a" }}
        />
        <span
          className="block rounded-full"
          style={{ width: 12, height: 2, backgroundColor: "#999" }}
        />
        <span
          className="block rounded-full"
          style={{ width: 16, height: 2, backgroundColor: "#1a1a1a" }}
        />
      </button>

      {/* Î∞∞Í≤Ω ?§Î≤Ñ?àÏù¥ */}
      <div
        onClick={() => setOpen(false)}
        className="fixed inset-0 z-[60] transition-all duration-300"
        style={{
          backgroundColor: "rgba(0,0,0,0.35)",
          backdropFilter: open ? "blur(4px)" : "none",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
        }}
      />

      {/* ?úÎ°ú???®ÎÑê */}
      <div
        className="fixed top-0 right-0 z-[70] h-full flex flex-col"
        style={{
          width: "min(380px, 90vw)",
          backgroundColor: "#fff",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.35s cubic-bezier(0.32, 0, 0.15, 1)",
          boxShadow: open ? "-12px 0 40px rgba(0,0,0,0.1)" : "none",
        }}>
        {/* ?§Îçî */}
        <div
          className="flex items-center justify-between px-5 py-4 flex-shrink-0"
          style={{ borderBottom: "1px solid #eee" }}>
          <div className="flex items-center gap-2">
            <Link href="/" onClick={() => setOpen(false)}>
              <Image
                src="/images/logo.png"
                alt="Re'Story"
                width={100}
                height={30}
                className="h-7 w-auto object-contain"
              />
            </Link>
            <span className="text-[13px] font-bold text-[#1f66ff]">
              ?ÑÏ≤¥ ?úÎπÑ??            </span>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Î©îÎâ¥ ?´Í∏∞"
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-neutral-100"
            style={{ color: "#999", fontSize: 16 }}>
            ??          </button>
        </div>

        {/* ?§ÌÅ¨Î°??ÅÏó≠ */}
        <nav className="flex-1 overflow-y-auto">
          {/* ?Ä?Ä ?úÎπÑ??Ïπ¥ÌÖåÍ≥†Î¶¨ Í∑∏Î¶¨???Ä?Ä */}
          {businessLines.map((line) => (
            <div key={line.id} className="px-5 pt-6 pb-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[15px] font-black text-neutral-900">
                  {line.title}
                </h3>
                <Link
                  href={line.href}
                  onClick={() => setOpen(false)}
                  className="text-[12px] font-bold text-[#1f66ff] hover:underline">
                  ?ÑÏ≤¥Î≥¥Í∏∞ ??                </Link>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {(serviceIcons[line.id] || []).map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex flex-col items-center gap-1.5 rounded-xl py-3 px-1 transition-colors hover:bg-[#f0f4ff]">
                    {/* <span className="text-[24px]">{item.icon}</span> */}
                    <Image
                      src={item.icon}
                      alt={item.label}
                      width={52}
                      height={52}
                      className="h-52 w-52 object-contain"
                    />
                    <span className="text-[11px] font-semibold text-neutral-700 text-center leading-tight whitespace-nowrap">
                      {item.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}

          <div
            className="mx-5 my-3"
            style={{ height: 1, backgroundColor: "#eee" }}
          />

          {/* ?Ä?Ä Î∞îÎ°úÍ∞ÄÍ∏??Ä?Ä */}
          <div className="px-5 pt-3 pb-2">
            <p className="text-[11px] font-bold text-neutral-400 tracking-wider mb-3">
              Î∞îÎ°úÍ∞ÄÍ∏?            </p>
            <div className="flex flex-col gap-1.5">
              {[
                {
                  label: "?ì∑ ?¨ÏßÑ?ºÎ°ú Í≤¨Ï†Å Î∞õÍ∏∞",
                  href: PHOTO_URL,
                  external: true,
                  highlight: true,
                },
                {
                  label: "?îç ?ëÏóÖ ?¨Î? Î≥¥Í∏∞",
                  href: "/reviews",
                  external: false,
                  highlight: false,
                },
                {
                  label: "‚≠?Í≥†Í∞ù ?ÑÍ∏∞",
                  href: "/reviews",
                  external: false,
                  highlight: false,
                },
                {
                  label: "???êÏ£º Î¨ªÎäî ÏßàÎ¨∏",
                  href: "/faq",
                  external: false,
                  highlight: false,
                },
              ].map((item, i) =>
                item.external ? (
                  <a
                    key={i}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-xl px-4 py-3.5 transition-all"
                    style={{
                      backgroundColor: item.highlight ? "#1f66ff" : "#fafafa",
                      border: `1px solid ${item.highlight ? "transparent" : "#eee"}`,
                    }}>
                    <span
                      className="text-[14px] font-bold"
                      style={{ color: item.highlight ? "white" : "#1a1a1a" }}>
                      {item.label}
                    </span>
                    <span
                      style={{
                        color: item.highlight
                          ? "rgba(255,255,255,0.5)"
                          : "#ccc",
                        fontSize: 12,
                      }}>
                      ??                    </span>
                  </a>
                ) : (
                  <Link
                    key={i}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-xl px-4 py-3.5 transition-all hover:bg-neutral-50"
                    style={{
                      backgroundColor: "#fafafa",
                      border: "1px solid #eee",
                    }}>
                    <span className="text-[14px] font-bold text-neutral-900">
                      {item.label}
                    </span>
                    <span style={{ color: "#ccc", fontSize: 12 }}>??/span>
                  </Link>
                ),
              )}
            </div>
          </div>

          <div
            className="mx-5 my-3"
            style={{ height: 1, backgroundColor: "#eee" }}
          />

          {/* ?Ä?Ä ?ÅÎã¥?òÍ∏∞ ?Ä?Ä */}
          <div className="px-5 pt-3 pb-2">
            <p className="text-[11px] font-bold text-neutral-400 tracking-wider mb-3">
              ?ÅÎã¥?òÍ∏∞
            </p>
            <div className="flex flex-col gap-1.5">
              <a
                href={KAKAO_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3.5 transition-all hover:opacity-90"
                style={{ backgroundColor: "#FEE500" }}>
                <Image
                  src="/images/kakao-logo.png"
                  alt="Ïπ¥Ïπ¥?§ÌÜ°"
                  width={24}
                  height={24}
                  className="h-6 w-6 object-contain"
                />
                <span className="text-[14px] font-bold text-neutral-900">
                  ?§ÏãúÍ∞?Ïπ¥ÌÜ° ?ÅÎã¥
                </span>
                <span className="ml-auto text-[11px] font-bold text-neutral-500 bg-white/60 px-2 py-0.5 rounded-full">
                  Îπ†Î•∏ ?µÎ?
                </span>
              </a>
              <a
                href={PHONE}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3.5 transition-all hover:bg-neutral-50"
                style={{
                  backgroundColor: "#fafafa",
                  border: "1px solid #eee",
                }}>
                <Image
                  src="/images/phone-icon.png"
                  alt="?ÑÌôî"
                  width={24}
                  height={24}
                  className="h-6 w-6 object-contain"
                />
                <span className="text-[14px] font-bold text-neutral-900">
                  ?ÑÌôî ?ÅÎã¥
                </span>
                <span className="ml-auto text-[13px] font-semibold text-[#1f66ff]">
                  010-9127-3024
                </span>
              </a>
            </div>
          </div>

          <div
            className="mx-5 my-3"
            style={{ height: 1, backgroundColor: "#eee" }}
          />

          {/* ?Ä?Ä ?¥ÏòÅ ?ïÎ≥¥ ?Ä?Ä */}
          <div className="px-5 pt-3 pb-6">
            <p className="text-[11px] font-bold text-neutral-400 tracking-wider mb-3">
              ?¥ÏòÅ ?ïÎ≥¥
            </p>
            <div
              className="rounded-2xl p-4"
              style={{ backgroundColor: "#fafafa", border: "1px solid #eee" }}>
              <div className="flex flex-col gap-2.5">
                {[
                  { label: "?úÎπÑ??ÏßÄ??, value: "?úÏö∏ ¬∑ Í≤ΩÍ∏∞ ¬∑ ?∏Ï≤ú ??ÏßÄ?? },
                  { label: "?ÅÎã¥ ?úÍ∞Ñ", value: "Îß§Ïùº 09:00 ~ 22:00" },
                  { label: "Î∞©Î¨∏ Í∞Ä?•Ïùº", value: "??~ ?†Ïöî?? },
                  { label: "Í∏¥Í∏â ?úÍ≥µ", value: "?ÅÎ???Ï∂îÎùΩ ???∞ÏÑ† Î∞∞Ï†ï" },
                ].map((info, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-[12px] text-neutral-400">
                      {info.label}
                    </span>
                    <span className="text-[12px] font-semibold text-neutral-700">
                      {info.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </nav>

        {/* ?òÎã® Í≥†Ï†ï ??CTA */}
        <div
          className="flex-shrink-0 px-5 py-4"
          style={{ borderTop: "1px solid #eee", backgroundColor: "#fff" }}>
          <a
            href={PHOTO_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-2 w-full rounded-xl py-3.5 font-bold text-[15px] text-white transition-opacity hover:opacity-90"
            style={{
              background: "linear-gradient(135deg, #3672ff 0%, #1a5cff 100%)",
            }}>
            ?ì∑ ?¨ÏßÑ Î≥¥ÎÇ¥Í≥?Î¨¥Î£å Í≤¨Ï†Å Î∞õÍ∏∞
          </a>
          <p className="mt-2 text-center text-[11px] text-neutral-400">
            ?¨ÏßÑ ???•Ïù¥Î©??òÎ¶¨¬∑Î¶¨Ìèº Í∞Ä???¨Î? Î∞îÎ°ú ?àÎÇ¥
          </p>
        </div>
      </div>
    </>
  );
}
