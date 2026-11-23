"use client";

import { useCallback, useEffect, useId, useRef, useState, type FormEvent } from "react";
import AdminIcon from "../components/AdminIcon";
import ArrivalTime from "../components/ArrivalTime";
import { CustomerPhotoStrip } from "../components/CustomerPhotos";
import { TECHS } from "../lib/constants";
import { formatFullDate, getSupabase, today } from "../lib/utils";
import s from "./intake.module.css";

type Intake = {
  id: string; received_at: string; customer_name: string; phone: string; address: string; item: string; notes: string | null; photo_count: number;
};
type Scheduled = { job_id: string; visit_date: string };
const pageSize = 25;
const receivedDate = new Intl.DateTimeFormat("ko-KR", { month: "long", day: "numeric", hour: "numeric", minute: "2-digit", timeZone: "Asia/Seoul" });
const maxJobPrice = 2_147_483_647; // jobs.price is a PostgreSQL integer.
const quoteRequired = "일반 방문은 견적 금액을 입력해 주세요.";
const visitKinds = [
  { value: "visit", label: "일반 방문" },
  { value: "measure", label: "실측" },
] as const;

function readQuote(text: string, measurement: boolean) {
  const trimmed = text.trim();
  if (!trimmed) return { amount: null, error: measurement ? "" : quoteRequired };

  const digits = trimmed.replace(/\s*원$/, "");
  if (!/^(?:\d+|\d{1,3}(?:,\d{3})+)$/.test(digits)) {
    return { amount: null, error: "견적은 원 단위 숫자로 입력해 주세요." };
  }
  const amount = Number(digits.replaceAll(",", ""));
  if (amount > maxJobPrice) return { amount: null, error: "2,147,483,647원 이하로 입력해 주세요." };
  if (!measurement && amount === 0) return { amount: null, error: "일반 방문 견적은 1원 이상이어야 해요." };
  return { amount, error: "" };
}

function CopyLink() {
  const [status, setStatus] = useState<"idle" | "copied" | "manual">("idle");
  const input = useRef<HTMLInputElement>(null);
  async function copy() {
    const url = new URL("/request", window.location.origin).href;
    try {
      await navigator.clipboard.writeText(url);
      setStatus("copied");
    } catch {
      setStatus("manual");
      window.requestAnimationFrame(() => { input.current?.focus(); input.current?.select(); });
    }
  }
  return <div className={s.share}>
    <button type="button" className={s.secondary} onClick={copy}>고객용 링크 복사</button>
    <a href="/request" className={s.textLink} target="_blank" rel="noopener noreferrer">접수 양식 보기 ↗</a>
    <span role="status">{status === "copied" ? "링크를 복사했어요" : ""}</span>
    {status === "manual" && <label>복사할 고객용 링크<input ref={input} readOnly value={new URL("/request", window.location.origin).href} /></label>}
  </div>;
}

function ScheduleForm({ row, onScheduled }: { row: Intake; onScheduled: (result: Scheduled) => void }) {
  const [time, setTime] = useState("");
  const [kind, setKind] = useState<"visit" | "measure">("visit");
  const [priceText, setPriceText] = useState("");
  const [priceReviewed, setPriceReviewed] = useState(false);
  const priceInput = useRef<HTMLInputElement>(null);
  const priceId = useId();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const locked = useRef(false);
  const measurement = kind === "measure";
  const quote = readQuote(priceText, measurement);
  const priceError = priceReviewed ? quote.error : "";

  function focusPrice() {
    setPriceReviewed(true);
    priceInput.current?.focus();
  }
  async function schedule(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (locked.current) return;
    if (quote.error) {
      focusPrice();
      return;
    }
    const fields = new FormData(event.currentTarget);
    locked.current = true;
    setBusy(true);
    setError("");
    try {
      const { data, error } = await getSupabase().rpc("schedule_customer_intake", {
        p_id: row.id, p_date: fields.get("date"), p_time: fields.get("time") || null,
        p_tech: fields.get("tech"), p_measurement: measurement, p_price: quote.amount,
        p_staff_memo: String(fields.get("staffMemo") ?? "").trim(),
      }).single<Scheduled>();
      if (error || !data) {
        setError(error?.message === "quote_required" ? quoteRequired
          : error?.code === "P0002" ? "이미 처리된 접수예요. 접수함을 새로고침해 주세요."
          : error?.code === "42501" ? "등록 권한을 확인해 주세요." : "등록 결과를 확인하지 못했어요. 같은 접수에서 다시 시도해 주세요.");
        return;
      }
      onScheduled(data);
    } catch {
      setError("일정 등록 결과를 확인하지 못했어요. 연결을 확인하고 다시 시도해 주세요.");
    } finally {
      locked.current = false;
      setBusy(false);
    }
  }
  return <div className={s.detail}>
    <dl>
      <dt>전화번호</dt><dd><a href={`tel:${row.phone}`}>{row.phone}</a></dd>
      <dt>방문 주소</dt><dd>{row.address}</dd>
      {row.notes && <><dt>고객 메모</dt><dd>{row.notes}</dd></>}
    </dl>
    {row.photo_count > 0 && <CustomerPhotoStrip requestId={row.id} count={row.photo_count} />}
    <form method="post" onSubmit={schedule} className={s.fields}>
      <fieldset disabled={busy}>
        <legend>방문 일정</legend>
        <div className={s.scheduleFields}>
          <div className={s.bookingTerms}>
            <fieldset className={s.kindField}>
              <legend>일정 종류</legend>
              <div className={s.kindOptions}>
                {visitKinds.map(option => <label key={option.value}>
                  <input type="radio" name="kind" value={option.value} checked={kind === option.value}
                    onChange={() => { setKind(option.value); setPriceReviewed(false); }} />
                  <span>{option.label}</span>
                </label>)}
              </div>
            </fieldset>
            <div className={s.quoteField}>
              <label htmlFor={priceId}>견적 금액 <small data-required={!measurement}>{measurement ? "선택" : "필수"}</small></label>
              <div className={s.amountBox} data-invalid={Boolean(priceError)}>
                <input ref={priceInput} id={priceId} name="price" type="text" inputMode="numeric" enterKeyHint="done"
                  autoComplete="off" placeholder="예) 150,000" required={!measurement} value={priceText}
                  aria-label="견적 금액 (원)" aria-invalid={Boolean(priceError)}
                  aria-describedby={priceError || measurement ? priceId + "-hint" : undefined}
                  onChange={event => setPriceText(event.target.value)}
                  onFocus={() => { if (quote.amount !== null) setPriceText(String(quote.amount)); }}
                  onBlur={() => {
                    setPriceReviewed(true);
                    if (quote.amount !== null) setPriceText(quote.amount.toLocaleString("ko-KR"));
                  }}
                  onInvalid={event => { event.preventDefault(); focusPrice(); }} />
                <span aria-hidden="true">원</span>
              </div>
              {priceError ? <p id={priceId + "-hint"} role="alert" className={s.error}>{priceError}</p>
                : measurement && <p id={priceId + "-hint"}>실측 후에 견적을 입력해도 돼요.</p>}
            </div>
          </div>
          <div className={s.dateTimePair}>
            <label>방문일<input type="date" name="date" defaultValue={today()} required /></label>
            <ArrivalTime name="time" label="방문 시각" value={time} onChange={setTime} />
          </div>
          <label>담당 기사<select name="tech" aria-label="담당 기사"><option value="">미배정</option>{TECHS.map(tech => <option key={tech}>{tech}</option>)}</select></label>
          <label className={s.staffMemo}>직원 메모 <small>선택</small>
            <textarea name="staffMemo" rows={3} maxLength={1200} placeholder="통화한 내용이나 현장에서 확인할 점" />
          </label>
        </div>
      </fieldset>
      {error && <p role="alert" className={s.error}>{error}</p>}
      <button className={s.primary} disabled={busy}>{busy ? "등록하는 중…" : "일정 등록"}</button>
    </form>
  </div>;
}

export default function IntakeDesk({ onView }: { onView: (id: string, date: string) => void }) {
  const [rows, setRows] = useState<Intake[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [more, setMore] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [result, setResult] = useState<Scheduled | null>(null);
  const version = useRef(0);
  const notice = useRef<HTMLDivElement>(null);

  const load = useCallback(async (after?: Intake) => {
    const token = ++version.current;
    setLoading(true);
    setError("");
    try {
      let query = getSupabase().from("customer_intakes").select("id,received_at,customer_name,phone,address,item,notes,photo_count")
        .is("scheduled_at", null).order("received_at").order("id").limit(pageSize + 1);
      if (after) query = query.or(`received_at.gt.${after.received_at},and(received_at.eq.${after.received_at},id.gt.${after.id})`);
      const { data, error } = await query;
      if (error) throw error;
      if (token !== version.current) return;
      setMore(data.length > pageSize);
      const batch = data.slice(0, pageSize) as Intake[];
      setRows(old => after ? [...old, ...batch] : batch);
    } catch {
      if (token === version.current) setError("접수함을 불러오지 못했어요. 새로고침해 주세요.");
    } finally {
      if (token === version.current) setLoading(false);
    }
  }, []);
  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    const invalidate = () => { version.current += 1; };
    return () => { window.clearTimeout(timer); invalidate(); };
  }, [load]);
  function scheduled(value: Scheduled) {
    setResult(value);
    setExpanded(null);
    setRows(old => old.filter(row => row.id !== expanded));
    void load();
    window.requestAnimationFrame(() => notice.current?.focus());
  }
  return <div className={s.desk}>
    <CopyLink />
    {result && <div className={s.notice} role="status" tabIndex={-1} ref={notice}>
      <strong>{formatFullDate(result.visit_date)} 일정으로 등록됐어요.</strong>
      <a href={`/admin?day=${result.visit_date}&job=${result.job_id}#calendar`} onClick={event => {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        onView(result.job_id, result.visit_date);
      }}>일정표에서 보기 <AdminIcon name="arrow" size={16} /></a>
    </div>}
    <section className={s.panel} aria-label="확인 대기 접수">
      <div className={s.panelHead}><h2>접수 대기</h2>
        <button className={s.textLink} type="button" disabled={loading} onClick={() => void load()}><AdminIcon name="refresh" size={16} />새로고침</button>
      </div>
      {error && <p role="alert" className={s.error}>{error}</p>}
      {!rows.length && !error && <p role="status" className={s.empty}>{loading ? "접수 내용을 불러오고 있어요…" : "확인을 기다리는 접수가 없어요."}</p>}
      <ul className={s.list}>{rows.map(row => <li key={row.id}>
        <button className={s.summary} aria-expanded={expanded === row.id} aria-controls={expanded === row.id ? `intake-${row.id}` : undefined}
          onClick={() => setExpanded(expanded === row.id ? null : row.id)}>
          <span><strong>{row.customer_name}</strong><span>{row.item}</span><small>{receivedDate.format(new Date(row.received_at))} 접수{row.photo_count > 0 && ` · 사진 ${row.photo_count}장`}</small></span>
          <AdminIcon name="arrow" size={18} />
        </button>
        {expanded === row.id && <div id={`intake-${row.id}`}><ScheduleForm row={row} onScheduled={scheduled} /></div>}
      </li>)}</ul>
      {more && <button className={s.secondary} disabled={loading} onClick={() => void load(rows.at(-1))}>다음 접수 더 보기</button>}
    </section>
  </div>;
}
