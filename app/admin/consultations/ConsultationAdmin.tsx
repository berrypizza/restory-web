"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { communityClient } from "@/lib/community/client";
import {
  CONSULTATION_STATUSES, CONSULTATION_TYPES, SITUATIONS, TRADES, REPAIR_EXPERIENCES, MARKETING_EXPERIENCES,
  type Consultation, type ConsultationStatus,
} from "@/lib/academy/consultation";
import AdminIcon from "../components/AdminIcon";
import styles from "./admin.module.css";

const PAGE_SIZE = 20;
const dateFormat = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul", dateStyle: "medium", timeStyle: "short",
});
const statusOptions = Object.entries(CONSULTATION_STATUSES) as [ConsultationStatus, string][];
const authMessages = {
  checking: "관리자 권한을 확인하고 있어요",
  login: "관리자 로그인이 필요해요",
  denied: "상담 관리 권한이 없는 계정이에요",
  error: "관리자 권한을 확인하지 못했어요",
};
type AuthState = keyof typeof authMessages | "ready";
type Listing = { rows: Consultation[]; count: number; newCount: number; key: string };

function Inquiry({
  row, busy, onUpdate, onRemove,
}: {
  row: Consultation;
  busy: string;
  onUpdate: (row: Consultation, status: ConsultationStatus) => void;
  onRemove: (row: Consultation) => void;
}) {
  const type = CONSULTATION_TYPES.find(item => item.value === row.consultation_type);
  return (
    <details className={styles.inquiry}>
      <summary>
        <span className={styles.who}>
          <strong>{row.name}</strong>
          <span className={styles.badge} data-status={row.status}>{CONSULTATION_STATUSES[row.status]}</span>
        </span>
        <span className={styles.type}>{type?.label || row.consultation_type}</span>
        <span className={styles.callTime}>{row.available_time || "시간 미입력"}</span>
        <time dateTime={row.created_at}>{dateFormat.format(new Date(row.created_at))}</time>
        <span aria-hidden="true" className={styles.disclosure} />
      </summary>
      <div className={styles.detail}>
        <div className={styles.contactBar}>
          <div>
            <h3>연락처</h3>
            <a href={`tel:${row.phone}`} className={styles.phone}>{row.phone}</a>
            <p>{row.available_time ? `통화 가능 · ${row.available_time}` : "통화 가능 시간 미입력"}</p>
          </div>
          <label className={styles.field}>진행 상태
            <select aria-label={`${row.name} 진행 상태`} value={row.status} disabled={Boolean(busy)}
              onChange={event => onUpdate(row, event.target.value as ConsultationStatus)}>
              {statusOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
        </div>
        <h3 className={styles.detailTitle}>상담 신청 내용</h3>
        <dl className={styles.answers}>
          <div><dt>상담 방식 · 비용</dt><dd>{type?.format || row.consultation_type} · {row.fee_krw === 0 ? "무료" : `${row.fee_krw.toLocaleString("ko-KR")}원`}</dd></div>
          {row.trade
            ? <div><dt>직종</dt><dd>{TRADES.find(item => item.value === row.trade)?.label || row.trade}</dd></div>
            : <div><dt>현재 상황</dt><dd>{SITUATIONS.find(item => item.value === row.situation)?.label || row.situation || "미입력"}</dd></div>}
          <div><dt>이메일</dt><dd>{row.email ? <a href={`mailto:${row.email}`}>{row.email}</a> : "미입력"}</dd></div>
          <div><dt>거주 지역</dt><dd>{row.region || "미입력"}</dd></div>
          <div><dt>나이 / 연령대</dt><dd>{row.age_range || "미입력"}</dd></div>
          <div><dt>수리·시공 경험</dt><dd>{REPAIR_EXPERIENCES.find(item => item.value === row.repair_experience)?.label || "미수집 (질문 추가 전 신청)"}</dd></div>
          <div><dt>마케팅 경험</dt><dd>{MARKETING_EXPERIENCES.find(item => item.value === row.marketing_experience)?.label || "미수집 (질문 추가 전 신청)"}</dd></div>
          <div className={styles.full}><dt>미리 하고 싶은 말</dt><dd className={styles.message}>{row.message || "미입력"}</dd></div>
        </dl>
        <div className={styles.retention}>
          <div><h3>개인정보 수집 동의</h3><p>{dateFormat.format(new Date(row.consented_at))} 동의 · {row.consent_version}</p></div>
          <button className={styles.delete} disabled={Boolean(busy)} onClick={() => onRemove(row)}>동의 철회·삭제</button>
        </div>
      </div>
    </details>
  );
}

export default function ConsultationAdmin() {
  const [auth, setAuth] = useState<AuthState>("checking");
  const [listing, setListing] = useState<Listing | null>(null);
  const [page, setPage] = useState(0);
  const [status, setStatus] = useState("");
  const [kind, setKind] = useState("");
  const [listError, setListError] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState("");
  const loadSequence = useRef(0);
  const authSequence = useRef(0);
  const invalidateList = useCallback(() => { loadSequence.current++; }, []);
  const invalidateAuth = useCallback(() => { authSequence.current++; }, []);
  const queryKey = `${status}/${kind}/${page}`;
  const displayed = listing?.key === queryKey ? listing : null;
  const pageCount = Math.max(1, Math.ceil((displayed?.count ?? 0) / PAGE_SIZE));
  const filtered = Boolean(status || kind);

  const checkAuth = useCallback(async () => {
    const sequence = ++authSequence.current;
    try {
      const db = communityClient();
      const { data: { user }, error: userError } = await db.auth.getUser();
      if (sequence !== authSequence.current) return;
      if (!user) {
        setAuth(userError && userError.name !== "AuthSessionMissingError" ? "error" : "login");
        setListing(null);
        return;
      }
      const { data, error: roleError } = await db.rpc("is_academy_admin");
      if (sequence !== authSequence.current) return;
      setAuth(roleError ? "error" : data === true ? "ready" : "denied");
      if (roleError || data !== true) setListing(null);
    } catch {
      if (sequence === authSequence.current) {
        setAuth("error");
        setListing(null);
      }
    }
  }, []);

  useEffect(() => {
    let timer = window.setTimeout(() => void checkAuth(), 0);
    let unsubscribe: (() => void) | undefined;
    try {
      const { data: { subscription } } = communityClient().auth.onAuthStateChange(event => {
        if (event === "SIGNED_OUT") {
          invalidateAuth();
          invalidateList();
          setListing(null);
          setNotice("");
          setError("");
          setListError("");
          setAuth("login");
        } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          window.clearTimeout(timer);
          timer = window.setTimeout(() => void checkAuth(), 0);
        }
      });
      unsubscribe = () => subscription.unsubscribe();
    } catch {
      // checkAuth also handles unavailable connection settings and renders a retry action.
    }
    return () => {
      window.clearTimeout(timer);
      invalidateAuth();
      invalidateList();
      unsubscribe?.();
    };
  }, [checkAuth, invalidateAuth, invalidateList]);

  const load = useCallback(async () => {
    const sequence = ++loadSequence.current;
    setLoading(true);
    setListError("");
    try {
      const db = communityClient();
      let query = db.from("academy_consultations").select("id,consultation_type,fee_krw,situation,trade,name,phone,email,region,age_range,repair_experience,marketing_experience,available_time,message,status,consent_version,consented_at,created_at", { count: "exact" }).order("created_at", { ascending: false }).order("id").range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);
      if (status) query = query.eq("status", status);
      if (kind) query = query.eq("consultation_type", kind);
      const [result, pending] = await Promise.all([
        query, db.from("academy_consultations").select("id", { count: "exact", head: true }).eq("status", "new"),
      ]);
      if (sequence !== loadSequence.current) return;
      if (result.error?.code === "PGRST103" && page > 0) {
        setPage(page - 1);
        return;
      }
      if (result.error || pending.error) throw new Error("list");
      const lastPage = Math.max(0, Math.ceil((result.count ?? 0) / PAGE_SIZE) - 1);
      if (page > lastPage) {
        setPage(lastPage);
        return;
      }
      setListing({ rows: (result.data ?? []) as Consultation[], count: result.count ?? 0, newCount: pending.count ?? 0, key: queryKey });
    } catch {
      if (sequence === loadSequence.current) {
        setListing(null);
        setListError("목록을 불러오지 못했어요. 연결 상태를 확인한 뒤 다시 시도해 주세요.");
      }
    } finally {
      if (sequence === loadSequence.current) setLoading(false);
    }
  }, [page, status, kind, queryKey]);

  useEffect(() => {
    if (auth !== "ready") return;
    const timer = window.setTimeout(() => void load(), 0);
    return () => { window.clearTimeout(timer); invalidateList(); };
  }, [auth, load, invalidateList]);

  function resetFilters() {
    setStatus("");
    setKind("");
    setPage(0);
  }

  async function login() {
    setBusy("login");
    setError("");
    try {
      sessionStorage.setItem("academy-admin-return", "consultations");
      const { error: loginError } = await communityClient().auth.signInWithOAuth({ provider: "kakao", options: { redirectTo: `${window.location.origin}/community/auth` } });
      if (loginError) throw loginError;
    } catch { setError("카카오 로그인을 시작하지 못했어요. 다시 시도해 주세요."); setBusy(""); }
  }

  async function logout() {
    setBusy("logout");
    setError("");
    try {
      const { error: logoutError } = await communityClient().auth.signOut({ scope: "local" });
      if (logoutError) throw logoutError;
      setListing(null);
      setAuth("login");
    } catch { setError("로그아웃하지 못했어요. 다시 시도해 주세요."); }
    finally { setBusy(""); }
  }

  async function update(row: Consultation, value: ConsultationStatus) {
    setBusy(row.id); setError(""); setNotice("");
    try {
      const { data, error: updateError } = await communityClient().from("academy_consultations").update({ status: value }).eq("id", row.id).select("id");
      if (updateError || data?.length !== 1) throw new Error("update");
      setNotice(`진행 상태를 ‘${CONSULTATION_STATUSES[value]}’로 변경했어요.`);
      await load();
    } catch { setError("상태를 변경하지 못했어요. 관리자 로그인 상태를 확인하고 다시 시도해 주세요."); }
    finally { setBusy(""); }
  }

  async function remove(row: Consultation) {
    if (!window.confirm(`${row.name}님의 상담 신청과 개인정보를 삭제할까요? 삭제 후 복구할 수 없습니다.`)) return;
    setBusy(row.id); setError(""); setNotice("");
    try {
      const { data, error: deleteError } = await communityClient().from("academy_consultations").delete().eq("id", row.id).select("id");
      if (deleteError || data?.length !== 1) throw new Error("delete");
      setNotice("상담 신청과 개인정보를 삭제했어요.");
      if (displayed?.rows.length === 1 && page > 0) setPage(page - 1);
      else await load();
    } catch { setError("신청을 삭제하지 못했어요. 관리자 로그인 상태를 확인하고 다시 시도해 주세요."); }
    finally { setBusy(""); }
  }

  return (
    <main className={styles.canvas}>
      <div className={styles.page}>
        <nav aria-label="관리자 이동" className={styles.nav}>
          <Link href="/admin" className={styles.back}><span aria-hidden="true">‹</span> 리스토리 관리자</Link>
          <Link href="/academy/consult" className={styles.link}>신청 화면 보기 <span aria-hidden="true">↗</span></Link>
        </nav>
        <header className={styles.header}>
          <h1>기살 상담 신청</h1>
          {auth === "ready" && <button className={styles.link} disabled={Boolean(busy)} onClick={() => void logout()}><AdminIcon name="logout" size={16} />로그아웃</button>}
        </header>
        {auth !== "ready" && error && <p className={styles.error} role="alert">{error}</p>}
        {auth !== "ready" ? (
          <section className={styles.login} aria-busy={auth === "checking"}>
            <h2>{authMessages[auth]}</h2>
            <p>신청자의 연락처와 상담 내용은 등록된 관리자 계정으로 확인할 수 있어요.</p>
            {auth === "login" && <button className={styles.kakao} disabled={Boolean(busy)} onClick={() => void login()}>{busy ? "로그인 연결 중…" : "카카오로 관리자 로그인"}</button>}
            {auth === "denied" && <button className={styles.button} disabled={Boolean(busy)} onClick={() => void logout()}>로그아웃하고 계정 변경</button>}
            {auth === "error" && <button className={styles.button} onClick={() => { setAuth("checking"); void checkAuth(); }}>다시 확인</button>}
          </section>
        ) : (
          <>
            <div className={styles.queue}>
              <div className={styles.queueHead}>
                <h2>신청 목록 {displayed && <span>{displayed.count.toLocaleString("ko-KR")}건</span>}</h2>
                <button className={styles.link} onClick={() => void load()} disabled={loading || Boolean(busy)}><AdminIcon name="refresh" size={16} />{loading ? "불러오는 중…" : "새로고침"}</button>
              </div>
              <div className={styles.filters}>
                <div className={styles.statusGroup} role="group" aria-label="진행 상태로 필터">
                  <button aria-pressed={!status} disabled={Boolean(busy)} onClick={() => { setStatus(""); setPage(0); }}>전체</button>
                  {statusOptions.map(([value, label]) => (
                    <button key={value} aria-pressed={status === value} disabled={Boolean(busy)} onClick={() => { setStatus(value); setPage(0); }}>
                      {label}{value === "new" && listing && !kind && <span>{listing.newCount}</span>}
                    </button>
                  ))}
                </div>
                <label className={styles.kind}>
                  <span className="sr-only">상담 방식</span>
                  <select value={kind} disabled={Boolean(busy)} onChange={event => { setKind(event.target.value); setPage(0); }}>
                    <option value="">전체 상담 방식</option>
                    {CONSULTATION_TYPES.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}
                  </select>
                </label>
              </div>
              {listError ? (
                <div className={styles.empty} role="alert">
                  <p>{listError}</p><button className={styles.button} onClick={() => void load()}>목록 다시 불러오기</button>
                </div>
              ) : !displayed ? <p className={styles.empty} role="status">상담 신청을 불러오는 중…</p> : displayed.rows.length ? (
                <div aria-busy={loading} className={styles.list}>
                  <div className={styles.columns} aria-hidden="true"><span>신청자 · 진행 상태</span><span>상담 방식</span><span>통화 가능 시간</span><span>접수 시각</span></div>
                  {displayed.rows.map(row => <Inquiry key={row.id} row={row} busy={busy} onUpdate={update} onRemove={remove} />)}
                </div>
              ) : (
                <div className={styles.empty}>
                  <p>{filtered ? "선택한 조건에 맞는 신청이 없어요." : "아직 접수된 상담 신청이 없어요."}</p>
                  {filtered && <button className={styles.button} onClick={resetFilters}>필터 초기화</button>}
                </div>
              )}
              {displayed && pageCount > 1 && (
                <nav className={styles.pagination} aria-label="신청 목록 페이지">
                  <button className={styles.button} onClick={() => setPage(page - 1)} disabled={!page || loading || Boolean(busy)}>이전</button>
                  <span>{page + 1} / {pageCount} 페이지</span>
                  <button className={styles.button} onClick={() => setPage(page + 1)} disabled={page + 1 >= pageCount || loading || Boolean(busy)}>다음</button>
                </nav>
              )}
            </div>
            <p className={styles.privacy}>접수·동의 시각은 한국 시간 기준입니다. 개인정보는 상담·일정 안내에만 사용하며 접수 후 90일이 지나면 자동 삭제됩니다.</p>
            {(error || notice) && <div className={styles.notice} data-error={Boolean(error)}>
              <p role={error ? "alert" : "status"}>{error || notice}</p>
              <button aria-label="처리 알림 닫기" onClick={() => { setNotice(""); setError(""); }}>닫기</button>
            </div>}
          </>
        )}
      </div>
    </main>
  );
}
