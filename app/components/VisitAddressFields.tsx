"use client";

import { useId, useRef, useState } from "react";
import { addressIssue, type AddressIssue, type AddressMode, type VisitAddress } from "@/lib/intake-address";
import PostcodeSearch from "../request/PostcodeSearch";
import s from "./visitAddress.module.css";

type Props = {
  value: VisitAddress;
  onChange: (next: VisitAddress) => void;
  allowLater?: boolean;
  issue?: AddressIssue | null;
};

export default function VisitAddressFields({ value, onChange, allowLater = false, issue }: Props) {
  const id = useId();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchError, setSearchError] = useState("");
  const baseInput = useRef<HTMLInputElement>(null);
  const detailInput = useRef<HTMLInputElement>(null);
  function selectBase(base: string) {
    const next = { base, detail: "", mode: "detail" } as const;
    const incomplete = addressIssue({ ...next, mode: "none" });
    setSearchOpen(false);
    if (incomplete) setSearchError("검색한 주소에 건물번호나 지번을 더해 주세요.");
    onChange(next);
    window.requestAnimationFrame(() => (incomplete ? baseInput.current : detailInput.current)?.focus());
  }

  function choose(mode: AddressMode) {
    const nextMode = value.mode === mode ? "detail" : mode;
    onChange({ ...value, mode: nextMode });
    if (nextMode === "detail") window.requestAnimationFrame(() => detailInput.current?.focus());
  }
  const baseError = issue?.field === "address" ? issue.message : "";
  const detailError = issue?.field === "addressDetail" ? issue.message : "";
  return <div className={s.address} role="group" aria-label="방문 주소">
    <label htmlFor={id + "-base"}>기본주소</label>
    <div className={allowLater ? s.searchRow : undefined}>
      <input ref={baseInput} id={id + "-base"} name="address" autoComplete="address-line1"
        placeholder="도로명·건물번호 또는 지번" maxLength={250} required value={value.base}
        aria-invalid={Boolean(baseError)} aria-describedby={baseError ? id + "-base-error" : undefined}
        onChange={e => { setSearchError(""); onChange({ ...value, base: e.target.value }); }} />
      {allowLater && <button type="button" className={s.searchButton} aria-expanded={searchOpen}
        aria-controls={searchOpen ? id + "-search" : undefined}
        onClick={() => { setSearchError(""); setSearchOpen(!searchOpen); }}>
        {searchOpen ? "검색 닫기" : "주소 찾기"}
      </button>}
    </div>
    {baseError && <p className={s.error} id={id + "-base-error"} role="alert">{baseError}</p>}
    {searchError && <p className={s.hint} role="status">{searchError}</p>}
    {searchOpen && <div id={id + "-search"} className={s.searchPanel}>
      <PostcodeSearch onSelect={selectBase} onUnavailable={() => {
        setSearchOpen(false);
        setSearchError("주소 검색을 열지 못했어요. 기본주소를 직접 입력해 주세요.");
        baseInput.current?.focus();
      }} />
      <button type="button" className={s.manual} onClick={() => { setSearchOpen(false); baseInput.current?.focus(); }}>직접 입력하기</button>
    </div>}
    <label htmlFor={id + "-detail"} className={s.detailLabel}>상세주소</label>
    <input ref={detailInput} id={id + "-detail"} name="addressDetail" autoComplete="address-line2"
      placeholder="예) 101동 1203호, 2층 매장" maxLength={100} value={value.mode === "detail" ? value.detail : ""}
      disabled={value.mode !== "detail"} aria-required={value.mode === "detail"}
      aria-invalid={Boolean(detailError)} aria-describedby={detailError ? id + "-detail-error" : undefined}
      onChange={e => onChange({ ...value, detail: e.target.value })} />
    <div className={s.choices} role="group" aria-label="상세주소 선택">
      <button type="button" aria-pressed={value.mode === "none"} onClick={() => choose("none")}>상세주소 없음</button>
      {allowLater && <button type="button" aria-pressed={value.mode === "later"} onClick={() => choose("later")}>통화할 때 알려드릴게요</button>}
    </div>
    {detailError && <p className={s.error} id={id + "-detail-error"} role="alert">{detailError}</p>}
    {value.mode === "later" && <p className={s.hint} role="status">상담은 바로 접수돼요. 방문 일정을 잡기 전에 전화로 확인할게요.</p>}
  </div>;
}
