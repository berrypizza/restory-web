"use client";

import { useState } from "react";

export default function Footer() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <footer style={{ backgroundColor: "#fafafa", borderTop: "1px solid #eee" }}>
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 mb-8">
          <div>
            <p className="text-lg font-bold mb-2" style={{ color: "#1a1a1a" }}>
              Re&apos;Story
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "#aaa" }}>
              안 되는 건 안 된다고 먼저 말합니다.
            </p>
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <a
              href="/privacy"
              className="hover:opacity-80 transition-opacity"
              style={{ color: "#aaa" }}>
              개인정보처리방침
            </a>
          </div>
        </div>

        <div style={{ borderTop: "1px solid #eee", marginBottom: 24 }}>
          <button
            onClick={() => setContactOpen((v) => !v)}
            className="flex items-center justify-between w-full py-4"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
            }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#ccc",
              }}>
              Contact Us
            </span>
            <span
              style={{
                color: "#ccc",
                fontSize: 12,
                transform: contactOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.3s ease",
              }}>
              ▾
            </span>
          </button>
          <div
            style={{
              maxHeight: contactOpen ? 160 : 0,
              overflow: "hidden",
              transition: "max-height 0.35s ease",
            }}>
            <div
              style={{
                borderTop: "1px solid #eee",
                paddingTop: 14,
                paddingBottom: 18,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}>
              <a
                href="tel:01000000000"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  textDecoration: "none",
                }}>
                <span style={{ fontSize: 12, color: "#ccc" }}>📞</span>
                <span style={{ fontSize: 13, color: "#888" }}>
                  010-0000-0000
                </span>
              </a>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 12, color: "#ccc" }}>🕐</span>
                <span style={{ fontSize: 13, color: "#888" }}>
                  매일 09:00 — 21:00
                </span>
              </div>
              <div
                style={{
                  marginTop: 6,
                  paddingTop: 10,
                  borderTop: "1px solid #eee",
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                }}>
                <p style={{ fontSize: 11, color: "#ccc", margin: 0 }}>
                  리스토리 · 대표자 TODO · 사업자등록번호 TODO
                </p>
                <p style={{ fontSize: 11, color: "#ccc", margin: 0 }}>
                  주소 TODO
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="h-px mb-6" style={{ backgroundColor: "#eee" }} />
        <p className="text-xs" style={{ color: "#ccc" }}>
          © {new Date().getFullYear()} Re&apos;Story. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
