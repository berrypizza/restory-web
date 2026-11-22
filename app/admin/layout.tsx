// app/admin/layout.tsx
// 어드민 전용 레이아웃 - 어드민 manifest 참조

import { Metadata, Viewport } from "next";
import s from "./workspace.module.css";

export const metadata: Metadata = {
  title: "리스토리 관리자",
  description: "리스토리 기사 전용 관리 앱",
  robots: { index: false, follow: false },
  // 루트 layout의 manifest.json을 덮어씀
  manifest: "/manifest-admin.json",
  icons: { apple: "/images/logo-cc-admin.png" },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "리스토리 Admin",
  },
};

export const viewport: Viewport = {
  themeColor: "#1f66ff",
  viewportFit: "cover",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={s.deviceFrame}>{children}</div>;
}
