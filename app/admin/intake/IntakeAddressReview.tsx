"use client";

import { useRef, useState, type FormEvent } from "react";
import VisitAddressFields from "@/app/components/VisitAddressFields";
import { addressIssue, type VisitAddress } from "@/lib/intake-address";
import { getSupabase } from "../lib/utils";
import s from "./intake.module.css";

type Props = { id: string; address: string; legacy: boolean; onConfirmed: (address: string) => void };

export default function IntakeAddressReview({ id, address, legacy, onConfirmed }: Props) {
  const original: VisitAddress = { base: address, detail: "", mode: "none" };
  const [draft, setDraft] = useState<VisitAddress>({ ...original, mode: "detail" });
  const [reviewed, setReviewed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const locked = useRef(false);
  const form = useRef<HTMLFormElement>(null);
  const useOriginal = legacy && draft.base === address && !draft.detail && !addressIssue(original);

  async function save(value: VisitAddress) {
    if (locked.current) return;
    const issue = addressIssue(value);
    setReviewed(true);
    setError("");
    if (issue) {
      (form.current?.elements.namedItem(issue.field) as HTMLInputElement | null)?.focus();
      return;
    }
    locked.current = true;
    setBusy(true);
    try {
      const { data, error } = await getSupabase().rpc("confirm_customer_intake_address", {
        p_id: id, p_expected: address, p_base: value.base,
        p_detail: value.mode === "detail" ? value.detail : "", p_mode: value.mode,
      });
      if (error || typeof data !== "string") {
        setError(error?.code === "40001" || error?.code === "P0002"
          ? "다른 관리자가 이 접수를 변경했어요. 접수함을 새로고침해 주세요."
          : "주소를 저장하지 못했어요. 입력한 내용을 확인하고 다시 시도해 주세요.");
        return;
      }
      onConfirmed(data);
    } catch {
      setError("연결을 확인하고 다시 저장해 주세요.");
    } finally {
      locked.current = false;
      setBusy(false);
    }
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    void save(draft);
  }

  return <form ref={form} onSubmit={submit} className={s.addressReview} aria-label="방문 주소 확인">
    <fieldset disabled={busy}>
      <legend>방문 주소 확인</legend>
      <p>{legacy ? "기존 접수예요. 기사님이 찾아갈 수 있는 주소인지 확인해 주세요." : "고객이 통화로 알려주기로 했어요. 동·호수나 층을 확인해 주세요."}</p>
      <VisitAddressFields value={draft} onChange={setDraft} issue={reviewed ? addressIssue(draft) : null} />
      {error && <p role="alert" className={s.error}>{error}</p>}
      <div className={s.addressActions}>
        <button type="submit" className={s.primary}>{busy ? "저장하는 중…" : "확인한 주소 저장"}</button>
        {useOriginal && <button type="button" className={s.secondary} onClick={() => void save(original)}>기존 주소 그대로 확인</button>}
      </div>
    </fieldset>
  </form>;
}
