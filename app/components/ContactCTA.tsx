import React from "react";
import FadeIn from "@/app/components/FadeIn";

const KAKAO_CHANNEL_URL = "https://pf.kakao.com/_aHYsX/chat";

const steps = [
  { num: "01", text: "ê°€êµ??¬ì§„ 1~3??ì°ê¸°" },
  { num: "02", text: "ì§€??+ ì¦ìƒ ??ì¤??¨ê¸°ê¸? },
  { num: "03", text: "ê°€???¬ë? Â· ë¹„ìš© ë²”ìœ„ ?ˆë‚´" },
];

function KakaoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3C6.477 3 2 6.477 2 10.8c0 2.7 1.62 5.1 4.077 6.569l-1.04 3.847a.3.3 0 0 0 .461.324l4.666-3.1A11.66 11.66 0 0 0 12 18.6c5.523 0 10-3.477 10-7.8S17.523 3 12 3z" />
    </svg>
  );
}

export default function ContactCTA() {
  return (
    <section className="px-6 py-24" style={{ backgroundColor: "#fafafa" }}>
      <div className="mx-auto max-w-3xl">
        <FadeIn delay={0}>
          <div className="text-center mb-12">
            <p className="text-sm font-medium tracking-widest uppercase mb-4" style={{ color: "#aaa", letterSpacing: "0.15em" }}>
              Contact
            </p>
            <h2 className="font-black leading-tight" style={{ fontSize: "clamp(1.8rem, 5vw, 2.8rem)", color: "#1a1a1a" }}>
              ?‘ì? ?´ìƒ???ê»´ì§??Œê?
              <br />
              ?œì¼ ?¸ê²Œ ê³ ì¹  ???ˆëŠ”
              <br />
              ?€?´ë°?…ë‹ˆ??
            </h2>
          </div>
        </FadeIn>

        <div className="grid gap-4 sm:grid-cols-3 mb-12">
          {steps.map((s, i) => (
            <FadeIn key={s.num} delay={i * 100}>
              <div className="rounded-2xl px-6 py-6 flex items-start gap-4"
                style={{ backgroundColor: "#ffffff", border: "1px solid #e5e5e5" }}>
                <span className="text-3xl font-black leading-none select-none flex-shrink-0 mt-0.5" style={{ color: "#e5e5e5" }}>
                  {s.num}
                </span>
                <p className="font-semibold leading-snug pt-1" style={{ fontSize: "clamp(0.95rem, 2vw, 1.1rem)", color: "#444" }}>
                  {s.text}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0}>
          <div className="flex flex-col gap-3 max-w-md mx-auto">
            <a
              href={KAKAO_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 rounded-xl py-4 font-bold text-center transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#FEE500", color: "#1a1a1a", fontSize: "1.05rem" }}>
              <KakaoIcon />
              ì¹´ì¹´?¤í†¡?¼ë¡œ ë°”ë¡œ ?ë‹´?˜ê¸°
            </a>
            <div className="grid grid-cols-2 gap-3">
              <a href="/request" className="rounded-xl px-5 py-3.5 font-bold text-center text-white transition-opacity hover:opacity-90" style={{ backgroundColor: "#1a1a1a", fontSize: "0.9rem" }}>
                ?“· ?¬ì§„ ?ë‹´
              </a>
              <a href="tel:01000000000" className="rounded-xl px-5 py-3.5 font-semibold text-center transition-opacity hover:opacity-80" style={{ border: "1px solid #e5e5e5", color: "#444", backgroundColor: "#fff", fontSize: "0.9rem" }}>
                ?“ ?„í™” ë¬¸ì˜
              </a>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={80}>
          <div className="flex items-center justify-center gap-6 mt-10">
            {["?˜ë¦¬ ë¶ˆê? ??ì¶œì¥ë¹??†ìŒ", "1??ë¬´ìƒ AS", "?¨ì? ë¹„ìš© ?†ìŒ"].map((b, i) => (
              <React.Fragment key={b}>
                <span className="text-xs font-medium" style={{ color: "#aaa" }}>{b}</span>
                {i < 2 && <span style={{ color: "#e5e5e5" }}>Â·</span>}
              </React.Fragment>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
