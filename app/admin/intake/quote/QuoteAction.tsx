"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { createQuoteImage } from "./quote-image";
import { maxQuoteLines, maxQuoteTotal, quoteTotal, readWon, won, type QuoteIssuer } from "./quote";
import s from "./quote.module.css";

type Props = {
  customer: string;
  item: string;
  initialAmount?: number | null;
  loadIssuer: () => Promise<QuoteIssuer>;
  disabled?: boolean;
};
type DraftLine = { id: number; name: string; quantity: string; rate: string };
type Output = { file: File; url: string; total: number };

function QuoteEditor({ customer, item, initialAmount, loadIssuer, close }: Props & { close: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const title = useId();
  const nextId = useRef(1);
  const lock = useRef(false);
  const [lines, setLines] = useState<DraftLine[]>([{ id: 0, name: item, quantity: "1", rate: initialAmount ? String(initialAmount) : "" }]);
  const [note, setNote] = useState("");
  const [issued, setIssued] = useState(() => new Date(Date.now() + 9 * 3600_000).toISOString().slice(0, 10));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [output, setOutput] = useState<Output | null>(null);
  const alive = useRef(false);
  const previewTitle = useRef<HTMLHeadingElement>(null);
  const generateButton = useRef<HTMLButtonElement>(null);
  const canShare = !!output && typeof navigator.canShare === "function" && navigator.canShare({ files: [output.file] });

  useEffect(() => {
    const element = dialog.current;
    alive.current = true;
    element?.showModal();
    return () => { alive.current = false; element?.close(); };
  }, []);
  useEffect(() => {
    if (!output) return;
    previewTitle.current?.focus();
    return () => URL.revokeObjectURL(output.url);
  }, [output]);

  const items = lines.map(line => ({ name: line.name.trim(), quantity: Number(line.quantity), unitPrice: readWon(line.rate) }));
  const amountsReady = items.every(line => Number.isInteger(line.quantity) && line.quantity >= 1 && line.quantity <= 9999 && line.unitPrice !== null);
  const total = amountsReady ? items.reduce((sum, line) => sum + line.quantity * line.unitPrice!, 0) : null;

  function edit(id: number, change: Partial<Omit<DraftLine, "id">>) {
    setError("");
    setLines(current => current.map(line => line.id === id ? { ...line, ...change } : line));
  }
  async function generate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();
    if (lock.current) return;
    if (items.some(line => !line.name)) { setError("각 품목의 이름을 입력해 주세요."); return; }
    if (note.trim().split(/\r?\n/).length > 12) { setError("고객 안내는 12줄 이내로 입력해 주세요."); return; }
    if (total === null || total < 1 || total > maxQuoteTotal) {
      setError("수량과 단가를 확인해 주세요. 총 견적 금액은 1원부터 2,147,483,647원까지 입력할 수 있어요."); return;
    }
    lock.current = true;
    setBusy(true);
    setError("");
    try {
      const issuer = await loadIssuer();
      const quote = { issuer, customer, issued, lines: items.map(line => ({ ...line, unitPrice: line.unitPrice! })), note: note.trim() };
      const image = await createQuoteImage(quote);
      if (!alive.current) return;
      const filename = (customer + "_견적서_" + issued).replace(/[\\/:*?"<>|]/g, "_") + ".png";
      const file = new File([image], filename, { type: "image/png" });
      setOutput({ file, url: URL.createObjectURL(file), total: quoteTotal(quote.lines) });
    } catch (err) {
      if (alive.current) setError(err instanceof Error ? err.message : "견적서 이미지를 만들지 못했어요. 다시 시도해 주세요.");
    } finally {
      lock.current = false;
      if (alive.current) setBusy(false);
    }
  }
  async function share() {
    if (!output) return;
    setError("");
    try { await navigator.share({ files: [output.file] }); }
    catch (err) {
      if (!(err instanceof Error && err.name === "AbortError")) setError("공유 창을 열지 못했어요. 이미지 저장을 이용해 주세요.");
    }
  }
  return <dialog ref={dialog} className={s.dialog} aria-labelledby={title} onCancel={event => { event.preventDefault(); event.stopPropagation(); close(); }}>
    <div className={s.body}>
      <header className={s.header}>
        <div><h2 id={title} ref={previewTitle} tabIndex={-1}>{output ? "견적서 미리보기" : "견적서 만들기"}</h2>
          <p>{customer} 고객님</p></div>
        <button type="button" className={s.close} onClick={close} aria-label="견적서 닫기">×</button>
      </header>
      {output ? <>
        <div className={s.paper}>
          {/* The preview and download use the exact same locally generated PNG. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={output.url} alt={customer + " 고객님 견적서, 총 " + won(output.total)} />
        </div>
        {error && <p className={s.error} role="alert">{error}</p>}
        <div className={s.actions}>
          <button type="button" className={s.secondary} onClick={() => { setOutput(null); setError(""); requestAnimationFrame(() => generateButton.current?.focus()); }}>수정</button>
          {canShare && <button type="button" className={s.secondary} onClick={share}>이미지 공유</button>}
          <a className={s.primary} href={output.url} download={output.file.name}>이미지 저장</a>
        </div>
      </> : <form onSubmit={generate} className={s.form} aria-busy={busy} inert={busy}>
        <label className={s.field}>발행일<input type="date" required value={issued} onChange={e => setIssued(e.target.value)} /></label>
        <div className={s.items}>
          {lines.map((line, idx) => <fieldset className={s.line} key={line.id}>
            <legend>견적 품목 {idx + 1}</legend>
            <div className={s.nameRow}>
              <label className={s.field}>품목명<input required maxLength={100} value={line.name} onChange={e => edit(line.id, { name: e.target.value })} /></label>
              {lines.length > 1 && <button type="button" className={s.remove} aria-label={(idx + 1) + "번째 품목 삭제"}
                onClick={() => setLines(current => current.filter(row => row.id !== line.id))}>삭제</button>}
            </div>
            <div className={s.numbers}>
              <label className={s.field}>수량<input type="number" required inputMode="numeric" min="1" max="9999" step="1"
                value={line.quantity} onChange={e => edit(line.id, { quantity: e.target.value })} /></label>
              <label className={s.field}>단가 (원)<input type="text" required inputMode="numeric" maxLength={17} placeholder="예) 150,000"
                value={line.rate} onChange={e => edit(line.id, { rate: e.target.value })}
                onBlur={() => { const n = readWon(line.rate); if (n !== null) edit(line.id, { rate: n.toLocaleString("ko-KR") }); }} /></label>
            </div>
          </fieldset>)}
          {lines.length < maxQuoteLines && <button type="button" className={s.add}
            onClick={() => setLines([...lines, { id: nextId.current++, name: "", quantity: "1", rate: "" }])}>+ 품목 추가</button>}
        </div>
        <label className={s.field}>고객 안내 <small>선택</small>
          <textarea maxLength={420} rows={2} value={note} placeholder="작업 범위나 견적에 포함된 내용을 적어 주세요." onChange={e => setNote(e.target.value)} />
        </label>
        <div className={s.total}><span>총 견적 금액</span><strong>{total === null ? "—" : won(total)}</strong></div>
        {error && <p className={s.error} role="alert">{error}</p>}
        <button ref={generateButton} className={s.primary} type="submit" disabled={busy}>{busy ? "이미지 만드는 중…" : "견적서 미리보기"}</button>
      </form>}
    </div>
  </dialog>;
}

export default function QuoteAction(props: Props) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  return <>
    <button type="button" ref={trigger} className={s.trigger} disabled={props.disabled} aria-haspopup="dialog" onClick={() => setOpen(true)}>견적서 만들기</button>
    {open && <QuoteEditor {...props} close={() => { setOpen(false); requestAnimationFrame(() => trigger.current?.focus()); }} />}
  </>;
}
