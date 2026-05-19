"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import FadeIn from "@/app/components/FadeIn";

/* ═══════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════ */
const REVIEWS = [
  {
    name: "신**",
    area: "서울 강서구",
    text: "이태리 소파라 버리기 아까웠는데, 쿠션 복원하니 처음 샀을 때처럼 됐어요. 새로 사는 것보다 훨씬 저렴했습니다.",
    rating: 5,
  },
  {
    name: "고**",
    area: "인천시",
    text: "직장인이라 반차 내고 받았는데 당일에 바로 끝나서 너무 편했어요. 작업도 깔끔하게 잘 해주셨습니다.",
    rating: 5,
  },
  {
    name: "장**",
    area: "경기 분당",
    text: "한쪽만 꺼져서 앉기 불편했는데, 양쪽 다 보강해주셨어요. 탄성이 돌아와서 소파가 살아났습니다.",
    rating: 5,
  },
  {
    name: "오**",
    area: "서울 송파구",
    text: "500만원짜리 소파인데 50만원으로 새것처럼 됐어요. 진작 할걸 그랬습니다.",
    rating: 5,
  },
];

const FAQ = [
  {
    q: "소파 새로 사는 것보다 정말 저렴한가요?",
    a: "네. 새 소파 구매 대비 1/5~1/10 수준입니다. 고급 소파일수록 복원 대비 절약 효과가 큽니다.",
  },
  {
    q: "어떤 소파든 복원 가능한가요?",
    a: "대부분 가능합니다. 스프링, 밴드, 스펀지 구조의 소파라면 복원 가능하며, 사진 보내주시면 가능 여부를 바로 안내드립니다.",
  },
  {
    q: "복원 시간은 얼마나 걸리나요?",
    a: "소파 1개 기준 약 2~4시간 소요됩니다. 당일 시공 완료되며, 바로 사용 가능합니다.",
  },
  {
    q: "복원하면 얼마나 오래 가나요?",
    a: "HR계열 고탄성 스펀지와 이태리 엘라스틱 밴드를 사용하기 때문에 일반 소파보다 오래 유지됩니다.",
  },
  {
    q: "A/S는 어떻게 되나요?",
    a: "시공 완료 후 미흡한 부분은 100% 무상으로 재시공해드립니다.",
  },
];

const EXTRAS = [
  {
    icon: "🛋️",
    title: "가죽 교체",
    desc: "소파 가죽이 찢어졌다면 함께 교체 가능",
  },
  {
    icon: "🔩",
    title: "프레임 보강",
    desc: "삐걱거리는 목대·스프링 보강",
  },
  {
    icon: "🪑",
    title: "의자 천갈이",
    desc: "식탁 의자·사무용 의자 가죽 교체도 가능",
  },
];

const PHONE = "tel:010-9127-3024";
const KAKAO_URL = "https://pf.kakao.com/_aHYsX/chat";
const PHOTO_URL = "https://blog.naver.com/sofaresq/224129090889";

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */
export default function SofaCushionLanding() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowSticky(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main
      className="bg-white"
      style={{
        fontFamily:
          "'Wanted Sans Variable', 'Wanted Sans', -apple-system, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif",
      }}>
      {/* HERO IMAGE */}
      <section className="relative" style={{ background: "#1f66ff" }}>
        <Image
          src="/images/sofa/hero-sofa-2.jpg"
          alt="리스토리 소파 쿠션 복원 서비스"
          width={1080}
          height={1350}
          className="w-full h-auto"
          priority
        />
        <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-white via-white/30 to-transparent">
          <div className="w-full max-w-5xl px-6 pb-8 pt-24 md:px-10 md:pb-12 md:pt-32">
            <p className="text-[13px] text-[#1f66ff] font-bold md:text-[15px]">
              <Image
                src="/images/logo.png"
                alt="리스토리"
                width={30}
                height={30}
                className="inline-block mr-2"
              />
              리스토리 소파 쿠션 복원 서비스
            </p>
            <p className="mt-1 text-[28px] font-black leading-[1.3] text-[#1f66ff] md:text-[42px]">
              소파를 새로 살 필요 없습니다
            </p>
            <p className="text-[28px] font-medium leading-[1.3] text-neutral-900 md:text-[42px]">
              내부 구조만 복원하면 새것처럼
            </p>
          </div>
        </div>
      </section>

      {/* HERO CTA BUTTONS */}
      <section className="px-5 py-5 md:py-7" style={{ background: "#3672ff" }}>
        <div className="mx-auto flex max-w-3xl flex-col gap-2.5 sm:flex-row">
          <a
            href={PHONE}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 text-[15px] font-extrabold text-[#1a5cff] shadow-lg md:py-5 md:text-[17px]">
            📞 전화 문의
          </a>
          <a
            href={PHOTO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-white/40 px-6 py-4 text-[15px] font-extrabold text-white md:py-5 md:text-[17px]">
            📷 사진 접수
          </a>
        </div>
        <p
          className="mx-auto mt-3 max-w-3xl text-center text-[13px] font-semibold md:text-[14px]"
          style={{ color: "rgba(255,255,255,0.6)" }}>
          소파 사진만 보내주시면 복원 가능 여부 바로 안내드립니다
        </p>
      </section>

      {/* PHOTO REVIEWS */}
      <section
        className="px-5 py-14 md:py-20"
        style={{ background: "#f5f5f5" }}>
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <div className="text-center">
              <p className="text-[28px] leading-none text-amber-400 md:text-[32px]">
                ★★★★★
              </p>
              <h2 className="mt-4 text-[30px] font-medium text-neutral-600 leading-[1.4] md:text-[45px]">
                실제 고객님들이 인정한
                <br />
                <span className="text-[40px] font-black text-neutral-900 md:text-[55px]">
                  솔직후기
                </span>
              </h2>
              <p className="mt-3 text-[22px] font-medium text-neutral-600">
                평점 5점 만점에
              </p>
              <p
                className="mt-1 text-[40px] font-black md:text-[52px]"
                style={{ color: "#1a5cff" }}>
                4.9
                <span className="text-[20px] font-bold text-neutral-400 md:text-[24px]">
                  점
                </span>
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={150}>
            <div className="mt-10 grid grid-cols-2 gap-3 md:gap-5">
              <div className="overflow-hidden rounded-xl bg-white shadow-sm md:rounded-2xl">
                <div className="aspect-[4/3] overflow-hidden bg-neutral-200">
                  <Image
                    src="/images/sofa/review-1.jpg"
                    alt="소파 복원 후기 1"
                    width={400}
                    height={300}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-4 md:p-6">
                  <p className="text-[11px] text-neutral-400 md:text-[13px]">
                    서울 강서구 신**
                  </p>
                  <p className="mt-1.5 text-[14px] font-extrabold leading-[1.4] text-[#1a5cff] md:text-[16px]">
                    이태리 소파라 버리기 아까웠는데
                    <br />
                    처음 샀을 때처럼 됐어요
                  </p>
                  <p className="mt-2 text-[11px] leading-[1.6] text-neutral-600 md:text-[13px]">
                    이태리에서 수입한 고급 소파였는데, 쿠션이 너무 꺼져서
                    고민이었어요. 새로 사는 것보다 훨씬 저렴하게 복원돼서 너무
                    만족합니다.
                  </p>
                </div>
              </div>
              <div className="overflow-hidden rounded-xl bg-white shadow-sm md:rounded-2xl">
                <div className="aspect-[4/3] overflow-hidden bg-neutral-200">
                  <Image
                    src="/images/sofa/review-3.jpg"
                    alt="소파 복원 후기 2"
                    width={400}
                    height={300}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-4 md:p-6">
                  <p className="text-[11px] text-neutral-400 md:text-[13px]">
                    인천시 고**
                  </p>
                  <p className="mt-1.5 text-[14px] font-extrabold leading-[1.4] text-[#1a5cff] md:text-[16px]">
                    당일에 바로
                    <br />
                    작업 끝나서 너무 편했어요
                  </p>
                  <p className="mt-2 text-[11px] leading-[1.6] text-neutral-600 md:text-[13px]">
                    직장인이라 평일에 잠깐 반차 내고 작업 받았는데, 당일에 바로
                    끝나서 너무 편했어요. 작업도 깔끔하게 잘 해주셨습니다.
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* WHY */}
      <section
        className="px-5 py-14 md:py-20"
        style={{ background: "#fafafa" }}>
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <div className="text-center">
              <p className="text-[25px] font-medium text-neutral-600 md:text-[30px]">
                소파를 새로 사야 하나 고민이시죠?
              </p>
              <h2 className="mt-2 text-[30px] font-black leading-[1.35] md:text-[45px]">
                쿠션 복원만 하면 새것처럼!
              </h2>
            </div>
          </FadeIn>
          <FadeIn delay={100}>
            <div className="mx-auto my-8 flex flex-col items-center md:my-10">
              <div className="h-10 w-px bg-neutral-300" />
              <div className="mt-6 text-center">
                <p className="text-[30px] font-black md:text-[45px]">
                  새 소파 구매 비용의
                </p>
                <p
                  className="mt-1 inline-block rounded-lg px-4 py-1.5 text-[20px] font-black md:text-[26px]"
                  style={{ background: "#1f66ff", color: "#ffffff" }}>
                  1/10 수준으로 해결!
                </p>
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={200}>
            <div className="grid grid-cols-2 gap-3 md:gap-5">
              {[
                { img: "/images/sofa/before-after-1.jpg", label: "복원 전" },
                { img: "/images/sofa/before-after-2.jpg", label: "복원 후" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
                  <div className="aspect-[4/3] overflow-hidden bg-neutral-100">
                    <Image
                      src={item.img}
                      alt={item.label}
                      width={400}
                      height={300}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-4 text-center">
                    <p className="text-[16px] font-extrabold md:text-[18px]">
                      {item.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* TRUST */}
      <section
        className="px-5 py-14 md:py-20"
        style={{ background: "#f5f5f5" }}>
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <div className="text-center">
              <p className="text-[25px] font-medium text-neutral-600 md:text-[30px]">
                걱정 없이 맡기세요
              </p>
              <h2 className="mt-2 text-[30px] font-black leading-[1.35] md:text-[45px]">
                AS 걱정 없는 확실한 시공
              </h2>
            </div>
          </FadeIn>
          <FadeIn delay={200}>
            <div className="flex mt-10 justify-center gap-5 md:gap-10">
              {[
                { src: "/images/cert-2.png", alt: "생산물배상책임보험증서" },
                { src: "/images/cert-4.png", alt: "리스토리 A/S 보증서" },
              ].map((cert, i) => (
                <div
                  key={i}
                  className="flex-1 max-w-[280px] md:max-w-[310px] overflow-hidden rounded-xl border border-neutral-200 bg-white md:rounded-2xl">
                  <div className="flex aspect-[3/4] items-center justify-center bg-neutral-100 p-3 md:p-5">
                    <Image
                      src={cert.src}
                      alt={cert.alt}
                      width={300}
                      height={400}
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <p className="bg-neutral-100 pb-[18px] text-center text-[16px] font-bold text-neutral-600 md:text-[18px]">
                    {cert.alt}
                  </p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* SPECIALS */}
      <section
        className="px-5 pt-10 text-center text-white md:pt-16"
        style={{ background: "#1f66ff" }}>
        <FadeIn>
          <p className="text-[40px] leading-none md:text-[48px]">🧐</p>
          <p
            className="mt-4 text-[40px] font-thin md:text-[55px]"
            style={{ color: "rgb(255, 255, 255)" }}>
            왜 유명하냐고요?
          </p>
          <h2 className="mt-2 text-[40px] font-black md:text-[55px]">
            리스토리 소파 복원은 특별합니다!
          </h2>
        </FadeIn>
      </section>

      {/* Special 01 */}
      <section
        className="px-5 pt-14 md:py-20"
        style={{ background: "#1f66ff" }}>
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <div className="rounded-2xl bg-white p-6 shadow-sm md:p-10">
              <div className="text-center">
                <span className="inline-block rounded-full border border-neutral-300 px-4 py-1.5 text-[13px] font-bold text-neutral-600 md:text-[14px]">
                  Special 01
                </span>
                <h3 className="mt-4 text-[20px] font-black md:text-[26px]">
                  시공 후 문제 생기면{" "}
                  <span className="text-[#1a5cff]">책임</span>져 주나요?
                </h3>
              </div>
              <div className="mt-6 overflow-hidden rounded-xl md:mt-8">
                <Image
                  src="/images/special-1-2.png"
                  alt="본사 안심 보상제"
                  width={600}
                  height={400}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Special 02 */}
      <section
        className="px-5 pt-7 pb-14 md:pt-7 md:pb-20"
        style={{ background: "#1f66ff" }}>
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <div className="rounded-2xl bg-white p-6 shadow-sm md:p-10">
              <div className="text-center">
                <span className="inline-block rounded-full border border-neutral-300 px-4 py-1.5 text-[13px] font-bold text-neutral-600 md:text-[14px]">
                  Special 02
                </span>
                <h3 className="mt-4 text-[20px] font-black md:text-[26px]">
                  절차는 간편한가요?
                </h3>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3 md:mt-8 md:gap-5">
                <div className="overflow-hidden rounded-xl">
                  <Image
                    src="/images/special-02-1.png"
                    alt="사진만 찍어도 비대면 무료 견적 가능"
                    width={400}
                    height={300}
                    className="w-full h-auto"
                  />
                </div>
                <div className="overflow-hidden rounded-xl">
                  <Image
                    src="/images/special-02-2.png"
                    alt="365일 밤 10시까지 상담 가능"
                    width={400}
                    height={300}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 비교표 */}
      <section
        className="px-5 py-14 md:py-20"
        style={{ background: "#f7f9fd" }}>
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <div className="text-center">
              <p className="text-[25px] font-medium text-neutral-600 md:text-[30px]">
                소파에 진심인 사람들만 모인
              </p>
              <h2 className="mt-1 text-[30px] font-black md:text-[45px]">
                리스토리의 자부심
              </h2>
              <p
                className="mx-auto mt-3 inline-block rounded-lg px-5 py-1.5 text-[18px] font-black md:text-[22px]"
                style={{ background: "#1a5cff", color: "#fff" }}>
                안심인증시공
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={120}>
            <div className="mt-10 grid grid-cols-2 gap-0 overflow-hidden rounded-2xl border border-[#e0e8f5]">
              <div
                className="p-5 text-center md:p-7"
                style={{ background: "#1a1a1a" }}>
                <span className="inline-block rounded-full bg-white px-3 py-1 text-[11px] font-bold text-neutral-600 md:text-[13px]">
                  A사
                </span>
                <p className="mt-2 text-[18px] font-black text-white md:text-[22px]">
                  일반 소파 복원
                </p>
              </div>
              <div
                className="p-5 text-center md:p-7"
                style={{ background: "#1a5cff" }}>
                <span
                  className="inline-block rounded-full px-3 py-1 text-[11px] font-bold md:text-[13px]"
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    color: "#fff",
                  }}>
                  리스토리
                </span>
                <p className="mt-2 text-[18px] font-black text-white md:text-[22px]">
                  안심 소파 복원
                </p>
              </div>
              {[
                { a: "화학 스폰지 사용", b: "HR계열 고탄성 스펀지 사용" },
                { a: "일반 밴드 사용", b: "이태리 엘라스틱 밴드 사용" },
                { a: "맘대로 시공", b: "중간 중간 고객님과 조율" },
                { a: "A/S 없음, 연락 두절", b: "100% 안심 A/S" },
              ].map((row, i) => (
                <React.Fragment key={i}>
                  <div className="border-t border-neutral-200 bg-white px-4 py-5 text-center md:py-6">
                    <p className="whitespace-pre-line text-[14px] font-semibold leading-[1.5] text-neutral-600 md:text-[16px]">
                      {row.a}
                    </p>
                  </div>
                  <div
                    className="border-t px-4 py-5 text-center md:py-6"
                    style={{ borderColor: "#d6e4ff", background: "#eef4ff" }}>
                    <p className="whitespace-pre-line text-[14px] font-bold leading-[1.5] text-[#1a5cff] md:text-[16px]">
                      {row.b}
                    </p>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 본사 책임 AS */}
      <section
        className="flex justify-center"
        style={{ background: "#1a1b4b" }}>
        <Image
          src="/images/sofa/safe-sofa-1.png"
          alt="리스토리 본사 책임 AS"
          width={1080}
          height={1350}
          className="w-full max-w-3xl h-auto"
        />
      </section>

      {/* SELF CHECK */}
      <section className="px-5 py-14 md:py-20">
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <p className="mb-2 text-[13px] font-bold tracking-widest text-[#1a5cff] md:text-[14px]">
              SELF CHECK
            </p>
            <h2 className="text-[30px] font-black leading-[1.4] md:text-[45px]">
              이런 상태라면
              <br />
              <span className="text-[#e53e3e]">쿠션 복원 시기입니다</span>
            </h2>
          </FadeIn>
          <FadeIn delay={120}>
            <div className="mt-8 grid grid-cols-2 gap-3 md:gap-5">
              {[
                {
                  img: "/images/sofa/symptom-1.jpg",
                  title: "한쪽만 꺼짐",
                  desc: "자주 앉는 쪽만\n깊이 꺼진 상태",
                },
                {
                  img: "/images/sofa/symptom-2.jpg",
                  title: "전체적으로 주저앉음",
                  desc: "소파 전체가\n탄성을 잃은 상태",
                },
                {
                  img: "/images/sofa/symptom-3.jpg",
                  title: "앉으면 바닥 느낌",
                  desc: "스펀지가 삭아서\n프레임이 느껴지는 상태",
                },
                {
                  img: "/images/sofa/symptom-4.jpg",
                  title: "삐걱삐걱 소리",
                  desc: "앉을 때마다\n내부에서 소리나는 상태",
                },
              ].map((s, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
                  <div className="aspect-square overflow-hidden bg-neutral-100">
                    <Image
                      src={s.img}
                      alt={s.title}
                      width={400}
                      height={400}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-4 md:p-5">
                    <p className="text-[16px] font-extrabold md:text-[18px]">
                      {s.title}
                    </p>
                    <p className="mt-1.5 whitespace-pre-line text-[14px] leading-[1.6] text-neutral-500 md:text-[16px]">
                      {s.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* URGENT */}
      <section
        className="px-5 py-14 md:py-20"
        style={{
          background: "linear-gradient(150deg, #000f36 0%, #003ad6 100%)",
        }}>
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <div className="relative rounded-2xl border-2 border-orange-200 bg-white p-7 md:p-10">
              <div className="absolute -top-3.5 left-5 rounded-full bg-[#e53e3e] px-4 py-1 text-[20px] font-extrabold text-white md:text-[35px]">
                ⚡ 당일 시공
              </div>
              <h3 className="mt-1 text-[30px] font-black leading-[1.45] md:text-[45px]">
                소파 복원은
                <br />
                <span className="text-[#e53e3e]">당일 완료</span> 가능합니다
              </h3>
              <p className="mt-3 text-[14px] leading-[1.7] text-neutral-600 md:text-[16px]">
                사진 접수 → 방문 시공 → 당일 완료.
                <br />
                <strong
                  className="text-[18px] font-bold md:text-[22px]"
                  style={{ color: "#1f66ff" }}>
                  소파 사용 중단 없이 바로 완료
                </strong>
                됩니다.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* STATS BANNER */}
      <section
        className="px-5 py-12 text-center text-white md:py-20"
        style={{
          background: "linear-gradient(135deg, #1f66ff 0%, #003bbb 100%)",
        }}>
        <FadeIn>
          <Image
            src="/images/chair/chair-medal.png"
            alt="리스토리 메달"
            width={250}
            height={250}
            className="mx-auto mb-4 w-[250px] h-auto md:w-[300px] md:h-auto"
          />
          <p
            className="mb-2 text-[30px] font-black tracking-widest md:text-[45px]"
            style={{ color: "rgb(255, 255, 255)" }}>
            미친 자신감의 이유
          </p>
          <p className="text-[50px] font-black tracking-tight md:text-[80px]">
            <span style={{ color: "#ffffff" }}>500</span>건+
          </p>
          <p
            className="mt-1 text-[25px] font-semibold md:text-[35px]"
            style={{ color: "rgba(255, 255, 255, 0.79)" }}>
            매년 소파 쿠션 복원 실적
          </p>
          <div className="mx-auto mt-8 flex max-w-sm justify-between md:mt-10 md:max-w-md">
            {[
              { n: "99%", l: "시공 만족도" },
              { n: "100%", l: "무상 A/S" },
              { n: "4.9", l: "고객 평점" },
            ].map((s, i) => (
              <div
                key={i}
                className="border border-white/25 text-center bg-white/20 px-4 py-3 rounded-lg">
                <p className="text-[22px] font-black md:text-[28px]">{s.n}</p>
                <p
                  className="mt-1 text-[18px] font-semibold md:text-[22px]"
                  style={{ color: "rgba(255,255,255,0.79)" }}>
                  {s.l}
                </p>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* PROCESS */}
      <section
        className="px-5 py-14 md:py-20"
        style={{ background: "#f7f9fd" }}>
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <div className="text-center">
              <p className="text-[26px] font-medium text-neutral-600 md:text-[34px]">
                처음부터 끝까지 쉽고 빠르게
              </p>
              <h2 className="mt-2 text-[26px] font-black md:text-[34px]">
                리스토리 <span className="text-[#1a5cff]">시공절차</span>
              </h2>
            </div>
          </FadeIn>
          <FadeIn delay={120}>
            <div className="mt-12 grid grid-cols-3 gap-3 text-center md:gap-6">
              {[
                {
                  icon: "/images/icon_step1.png",
                  step: "01",
                  title: "사진 접수",
                  desc: "소파 사진\n보내기",
                },
                {
                  icon: "/images/icon_step3.png",
                  step: "02",
                  title: "방문 시공",
                  desc: "당일 시공\n맞춤 방문",
                },
                {
                  icon: "/images/icon_step4.png",
                  step: "03",
                  title: "완료",
                  desc: "당일 완료\n바로 사용",
                },
              ].map((p, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="flex h-[72px] w-[72px] items-center justify-center md:h-[100px] md:w-[100px]">
                    <Image
                      src={p.icon}
                      alt={p.title}
                      width={100}
                      height={100}
                      className="h-[72px] w-[72px] rounded-full border border-neutral-200 object-contain md:h-[100px] md:w-[100px]"
                    />
                  </div>
                  <p className="mt-5 text-[22px] font-black text-[#1a5cff] md:text-[26px]">
                    {p.step}
                  </p>
                  <p className="mt-2 text-[16px] font-extrabold md:text-[18px]">
                    {p.title}
                  </p>
                  <p className="mt-2 whitespace-pre-line text-[13px] leading-[1.6] text-neutral-600 md:text-[14px]">
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>
          </FadeIn>
          <FadeIn delay={200}>
            <div className="mt-10 flex justify-center md:mt-12">
              <a
                href={PHONE}
                className="flex items-center justify-center gap-2 rounded-full px-10 py-4 text-[17px] font-extrabold text-white md:px-12 md:py-5 md:text-[19px]"
                style={{ background: "#1a5cff" }}>
                📞 간편접수 010-9127-3024
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* EXTRAS */}
      <section
        className="px-5 py-14 md:py-20"
        style={{ background: "#f0f4ff" }}>
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <p className="mb-2 text-[13px] font-bold tracking-widest text-[#1a5cff] md:text-[14px]">
              PLUS SERVICE
            </p>
            <h2 className="text-[20px] font-black leading-[1.4] md:text-[26px]">
              방문 시 함께 가능합니다
            </h2>
            <p className="mb-7 mt-1 text-[13px] text-neutral-600 md:text-[15px]">
              추가 출장비 없이 한 번에 해결
            </p>
          </FadeIn>
          <div className="flex flex-col gap-2.5 md:grid md:grid-cols-3 md:gap-4">
            {EXTRAS.map((e, i) => (
              <FadeIn key={i} delay={i * 80}>
                <div className="flex items-center gap-4 rounded-2xl border border-[#dce5f5] bg-white p-5 md:flex-col md:items-start md:p-6">
                  <span className="flex-shrink-0 text-[26px] md:text-[32px]">
                    {e.icon}
                  </span>
                  <div>
                    <p className="text-[15px] font-extrabold md:text-[17px]">
                      {e.title}
                    </p>
                    <p className="mt-0.5 text-[12px] text-neutral-600 md:mt-1.5 md:text-[14px]">
                      {e.desc}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* YOUTUBE */}
      <section
        className="px-5 py-14 text-white md:py-20"
        style={{ background: "#1a1a1a" }}>
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <p
              className="mb-2 text-[13px] font-bold tracking-widest md:text-[14px]"
              style={{ color: "rgba(255,255,255,0.35)" }}>
              YOUTUBE
            </p>
            <h2 className="mb-6 text-[20px] font-black md:text-[26px]">
              실제 시공 영상을 확인하세요
            </h2>
          </FadeIn>
          <FadeIn delay={100}>
            <div className="flex aspect-video flex-col items-center justify-center rounded-2xl border border-neutral-700 bg-neutral-800">
              <div
                className="mb-4 flex h-14 w-14 items-center justify-center rounded-full md:h-20 md:w-20"
                style={{ background: "rgba(255,255,255,0.1)" }}>
                <span className="ml-1 text-[28px] md:text-[36px]">▶</span>
              </div>
              <p
                className="text-[14px] text-center font-semibold md:text-[16px]"
                style={{ color: "rgba(255,255,255,0.45)" }}>
                유튜브 영상 준비 중입니다...
                <br />곧 멋진 시공 영상으로 찾아뵐게요!
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* FAQ */}
      <section
        className="px-5 py-14 md:py-20"
        style={{ background: "#f7f9fd" }}>
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <p className="mb-2 text-[13px] font-bold tracking-widest text-[#1a5cff] md:text-[14px]">
              FAQ
            </p>
            <h2 className="mb-7 text-[22px] font-black md:text-[28px]">
              자주 묻는 질문
            </h2>
          </FadeIn>
          <div className="flex flex-col gap-2 md:gap-3">
            {FAQ.map((f, i) => (
              <FadeIn key={i} delay={i * 60}>
                <div className="overflow-hidden rounded-2xl border border-[#e0e8f5] bg-white">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex w-full items-center justify-between px-5 py-4 text-left md:px-7 md:py-5"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}>
                    <span className="pr-3 text-[14px] font-bold text-neutral-900 md:text-[16px]">
                      {f.q}
                    </span>
                    <span
                      className="flex-shrink-0 text-[16px] font-bold text-[#1a5cff] transition-transform duration-300 md:text-[18px]"
                      style={{
                        transform:
                          openFaq === i ? "rotate(180deg)" : "rotate(0deg)",
                      }}>
                      ▾
                    </span>
                  </button>
                  <div
                    className="overflow-hidden transition-all duration-300"
                    style={{ maxHeight: openFaq === i ? 200 : 0 }}>
                    <p className="border-t border-neutral-100 px-5 pb-5 pt-3 text-[13px] leading-[1.75] text-neutral-600 md:px-7 md:text-[15px]">
                      {f.a}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section
        className="px-5 py-16 text-center text-white md:py-24"
        style={{
          background: "linear-gradient(150deg, #1a5cff 0%, #003ad6 100%)",
        }}>
        <FadeIn>
          <h2 className="text-[24px] font-black leading-[1.4] md:text-[36px]">
            소파, 새로 사지 마세요
            <br />
            <span style={{ color: "#ffe066" }}>쿠션 복원만 하면</span> 새것처럼
          </h2>
          <p
            className="mt-3 text-[14px] leading-[1.7] md:text-[17px]"
            style={{ color: "rgba(255,255,255,0.7)" }}>
            소파 사진만 보내주시면
            <br />
            복원 가능 여부 바로 안내드립니다
          </p>
          <div className="mx-auto mt-8 flex max-w-xs flex-col gap-2.5 md:max-w-sm">
            <a
              href={PHONE}
              className="flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 text-[16px] font-extrabold text-[#1a5cff] md:py-5 md:text-[18px]">
              📞 전화 문의
            </a>
            <a
              href={KAKAO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl px-6 py-4 text-[16px] font-extrabold md:py-5 md:text-[18px]"
              style={{ background: "#FEE500", color: "#1a1a1a" }}>
              💬 카카오톡 상담
            </a>
            <a
              href={PHOTO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl border border-white/25 px-6 py-4 text-[15px] font-bold text-white md:py-5 md:text-[17px]"
              style={{ background: "rgba(255,255,255,0.12)" }}>
              📷 사진 접수
            </a>
          </div>
          <div className="mx-auto mt-7 flex flex-wrap justify-center gap-2">
            {["고탄성 스펀지", "이태리 밴드", "당일 시공", "무상 A/S"].map(
              (badge) => (
                <span
                  key={badge}
                  className="rounded-full px-3 py-1 text-[11px] font-semibold md:text-[13px]"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.5)",
                  }}>
                  {badge}
                </span>
              ),
            )}
          </div>
        </FadeIn>
      </section>

      {/* FLOATING CTA */}
      <div
        className="fixed right-4 z-50 flex flex-col gap-3 transition-all duration-300 md:right-6"
        style={{
          bottom: showSticky ? 80 : 32,
          opacity: showSticky ? 1 : 0,
          transform: showSticky ? "translateY(0)" : "translateY(20px)",
          pointerEvents: showSticky ? "auto" : "none",
        }}>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-[0px_-4px_16px_0px_rgba(0,0,0,0.25)] transition-all duration-200 hover:scale-105 active:scale-95 md:h-14 md:w-14"
          aria-label="맨 위로">
          <span className="text-[18px] text-neutral-500 md:text-[20px]">↑</span>
        </button>
        <a
          href={PHONE}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ffffff] shadow-[0px_-4px_16px_0px_rgba(0,0,0,0.35)] transition-all duration-200 hover:scale-105 active:scale-95 md:h-14 md:w-14"
          aria-label="전화 문의">
          <Image
            src="/images/phone-icon.png"
            alt="전화기 아이콘"
            width={48}
            height={48}
            className="h-[48px] w-[48px] object-contain md:h-[56px] md:w-[56px]"
          />
        </a>
        <a
          href={KAKAO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 w-12 items-center justify-center rounded-full shadow-[0px_-4px_16px_0px_rgba(0,0,0,0.25)] transition-all duration-200 hover:scale-105 active:scale-95 md:h-14 md:w-14"
          style={{ background: "#FEE500" }}
          aria-label="카카오톡 상담">
          <Image
            src="/images/kakao-logo.png"
            alt="카카오톡 로고"
            width={48}
            height={48}
            className="h-[48px] w-[48px] object-contain md:h-[56px] md:w-[56px]"
          />
        </a>
      </div>
      <a
        href={KAKAO_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-center gap-2 py-4 text-[17px] font-extrabold text-white shadow-[0px_-4px_16px_0px_rgba(0,0,0,0.25)] transition-all duration-300 md:bottom-6 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-fit md:rounded-full md:px-12 md:py-4"
        style={{
          background: "linear-gradient(135deg, #3672ff 0%, #1a5cff 100%)",
          opacity: showSticky ? 1 : 0,
          transform: showSticky ? "translateY(0)" : "translateY(100%)",
          pointerEvents: showSticky ? "auto" : "none",
        }}>
        😊 카톡으로 무료 견적 받기 &gt;
      </a>

      <div className="h-20" />
    </main>
  );
}
