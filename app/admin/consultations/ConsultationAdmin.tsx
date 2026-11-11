"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { communityClient } from "@/lib/community/client";
import { CONSULTATION_STATUSES, CONSULTATION_TYPES, SITUATIONS, REPAIR_EXPERIENCES, MARKETING_EXPERIENCES, type Consultation, type ConsultationStatus } from "@/lib/academy/consultation";
import styles from "./admin.module.css";

const PAGE_SIZE = 20;
function date(value: string) { return new Intl.DateTimeFormat("ko-KR", { timeZone: "Asia/Seoul", dateStyle: "medium", timeStyle: "short" }).format(new Date(value)); }

export default function ConsultationAdmin() {
  const [auth, setAuth] = useState<"checking" | "login" | "denied" | "ready" | "error">("checking");
  const [rows, setRows] = useState<Consultation[]>([]);
  const [count, setCount] = useState(0);
  const [newCount, setNewCount] = useState(0);
  const [page, setPage] = useState(0);
  const [status, setStatus] = useState("");
  const [kind, setKind] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState("");
  const loadSequence = useRef(0);
  const authSequence = useRef(0);
  const invalidate = useCallback(() => { authSequence.current++; loadSequence.current++; }, []);

  const checkAuth = useCallback(async () => {
    const sequence = ++authSequence.current;
    try {
      const db = communityClient();
      const { data: { user }, error: userError } = await db.auth.getUser();
      if (sequence !== authSequence.current) return;
      if (!user) { setAuth(userError && userError.name !== "AuthSessionMissingError" ? "error" : "login"); setRows([]); return; }
      const { data, error: roleError } = await db.rpc("is_academy_admin");
      if (sequence !== authSequence.current) return;
      setAuth(roleError ? "error" : data === true ? "ready" : "denied");
      if (roleError || data !== true) setRows([]);
    } catch { if (sequence === authSequence.current) { setAuth("error"); setRows([]); } }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void checkAuth(), 0);
    const { data: { subscription } } = communityClient().auth.onAuthStateChange(event => {
      if (event === "SIGNED_OUT") { authSequence.current++; loadSequence.current++; setRows([]); setAuth("login"); }
      else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") queueMicrotask(() => void checkAuth());
    });
    return () => { window.clearTimeout(timer); invalidate(); subscription.unsubscribe(); };
  }, [checkAuth, invalidate]);

  const load = useCallback(async () => {
    const sequence = ++loadSequence.current;
    setLoading(true); setError("");
    try {
      const db = communityClient();
      let query = db.from("academy_consultations").select("id,consultation_type,fee_krw,situation,name,phone,email,region,age_range,repair_experience,marketing_experience,available_time,message,status,consent_version,consented_at,created_at", { count: "exact" }).order("created_at", { ascending: false }).order("id").range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);
      if (status) query = query.eq("status", status);
      if (kind) query = query.eq("consultation_type", kind);
      const [result, pending] = await Promise.all([query, db.from("academy_consultations").select("id", { count: "exact", head: true }).eq("status", "new")]);
      if (sequence !== loadSequence.current) return;
      if (result.error || pending.error) { setRows([]); setError("상담 신청을 불러오지 못했습니다. 로그인 상태를 확인하고 다시 시도해주세요."); return; }
      setRows((result.data ?? []) as Consultation[]); setCount(result.count ?? 0); setNewCount(pending.count ?? 0);
    } catch { if (sequence === loadSequence.current) setError("네트워크 연결을 확인해주세요."); }
    finally { if (sequence === loadSequence.current) setLoading(false); }
  }, [page, status, kind]);
  useEffect(() => {
    if (auth !== "ready") return;
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
  }, [auth, load]);

  async function login() {
    setBusy("login"); setError("");
    try {
      sessionStorage.setItem("academy-admin-return", "consultations");
      const { error: loginError } = await communityClient().auth.signInWithOAuth({ provider: "kakao", options: { redirectTo: `${window.location.origin}/community/auth` } });
      if (loginError) { setError("카카오 로그인에 연결하지 못했습니다."); setBusy(""); }
    } catch { setError("로그인을 시작하지 못했습니다. 다시 시도해주세요."); setBusy(""); }
  }
  async function logout() {
    setBusy("logout");
    try {
      const { error: logoutError } = await communityClient().auth.signOut({ scope: "local" });
      if (logoutError) setError("로그아웃하지 못했습니다. 다시 시도해주세요.");
      else { setRows([]); setAuth("login"); }
    } catch { setError("로그아웃하지 못했습니다. 다시 시도해주세요."); }
    finally { setBusy(""); }
  }
  async function update(row: Consultation, value: ConsultationStatus) {
    setBusy(row.id); setError(""); setNotice("");
    try {
      const { data, error: updateError } = await communityClient().from("academy_consultations").update({ status: value }).eq("id", row.id).select("id");
      if (updateError || data?.length !== 1) setError("상태를 변경하지 못했습니다. 관리자 로그인 상태를 확인해주세요.");
      else { setNotice("상담 상태를 변경했습니다."); await load(); }
    } catch { setError("변경을 저장하지 못했습니다. 다시 시도해주세요."); }
    finally { setBusy(""); }
  }
  async function remove(row: Consultation) {
    if (!window.confirm(`${row.name}님의 상담 신청과 개인정보를 삭제할까요? 삭제 후 복구할 수 없습니다.`)) return;
    setBusy(row.id); setError(""); setNotice("");
    try {
      const { data, error: deleteError } = await communityClient().from("academy_consultations").delete().eq("id", row.id).select("id");
      if (deleteError || data?.length !== 1) setError("삭제하지 못했습니다. 관리자 로그인 상태를 확인해주세요.");
      else { setNotice("상담 신청과 개인정보를 삭제했습니다."); if (rows.length === 1 && page > 0) setPage(page - 1); else await load(); }
    } catch { setError("삭제하지 못했습니다. 다시 시도해주세요."); }
    finally { setBusy(""); }
  }

  return <main className={styles.page}>
    <header className={styles.header}><div><Link href="/admin" className={styles.back}>← 리스토리 관리자</Link><p className={styles.eyebrow}>GISAL × RESTORY</p><h1>상담 신청</h1><p>기술로 살아남기 진단·상담 신청을 확인하고 관리합니다.</p></div><Link href="/academy/consult" className={styles.linkButton}>신청 화면 보기 ↗</Link></header>
    {auth !== "ready" ? <section className={styles.login}>
      <h2>{auth === "checking" ? "관리자 권한 확인 중…" : auth === "denied" ? "상담 관리 권한이 없는 계정입니다." : auth === "error" ? "로그인 상태를 확인하지 못했습니다." : "관리자 계정으로 로그인해주세요."}</h2>
      <p>신청자의 연락처와 상담 내용은 등록된 관리자 계정에서만 볼 수 있습니다.</p>
      {auth === "login" && <button className={styles.kakao} onClick={() => void login()} disabled={Boolean(busy)}>{busy ? "로그인 연결 중…" : "카카오로 관리자 로그인"}</button>}
      {auth === "denied" && <button className={styles.linkButton} onClick={() => void logout()} disabled={Boolean(busy)}>로그아웃하고 계정 변경</button>}
      {auth === "error" && <button className={styles.linkButton} onClick={() => void checkAuth()}>다시 확인</button>}
    </section> : <>
      <div className={styles.toolbar}><div><strong>새 신청 {newCount}건</strong><span>선택한 목록 {count}건</span></div><div><button onClick={() => void load()} disabled={loading}>새로고침</button><button onClick={() => void logout()} disabled={Boolean(busy)}>로그아웃</button></div></div>
      <div className={styles.filters}><label>상담 방식<select value={kind} onChange={e => { setKind(e.target.value); setPage(0); }}><option value="">전체 방식</option>{CONSULTATION_TYPES.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label><label>진행 상태<select value={status} onChange={e => { setStatus(e.target.value); setPage(0); }}><option value="">전체 상태</option>{Object.entries(CONSULTATION_STATUSES).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label></div>
      {loading ? <p className={styles.empty}>상담 신청을 불러오는 중…</p> : rows.length === 0 ? <p className={styles.empty}>해당하는 상담 신청이 없습니다.</p> : <div className={styles.list}>{rows.map(row => <details className={styles.card} key={row.id}>
        <summary><div><span className={styles.badge} data-status={row.status}>{CONSULTATION_STATUSES[row.status]}</span><strong>{row.name}</strong><span>{CONSULTATION_TYPES.find(item => item.value === row.consultation_type)?.label}</span><small>{date(row.created_at)} (한국 시간)</small></div><span className={styles.expand}>상세 보기 ＋</span></summary>
        <div className={styles.detail}><dl>
          <div><dt>상담 방식 / 비용</dt><dd>{row.consultation_type === "offline" ? "오프라인 상담 · 50,000원" : "온라인 1:1 진단 · 무료"}</dd></div>
          <div><dt>현재 상황</dt><dd>{SITUATIONS.find(item => item.value === row.situation)?.label}</dd></div>
          <div><dt>전화번호</dt><dd><a href={`tel:${row.phone}`}>{row.phone}</a></dd></div>
          <div><dt>이메일</dt><dd>{row.email || "미입력"}</dd></div>
          <div><dt>거주 지역</dt><dd>{row.region || "미입력"}</dd></div>
          <div><dt>나이 / 연령대</dt><dd>{row.age_range || "미입력"}</dd></div>
          <div className={styles.full}><dt>수리·시공 경험</dt><dd>{REPAIR_EXPERIENCES.find(item => item.value === row.repair_experience)?.label || "미수집 (질문 추가 전 신청)"}</dd></div>
          <div className={styles.full}><dt>마케팅 경험</dt><dd>{MARKETING_EXPERIENCES.find(item => item.value === row.marketing_experience)?.label || "미수집 (질문 추가 전 신청)"}</dd></div>
          <div className={styles.full}><dt>통화 가능 시간대</dt><dd>{row.available_time}</dd></div>
          <div className={styles.full}><dt>미리 하고 싶은 말</dt><dd className={styles.message}>{row.message || "미입력"}</dd></div>
          <div className={styles.full}><dt>개인정보 수집 동의</dt><dd>동의함 · {date(row.consented_at)} (한국 시간)<small>동의문 버전 {row.consent_version} · 접수 후 90일 보관</small></dd></div>
        </dl><div className={styles.detailActions}><label>진행 상태<select value={row.status} disabled={Boolean(busy)} onChange={e => void update(row, e.target.value as ConsultationStatus)}>{Object.entries(CONSULTATION_STATUSES).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><button className={styles.delete} disabled={Boolean(busy)} onClick={() => void remove(row)}>동의 철회·삭제</button></div></div>
      </details>)}</div>}
      <div className={styles.pagination}><button onClick={() => setPage(page - 1)} disabled={page === 0 || loading}>이전</button><span>{page + 1} / {Math.max(1, Math.ceil(count / PAGE_SIZE))}</span><button onClick={() => setPage(page + 1)} disabled={(page + 1) * PAGE_SIZE >= count || loading}>다음</button></div>
      <p className={styles.privacy}>개인정보는 상담·일정 안내 용도로만 사용해주세요. 접수 후 90일이 지난 신청은 자동 삭제됩니다.</p>
    </>}
    {error && <p className={styles.error} role="alert">{error}</p>}{notice && <p className={styles.notice} role="status">{notice}</p>}
  </main>;
}
