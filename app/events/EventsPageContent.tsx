import Image from "next/image";
import Link from "next/link";
import { events, EVENT_FILTERS, type EventStatus } from "@/lib/event-data";
import PublicIntro from "../components/PublicIntro";
import s from "../components/customer.module.css";

export default function EventsPageContent({ status }: { status: "전체" | EventStatus }) {
  const selected = status === "전체" ? events : events.filter(item => item.status === status);
  return <main data-service-id="events" className={s.publicPage}>
    <PublicIntro title="이벤트" description="신청할 수 있는 혜택과 적용 기간을 확인하세요." />
    <section data-service-section="events" className={s.section}><div className={s.wrap}>
      <nav data-service-anchor aria-label="이벤트 상태" className={s.chips}>{(["전체", ...EVENT_FILTERS] as const).map(tab =>
        <Link key={tab} scroll={false} href={tab === "전체" ? "/events" : "/events?" + new URLSearchParams({ status: tab })} aria-current={tab === status ? "true" : undefined}>
          {tab === "진행중" ? "진행 중" : tab} · {tab === "전체" ? events.length : events.filter(item => item.status === tab).length}
        </Link>
      )}</nav>
      <div className={s.eventGrid}>{selected.map(item => <Link className={s.articleCard} key={item.id} href={`/events/${item.id}`}>
        <div className={s.articlePhoto}><Image src={item.thumbnail} fill alt="" sizes="(max-width: 600px) 112px, 350px" /></div>
        <div className={s.articleCopy}><span>{item.status === "진행중" ? "진행 중" : item.status}</span><h2>{item.title}</h2>
          <p>{item.summary}</p><small>{item.startDate} – {item.endDate}</small></div>
      </Link>)}</div>
      {!selected.length && <p className={s.empty}>해당하는 이벤트가 아직 없어요. <Link href="/events">전체 이벤트 보기</Link></p>}
    </div></section>
    <div data-service-section="contact" className={s.wrap}><Link data-service-anchor className={s.textLink} href="/request">이벤트 적용 문의하기</Link></div>
  </main>;
}
