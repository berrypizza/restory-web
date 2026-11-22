"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "../lib/utils";
import AdminIcon from "./AdminIcon";
import s from "../tabs/home.module.css";

export default function IntakeHomeCard() {
  const [count, setCount] = useState<number | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    let version = 0;
    async function refresh() {
      if (document.visibilityState !== "visible") return;
      const current = ++version;
      const { count, error } = await getSupabase().from("customer_intakes")
        .select("id", { count: "exact", head: true }).is("scheduled_at", null).abortSignal(controller.signal);
      if (!controller.signal.aborted && current === version) setCount(error ? null : count);
    }
    void refresh();
    const timer = window.setInterval(refresh, 60_000);
    document.addEventListener("visibilitychange", refresh);
    return () => { controller.abort(); window.clearInterval(timer); document.removeEventListener("visibilitychange", refresh); };
  }, []);
  return <a className={s.intakeCard} href="#intake">
    <span className={s.intakeIcon}><AdminIcon name="inbox" size={25} /></span>
    <span className={s.intakeText}><strong>고객 접수함</strong>
      <span>{count === null ? "고객이 보낸 상담 내용과 사진 확인" : count ? <>확인 대기 <b>{count.toLocaleString("ko-KR")}건</b></> : "확인을 기다리는 접수가 없어요"}</span>
    </span>
    <span className={s.intakeGo}><span>접수 확인</span><AdminIcon name="arrow" size={17} /></span>
  </a>;
}
