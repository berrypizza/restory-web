import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "커뮤니티 관리",
  robots: { index: false, follow: false },
  alternates: { canonical: "/community/manage" },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
