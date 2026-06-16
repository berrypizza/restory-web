import HeroSection from "@/app/components/Herosection";
import BusinessLineCards from "@/app/components/Businesslinecards";
import ReviewSection from "@/app/components/Reviewsection";
import PainPointCards from "@/app/components/Painpointcards";
import YoutubeSection from "./components/Youtubesection";
import EventBanner from "./components/EventBanner";
import BottomCTA from "./components/BottomCTA";
import FloatingCTA from "./components/landing/shared/FloatingCTA";
import type { Metadata } from "next";
import HiddenSEO from "./components/HiddenSEO";

export const metadata: Metadata = {
  title: "리스토리 Re'Story - 가구 출장 수리 리폼 전문",
  description:
    "싱크대 수리·리폼, 의자 가죽 교체, 소파 복원 전문. 사진 한 장으로 견적 바로 확인. 서울·경기·인천 출장.",
  alternates: {
    canonical: "https://www.restorystudio.co.kr",
  },
};

export default function MainPage() {
  return (
    <main className="bg-white">
      <HeroSection />
      <BusinessLineCards />
      <ReviewSection />
      <PainPointCards />
      <YoutubeSection />
      <EventBanner />
      <BottomCTA />
      <FloatingCTA />
      <HiddenSEO />
    </main>
  );
}
