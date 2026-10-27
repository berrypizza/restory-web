import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "커뮤니티 로그인",
  robots: { index: false, follow: false },
  alternates: { canonical: "/community/login" },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
