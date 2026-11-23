"use client";

import Script from "next/script";
import { useRef, useState } from "react";
import s from "../components/visitAddress.module.css";

type Result = { userSelectedType: string; roadAddress: string; jibunAddress: string; buildingName: string };
type Postcode = new (options: { width: string; height: string; oncomplete: (data: Result) => void }) => { embed: (host: HTMLElement) => void };

export default function PostcodeSearch({ onSelect, onUnavailable }: { onSelect: (base: string) => void; onUnavailable: () => void }) {
  const host = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  function open() {
    if (!host.current) return;
    const sdk = (window as Window & { kakao?: { Postcode?: Postcode } }).kakao?.Postcode;
    if (!sdk) { onUnavailable(); return; }
    try {
      new sdk({
        width: "100%", height: "100%",
        oncomplete(data) {
          if (!host.current) return;
          const base = data.userSelectedType === "J" ? data.jibunAddress : data.roadAddress;
          if (!base) { onUnavailable(); return; }
          const name = data.buildingName;
          onSelect(name && !base.includes(name) ? base + " (" + name + ")" : base);
        },
      }).embed(host.current);
      setLoading(false);
    } catch { onUnavailable(); }
  }
  return <>
    {loading && <p className={s.hint} role="status">주소 검색을 여는 중이에요…</p>}
    <div ref={host} className={s.widget} aria-label="카카오 주소 검색" />
    <Script src="https://t1.kakaocdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js" onReady={open} onError={onUnavailable} />
  </>;
}
