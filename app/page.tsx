import HeroSection from "@/app/components/Herosection";
import IconMenu from "@/app/components/Iconmenu";
import PainPointCards from "@/app/components/Painpointcards";
import BusinessLineCards from "@/app/components/Businesslinecards";
import YoutubeSection from "./components/Youtubesection";
import ReviewSection from "./components/Reviewsection";

export const metadata = {
  title: "Re'Story - 싱크대수리 · 싱크대리폼 · 가죽교체",
  description: "사진 한 장으로 수리와 리폼 가능 여부를 먼저 안내드립니다.",
};

export default function MainPage() {
  return (
    <main className="bg-white">
      <HeroSection />
      <IconMenu />
      <PainPointCards />
      <BusinessLineCards />
      <YoutubeSection />
      <ReviewSection />
    </main>
  );
}
