"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import AdminIcon from "../components/AdminIcon";
import { useIntakeStaff } from "../hooks/useIntakeStaff";
import { TECHS } from "../lib/constants";
import { formatFullDate, getSupabase, today } from "../lib/utils";
import { signInStaff } from "../lib/staffLogin";
import s from "./intake.module.css";

type Intake = {
  id: string; received_at: string; customer_name: string; phone: string; address: string; item: string; notes: string | null;
};
type Scheduled = { job_id: string; visit_date: string };
const pageSize = 25;
const receivedDate = new Intl.DateTimeFormat("ko-KR", { month: "long", day: "numeric", hour: "numeric", minute: "2-digit", timeZone: "Asia/Seoul" });

function StaffSignIn() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const fields = new FormData(event.currentTarget);
    setBusy(true);
    setError("");
    try {
      if (!await signInStaff(String(fields.get("login")), String(fields.get("password")))) {
        setError("직원 아이디와 비밀번호를 다시 확인해 주세요.");
      }
    } catch {
      setError("연결 상태를 확인한 뒤 다시 로그인해 주세요.");
    } finally {
      setBusy(false);
    }
  }
  return <section className={s.panel}>
    <h2>직원 계정으로 로그인</h2>
    <p>고객 접수는 고관호·고현호 관리자가 확인하고 일정으로 등록할 수 있어요.</p>
    <form className={s.fields} onSubmit={login} method="post">
      <label>직원 아이디<input autoComplete="username" autoCapitalize="none" spellCheck={false} name="login" required /></label>
      <label>비밀번호<input type="password" name="password" autoComplete="current-password" required /></label>
      {error && <p role="alert" className={s.error}>{error}</p>}
      <button className={s.primary} disabled={busy}>{busy ? "로그인 중…" : "직원 로그인"}</button>
    </form>
  </section>;
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
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const locked = useRef(false);
  async function schedule(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (locked.current) return;
    const fields = new FormData(event.currentTarget);
    locked.current = true;
    setBusy(true);
    setError("");
    try {
      const { data, error } = await getSupabase().rpc("schedule_customer_intake", {
        p_id: row.id, p_date: fields.get("date"), p_time: fields.get("time") || null,
        p_tech: fields.get("tech"), p_measurement: fields.get("kind") === "measure",
      }).single<Scheduled>();
      if (error || !data) {
        setError(error?.code === "P0002" ? "이미 처리된 접수예요. 접수함을 새로고침해 주세요."
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
      {row.notes && <><dt>상담 내용</dt><dd>{row.notes}</dd></>}
    </dl>
    <form method="post" onSubmit={schedule} className={s.fields}>
      <fieldset disabled={busy}>
        <legend>방문 일정</legend>
        <div className={s.pair}>
          <label>방문일<input type="date" name="date" defaultValue={today()} required /></label>
          <label>시간 <small>선택</small><input type="time" name="time" /></label>
          <label>일정 종류<select name="kind"><option value="visit">일반 방문</option><option value="measure">실측</option></select></label>
          <label>담당 기사<select name="tech"><option value="">미배정</option>{TECHS.map(tech => <option key={tech}>{tech}</option>)}</select></label>
        </div>
      </fieldset>
      {error && <p role="alert" className={s.error}>{error}</p>}
      <button className={s.primary} disabled={busy}>{busy ? "등록하는 중…" : "일정 등록"}</button>
    </form>
  </div>;
}

function Inbox() {
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
      let query = getSupabase().from("customer_intakes").select("id,received_at,customer_name,phone,address,item,notes")
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
  return <>
    <CopyLink />
    {result && <div className={s.notice} role="status" tabIndex={-1} ref={notice}>
      <strong>{formatFullDate(result.visit_date)} 일정으로 등록됐어요.</strong>
      <Link href={`/admin?day=${result.visit_date}&job=${result.job_id}#calendar`}>일정표에서 보기 <AdminIcon name="arrow" size={16} /></Link>
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
          <span><strong>{row.customer_name}</strong><span>{row.item}</span><small>{receivedDate.format(new Date(row.received_at))} 접수</small></span>
          <AdminIcon name="arrow" size={18} />
        </button>
        {expanded === row.id && <div id={`intake-${row.id}`}><ScheduleForm row={row} onScheduled={scheduled} /></div>}
      </li>)}</ul>
      {more && <button className={s.secondary} disabled={loading} onClick={() => void load(rows.at(-1))}>다음 접수 더 보기</button>}
    </section>
  </>;
}

export default function IntakeDesk() {
  const staff = useIntakeStaff();
  const [error, setError] = useState("");
  async function logout() {
    try {
      const { error } = await getSupabase().auth.signOut({ scope: "local" });
      if (error) throw error;
      setError("");
    } catch { setError("로그아웃하지 못했어요. 다시 시도해 주세요."); }
  }
  return <main className={s.page}><div className={s.shell}>
    <header className={s.bar}><Link href="/admin">← 업무 홈</Link>
      {(staff.status === "staff" || staff.status === "unlisted") && <button type="button" onClick={logout}>직원 로그아웃</button>}
    </header>
    <h1>고객 접수함</h1>
    {error && <p role="alert" className={s.error}>{error}</p>}
    {staff.status === "loading" && <p role="status">직원 계정을 확인하는 중…</p>}
    {staff.status === "guest" && <StaffSignIn />}
    {staff.status === "error" && <div className={s.panel}><p role="alert">직원 권한을 확인하지 못했어요.</p><button className={s.secondary} onClick={() => window.location.reload()}>다시 확인</button></div>}
    {staff.status === "unlisted" && <div className={s.panel}><p>직원으로 등록된 계정으로 로그인해 주세요.</p></div>}
    {staff.status === "staff" && (staff.role === "admin" ? <Inbox key={staff.id} /> :
      <section className={s.panel}><h2>{staff.name} 기사님</h2><p>배정된 방문 일정은 일정표에서 확인할 수 있어요.</p><Link className={s.primary} href="/admin#calendar">내 일정표 열기</Link></section>)}
  </div></main>;
}
