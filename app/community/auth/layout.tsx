import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "로그인 확인",
  robots: { index: false, follow: false },
  alternates: { canonical: "/community/auth" },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
