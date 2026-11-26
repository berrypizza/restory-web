"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { getSupabase } from "../../lib/utils";
import { normalizeLogo } from "./logo-image";
import { normalizeRegistration, type QuoteIssuer } from "./quote";
import s from "./quote.module.css";

type Profile = QuoteIssuer & { revision: number };
const fields = "name,registrationNumber:registration_number,logoUrl:logo,revision";
export async function loadQuoteProfile(): Promise<Profile> {
  const { data, error } = await getSupabase().from("intake_quote_profile").select(fields).eq("id", 1).single<Profile>();
  if (error || !data) throw new Error("견적서 업체 정보를 불러오지 못했어요. 연결을 확인하고 다시 시도해 주세요.");
  return data;
}

function ProfileEditor({ close, saved }: { close: () => void; saved: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const title = useId();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [logo, setLogo] = useState<string | null>(null);
  const [version, setVersion] = useState(0);
  const [busy, setBusy] = useState(false);
  const [conflict, setConflict] = useState(false);
  const [error, setError] = useState("");
  const lock = useRef(false);

  useEffect(() => {
    const el = dialog.current;
    el?.showModal();
    return () => { el?.close(); };
  }, []);
  useEffect(() => {
    let active = true;
    loadQuoteProfile().then(next => {
      if (!active) return;
      setProfile(next); setName(next.name); setNumber(next.registrationNumber || ""); setLogo(next.logoUrl);
      setError(""); setConflict(false);
    }).catch(e => { if (active) setError(e.message); });
    return () => { active = false; };
  }, [version]);
  async function upload(file: File) {
    if (lock.current) return;
    lock.current = true;
    setBusy(true); setError("");
    try { setLogo(await normalizeLogo(file)); }
    catch (e) { setError(e instanceof Error ? e.message : "로고를 열지 못했어요."); }
    finally { lock.current = false; setBusy(false); }
  }
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!profile || lock.current || conflict) return;
    const registrationNumber = normalizeRegistration(number);
    if (!name.trim()) { setError("업체명을 입력해 주세요."); return; }
    if (registrationNumber === null) { setError("사업자등록번호 10자리를 확인해 주세요."); return; }
    lock.current = true;
    setBusy(true); setError("");
    try {
      const { data, error: writeError } = await getSupabase().from("intake_quote_profile").update({
        name: name.trim(), registration_number: registrationNumber, logo, revision: profile.revision + 1,
      }).eq("id", 1).eq("revision", profile.revision).select("revision").maybeSingle();
      if (writeError) throw writeError;
      if (!data) { setConflict(true); setError("다른 관리자가 먼저 수정했어요. 최신 정보를 불러와 다시 편집해 주세요."); }
      else saved();
    } catch { setError("업체 정보를 저장하지 못했어요. 다시 시도해 주세요."); }
    finally { lock.current = false; setBusy(false); }
  }
  return <dialog ref={dialog} className={s.dialog} aria-labelledby={title} onCancel={e => { e.preventDefault(); if (!busy) close(); }}>
    <div className={s.body}>
      <header className={s.header}><div><h2 id={title}>견적서 업체 정보</h2><p>고객에게 보내는 견적서에 표시돼요.</p></div>
        <button type="button" className={s.close} disabled={busy} onClick={close} aria-label="업체 정보 닫기">×</button></header>
      {profile && <form onSubmit={save} className={s.form}>
        <label className={s.field}>업체명<input name="company" required maxLength={45} value={name} disabled={busy} onChange={e => setName(e.target.value)} /></label>
        <div className={s.field}>업체 로고 <small>선택</small>
          <div className={s.logoRow}>
            {logo && <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logo} alt="현재 업체 로고" width="50" height="50" />
            </>}
            <label className={s.logoPicker}>{logo ? "로고 바꾸기" : "로고 등록"}
              <input type="file" accept="image/png,image/jpeg,image/webp" aria-label="업체 로고 파일" disabled={busy} onChange={e => {
                const file = e.target.files?.[0]; e.target.value = ""; if (file) void upload(file);
              }} /></label>
            {logo && <button type="button" className={s.remove} disabled={busy} onClick={() => setLogo(null)}>로고 삭제</button>}
          </div>
        </div>
        <label className={s.field}>사업자등록번호 <small>선택</small>
          <input name="registrationNumber" inputMode="numeric" autoComplete="off" maxLength={12} placeholder="000-00-00000" disabled={busy}
            value={number} onChange={e => setNumber(e.target.value)} onBlur={() => { const n = normalizeRegistration(number); if (n !== null) setNumber(n); }}/>
        </label>
        {error && <p className={s.error} role="alert">{error}</p>}
        {conflict && <button type="button" className={s.secondary} onClick={() => setVersion(v => v + 1)}>최신 정보 불러오기</button>}
        <button type="submit" className={s.primary} disabled={busy || conflict}>{busy ? "처리 중…" : "업체 정보 저장"}</button>
      </form>}
      {!profile && (error ? <><p className={s.error} role="alert">{error}</p><button type="button" className={s.secondary}
        onClick={() => { setError(""); setVersion(v => v + 1); }}>다시 불러오기</button></> : <p role="status">업체 정보를 불러오고 있어요…</p>)}
    </div>
  </dialog>;
}

export function QuoteProfileSettings() {
  const [open, setOpen] = useState(false);
  const [notice, setNotice] = useState("");
  return <>
    <button type="button" className={s.secondary} aria-haspopup="dialog" onClick={() => { setNotice(""); setOpen(true); }}>견적서 업체 정보</button>
    {notice && <span role="status">{notice}</span>}
    {open && <ProfileEditor close={() => setOpen(false)} saved={() => { setNotice("업체 정보를 저장했어요."); setOpen(false); }} />}
  </>;
}
