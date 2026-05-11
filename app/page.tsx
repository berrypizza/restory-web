import HookIntro from "@/app/components/HookIntro";
import Intro from "@/app/components/Intro";
import CompareTable from "@/app/components/CompareTable";
import WhyRestory from "@/app/components/WhyRestory";
import EstimateCalculator from "@/app/components/EstimateCalculator";
import ContactCTA from "@/app/components/ContactCTA";
import FloatingCTA from "@/app/components/FloatingCTA";

export const metadata = {
  title: "리스토리 가구수리 - 출장 수리 전문 | 리스토리",
  description:
    "가구 사진 보내주시면 수리 가능 여부와 비용 범위, 1분 안에 바로 안내드립니다.",
  openGraph: {
    title: "가구 수리, 지금 안 고치면 교체까지 갑니다 | 리스토리",
    description: "사진 보내주시면 수리 가능 여부 바로 안내드립니다.",
  },
};

export default function MainPage() {
  return (
    <>
      <main className="min-h-screen" style={{ backgroundColor: "#1e1e1e" }}>
        <HookIntro />
        <Intro />
        <CompareTable />
        <WhyRestory />
        <EstimateCalculator />
        <ContactCTA />
      </main>
      <FloatingCTA />
    </>
  );
}
