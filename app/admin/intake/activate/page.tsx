"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabase } from "../../lib/utils";
import { signInStaff } from "../../lib/staffLogin";
import s from "../intake.module.css";

export default function ActivateStaff() {
  const token = useRef("");
  const invitation = useRef({ ticket: "", login: "" });
  const setupClient = useRef<SupabaseClient | null>(null);
  const verified = useRef(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.slice(1));
    if (params.has("setup") || params.has("invite")) {
      token.current = params.get("setup") ?? "";
      invitation.current = { ticket: params.get("invite") ?? "", login: params.get("login") ?? "" };
      window.history.replaceState(window.history.state, "", window.location.pathname);
    }
  }, []);
  async function activate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    const password = String(fields.get("password"));
    if (password !== fields.get("confirm")) return setError("두 비밀번호가 같은지 확인해 주세요.");
    if (!invitation.current.ticket && !token.current && !verified.current) return setError("담당자에게 받은 비밀번호 설정 링크를 다시 열어 주세요.");
    setBusy(true);
    setError("");
    try {
      if (invitation.current.ticket) {
        const { ticket, login } = invitation.current;
        const { data, error } = await getSupabase().functions.invoke("activate-intake-staff", { body: { ticket, password } });
        // If the response was lost after enrollment, the chosen credentials already work.
        if (!await signInStaff(data?.login ?? login, password)) {
          return setError(error?.context?.status === 422 ? "더 긴 비밀번호로 다시 시도해 주세요."
            : "계정 설정을 마치지 못했어요. 본인의 설정 링크와 비밀번호를 확인해 주세요.");
        }
        form.reset();
        window.location.replace("/admin#home");
        return;
      }
      // Keep setup isolated from staff accounts signed into other tabs.
      const db = setupClient.current ??= createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { auth: { storageKey: "restory-staff-password-setup", persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } },
      );
      if (!verified.current) {
        const { data, error } = await db.auth.verifyOtp({ token_hash: token.current, type: "recovery" });
        if (error || !data.user) return setError("설정 링크를 확인하지 못했어요. 만료된 경우 담당자에게 새 링크를 요청해 주세요.");
        verified.current = true;
        token.current = "";
      }
      const { error } = await db.auth.updateUser({ password });
      if (error) return setError("비밀번호를 저장하지 못했어요. 더 긴 비밀번호로 다시 시도해 주세요.");
      form.reset();
      const { data: { session } } = await db.auth.getSession();
      if (session) await getSupabase().auth.setSession(session);
      window.location.replace("/admin#home");
    } catch {
      setError("연결 상태를 확인하고 다시 시도해 주세요.");
    } finally { setBusy(false); }
  }
  return <main className={s.page}><div className={s.shell}>
    <h1>직원 비밀번호 설정</h1>
    <section className={s.panel}><p>기존 직원 아이디와 함께 사용할 비밀번호를 설정해 주세요.</p>
      <form method="post" onSubmit={activate} className={s.fields}>
        <label>새 비밀번호<input name="password" type="password" autoComplete="new-password" minLength={8} placeholder="8자 이상" required /></label>
        <label>새 비밀번호 확인<input name="confirm" type="password" autoComplete="new-password" minLength={8} required /></label>
        {error && <p role="alert" className={s.error}>{error}</p>}
        <button disabled={busy} className={s.primary}>{busy ? "저장하는 중…" : "비밀번호 설정"}</button>
      </form>
    </section>
  </div></main>;
}
