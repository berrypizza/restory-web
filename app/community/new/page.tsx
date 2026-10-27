import { Suspense } from "react";
import CommunityEditor from "./CommunityEditor";

export const metadata = {
  title: "이야기 쓰기",
  robots: { index: false, follow: false },
  alternates: { canonical: "/community/new" },
};
export default function CommunityNewPage() {
  return (
    <Suspense fallback={<p>작성 화면을 준비하고 있어요.</p>}>
      <CommunityEditor />
    </Suspense>
  );
}
