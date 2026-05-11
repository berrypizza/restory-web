import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/app/components/Navbar";

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
      <body style={{ backgroundColor: "#fff" }}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
