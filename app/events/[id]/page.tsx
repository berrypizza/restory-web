import Image from "next/image";
import { buildTrackedContactPath } from "@/lib/attribution";
import PublicIntro from "@/app/components/PublicIntro";
import ui from "@/app/components/customer.module.css";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { withLandingSeo } from "@/lib/landing-seo";
import { events } from "@/lib/event-data";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return events.map((item) => ({ id: item.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const item = events.find((event) => event.id === id);
  if (!item) notFound();
  const period = item.startDate + " ~ " + item.endDate;
  const title = item.startDate.slice(0, 4) + " " + item.title;
  const description = period + " 진행 행사. " + item.summary;
  return withLandingSeo({
    title,
    description,
    alternates: { canonical: "/events/" + item.id },
    openGraph: {
      title,
      description,
      type: "article",
      images: [{ url: item.thumbnail, alt: item.title }],
    },
  });
}

export default async function EventDetailPage({ params }: Props) {
  const { id } = await params;
  const item = events.find((event) => event.id === id);
  if (!item) notFound();

  const isEnded = item.status === "종료";

  const formattedStart = new Date(item.startDate).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedEnd = new Date(item.endDate).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className={ui.publicPage} data-service-id="events" data-service-keyword={item.id}>
      <PublicIntro title={item.title} description={item.summary} parents={[{ label: "이벤트", href: "/events" }]} />
      <article data-service-section="article" className={ui.eventDetail}>
        <p className={ui.eventDate}>{isEnded ? "종료" : "진행 중"} · {formattedStart} – {formattedEnd}</p>
        <p data-service-section="scope">{item.description}</p>
        <Image src={item.detailImg} alt={item.title + " 행사 안내"} width={item.detailWidth} height={item.detailHeight} sizes="(max-width: 760px) 92vw, 720px" className={ui.eventPoster} />
        <div className={ui.actions} data-service-section="contact">
          {isEnded ? <Link href="/events?status=진행중" className={ui.mainButton}>진행 중인 이벤트 보기</Link>
            : <><Link href="/request" className={ui.mainButton}>혜택 적용 문의하기</Link><a href={buildTrackedContactPath("kakao", "event_detail")} className={ui.lightButton}>카카오톡 상담</a><a href={buildTrackedContactPath("phone", "event_detail")} className={ui.lightButton}>전화 문의</a></>}
          {item.blogUrl && <a href={item.blogUrl} className={ui.textLink}>행사 원문 보기</a>}
          <Link href="/events" className={ui.textLink}>이벤트 목록</Link>
        </div>
      </article>
    </main>
  );
}
