import type { Metadata } from "next";
import "./globals.css";
import LayoutBody from "@/app/components/LayoutBody";

export const metadata: Metadata = {
  title: "Re'Story - 가구 출장 수리 전문",
  description: "사진 한 장이면 수리 가능 여부 바로 안내드립니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="antialiased">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/wanteddev/wanted-sans@v1.0.1/packages/wanted-sans/fonts/webfonts/variable/split/WantedSansVariable.min.css"
        />
      </head>
      <body
        style={{
          backgroundColor: "#fff",
          fontFamily:
            "'Wanted Sans Variable', 'Wanted Sans', -apple-system, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif",
        }}>
        <LayoutBody>{children}</LayoutBody>
      </body>
    </html>
  );
}
