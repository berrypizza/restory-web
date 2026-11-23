"use client";

import { useEffect, useRef, useState } from "react";
import s from "../components/visitAddress.module.css";

type Result = { userSelectedType: string; roadAddress: string; jibunAddress: string; buildingName: string };
type Postcode = new (options: { width: string; height: string; oncomplete: (data: Result) => void }) => { embed: (host: HTMLElement) => void };

let loadingSdk: Promise<Postcode> | undefined;

function loadPostcode(): Promise<Postcode> {
  const sdk = () => (window as Window & { kakao?: { Postcode?: Postcode } }).kakao?.Postcode;
  const existing = sdk();
  if (existing) return Promise.resolve(existing);
  if (!loadingSdk) {
    loadingSdk = new Promise<Postcode>((resolve, reject) => {
      const script = document.createElement("script");
      const fail = () => { script.remove(); reject(new Error("Postcode unavailable")); };
      script.async = true;
      script.src = "https://t1.kakaocdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
      script.onload = () => { const api = sdk(); if (api) resolve(api); else fail(); };
      script.onerror = fail;
      document.head.append(script);
    }).catch(error => { loadingSdk = undefined; throw error; });
  }
  return loadingSdk;
}

export default function PostcodeSearch({ onSelect, onUnavailable }: { onSelect: (base: string) => void; onUnavailable: () => void }) {
  const host = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const container = host.current;
    if (!container) return;
    let active = true;
    void loadPostcode().then(Postcode => {
      if (!active) return;
      new Postcode({
        width: "100%", height: "100%",
        oncomplete(data) {
          if (!active) return;
          const base = data.userSelectedType === "J" ? data.jibunAddress : data.roadAddress;
          if (!base) { onUnavailable(); return; }
          const name = data.buildingName;
          onSelect(name && !base.includes(name) ? base + " (" + name + ")" : base);
        },
      }).embed(container);
      setLoading(false);
    }).catch(() => { if (active) onUnavailable(); });
    return () => { active = false; container.replaceChildren(); };
  }, [onSelect, onUnavailable]);
  return <>
    {loading && <p className={s.hint} role="status">주소 검색을 여는 중이에요…</p>}
    <div ref={host} className={s.widget} aria-label="카카오 주소 검색" />
  </>;
}
