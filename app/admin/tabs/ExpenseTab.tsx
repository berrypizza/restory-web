"use client";

import { useId, useRef, useState } from "react";
import JobDialog from "../components/JobDialog";
import { formatYearMonth, getSupabase } from "../lib/utils";
import {
  categories,
  expenseAmount,
  expenseGroups,
  expenseNames,
  won,
  type ExpenseGroup,
  type ExpenseRow,
} from "../lib/settlement";
import s from "./reporting.module.css";
import f from "./settlement.module.css";

export type ExpenseFilter = ExpenseGroup | "all";

type Draft = { amount: string; memo: string; id?: string; group?: ExpenseGroup; category?: string };
const blankDraft: Draft = { amount: "", memo: "" };
const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul",
  month: "long",
  day: "numeric",
});
function dateLabel(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "날짜 미상" : dateFormatter.format(date);
}

export function ExpenseEditor({
  open,
  onClose,
  month,
  rows,
  initialGroup,
  initialCategory,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  month: string;
  rows: ExpenseRow[] | null;
  initialGroup: ExpenseGroup;
  initialCategory: string;
  onSaved: (notice: string) => void;
}) {
  const title = useId();
  const categoryId = useId();
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [busy, setBusy] = useState(false);
  const pending = useRef(false);
  const [error, setError] = useState("");
  const [conflict, setConflict] = useState(false);
  const draft = drafts[month] ?? blankDraft;
  const group = draft.group ?? initialGroup;
  const category = draft.category ?? initialCategory;
  const amount = Number(draft.amount);
  const choices = [
    ...new Set([
      ...categories[group],
      ...(rows ?? []).filter((row) => row.group_key === group).map((row) => row.category),
      category,
    ]),
  ];
  function edit(update: Partial<Draft>) {
    setDrafts((prev) => ({
      ...prev,
      [month]: { ...blankDraft, ...prev[month], group, category, ...update },
    }));
    setError("");
  }
  function dismiss() {
    if (pending.current) return;
    if (conflict) {
      clearDraft();
      setConflict(false);
      onSaved("먼저 저장된 내역을 장부에 반영했어요.");
    }
    setError("");
    onClose();
  }
  function clearDraft() {
    setDrafts((prev) => {
      const next = { ...prev };
      delete next[month];
      return next;
    });
  }
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!Number.isSafeInteger(amount) || amount < 1 || amount > 2147483647) {
      setError("1원에서 2,147,483,647원 사이의 금액을 입력해 주세요.");
      return;
    }
    if (pending.current || conflict || !rows) return;
    pending.current = true;
    setBusy(true);
    setError("");
    const id = draft.id ?? crypto.randomUUID();
    edit({ id });
    const payload = {
      id,
      expense_month: month,
      group_key: group,
      category,
      amount,
      memo: draft.memo.trim() || null,
    };
    try {
      const db = getSupabase();
      const { error: writeError } = await db.from("business_expenses").insert(payload);
      if (writeError) {
        if (writeError.code !== "23505") throw writeError;
        // A response may be interrupted after the insert has already committed.
        const { data: prior, error: readError } = await db
          .from("business_expenses")
          .select("expense_month,group_key,category,amount,memo")
          .eq("id", id)
          .maybeSingle();
        if (readError || !prior) throw writeError;
        if (
          prior.expense_month !== month ||
          prior.group_key !== group ||
          prior.category !== category ||
          prior.amount !== amount ||
          prior.memo !== payload.memo
        ) {
          setError(
            "먼저 저장한 금액은 " + won(prior.amount) + "이에요. 창을 닫고 장부에서 확인해 주세요.",
          );
          setConflict(true);
          return;
        }
      }
      clearDraft();
      onClose();
      onSaved(`${category} 비용 ${won(amount)}을 추가했어요.`);
    } catch {
      setError("비용을 저장하지 못했어요. 입력한 내용으로 다시 시도할 수 있어요.");
    } finally {
      pending.current = false;
      setBusy(false);
    }
  }
  if (!open) return null;
  return (
    <JobDialog labelledBy={title} onClose={dismiss} busy={busy}>
      <form className={f.editor} onSubmit={submit}>
        <div className={f.editorHead}>
          <div>
            <p>{formatYearMonth(month)}</p>
            <h2 id={title}>비용 추가</h2>
          </div>
          <button type="button" className={s.secondaryAction} onClick={dismiss} disabled={busy}>
            닫기
          </button>
        </div>
        <label className={f.moneyField}>
          금액 (원)
          <input
            inputMode="numeric"
            autoFocus
            autoComplete="off"
            placeholder="0"
            required
            disabled={busy || conflict}
            value={draft.amount ? Number(draft.amount).toLocaleString("ko-KR") : ""}
            onChange={(e) => edit({ amount: e.target.value.replace(/[^0-9]/g, "").slice(0, 11) })}
          />
        </label>
        <fieldset className={f.categoryField} disabled={busy || conflict}>
          <legend>비용 분류</legend>
          <div className={f.segment}>
            {expenseGroups.map((item) => (
              <button
                type="button"
                key={item}
                aria-pressed={group === item}
                onClick={() => {
                  edit({ group: item, category: categories[item][0] });
                }}
              >
                {expenseNames[item]}
              </button>
            ))}
          </div>
        </fieldset>
        <div className={f.editorField}>
          <label htmlFor={categoryId}>항목</label>
          <select
            id={categoryId}
            value={category}
            disabled={busy || conflict}
            onChange={(e) => {
              edit({ group, category: e.target.value });
            }}
          >
            {choices.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
        <label>
          메모 (선택)
          <input
            value={draft.memo}
            disabled={busy || conflict}
            placeholder="거래처 또는 사용처"
            onChange={(e) => edit({ memo: e.target.value })}
          />
        </label>
        {error && (
          <p role="alert" className={s.feedback}>
            {error}
          </p>
        )}
        <button className={s.primaryAction} disabled={busy || conflict || !rows || !amount}>
          {busy ? "저장 중…" : "비용 저장"}
        </button>
      </form>
    </JobDialog>
  );
}

export default function ExpenseTab({
  rows,
  group,
  category,
  onFilter,
  onRemoved,
  onStale,
}: {
  rows: ExpenseRow[];
  group: ExpenseFilter;
  category: string;
  onFilter: (group: ExpenseFilter, category: string) => void;
  onRemoved: (message: string) => void;
  onStale: () => void;
}) {
  const [limit, setLimit] = useState(20);
  const [removing, setRemoving] = useState("");
  const [error, setError] = useState("");
  const grouped = group === "all" ? rows : rows.filter((row) => row.group_key === group);
  const choices = [...new Set(grouped.map((row) => row.category))].sort((a, b) =>
    a.localeCompare(b, "ko"),
  );
  const activeCategory = choices.includes(category) ? category : "";
  const filtered = activeCategory ? grouped.filter((row) => row.category === activeCategory) : grouped;
  function filter(next: ExpenseFilter, nextCategory: string) {
    setLimit(20);
    setError("");
    onFilter(next, nextCategory);
  }
  async function remove(row: ExpenseRow) {
    if (removing || !window.confirm(`${row.category} 비용 ${won(row.amount)}을 삭제할까요?`)) return;
    setRemoving(row.id);
    setError("");
    try {
      const { data, error: writeError } = await getSupabase()
        .from("business_expenses")
        .delete()
        .eq("id", row.id)
        .eq("expense_month", row.expense_month)
        .select("id");
      if (writeError) throw writeError;
      if (!data?.length) {
        onStale();
        return;
      }
      onRemoved(`${row.category} 비용 ${won(row.amount)}을 삭제했어요.`);
    } catch {
      setError("내역을 삭제하지 못했어요. 다시 시도해 주세요.");
    } finally {
      setRemoving("");
    }
  }
  return (
    <section className={s.panel}>
      <div className={s.panelHeader}>
        <h2>비용 내역</h2>
        <span className={f.dim}>최근 입력순</span>
      </div>
      <div className={f.listFilters}>
        <div className={f.segment} role="group" aria-label="비용 분류 필터">
          {(["all", ...expenseGroups] as const).map((item) => (
            <button
              type="button"
              key={item}
              aria-pressed={group === item}
              onClick={() => filter(item, "")}
            >
              {item === "all" ? "전체" : expenseNames[item]}
            </button>
          ))}
        </div>
        {choices.length > 0 && (
          <select
            className={f.select}
            aria-label="비용 항목 필터"
            value={activeCategory}
            onChange={(e) => filter(group, e.target.value)}
          >
            <option value="">전체 항목</option>
            {choices.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        )}
      </div>
      <div className={f.ledgerTotal}>
        <span>
          {group === "all" ? "전체" : expenseNames[group]} {activeCategory} · {filtered.length}건
        </span>
        <strong>{won(expenseAmount(filtered))}</strong>
      </div>
      {error && (
        <p role="alert" className={s.feedback}>
          {error}
        </p>
      )}
      {!filtered.length ? (
        <p className={s.empty}>
          {rows.length ? "선택한 조건의 비용이 없어요." : "이달에 입력된 비용이 없어요."}
        </p>
      ) : (
        <ul className={s.list}>
          {filtered.slice(0, limit).map((row) => (
            <li key={row.id} className={f.entry}>
              <div className={f.entryMain}>
                <strong>{row.category}</strong>
                <p className={s.muted}>
                  {dateLabel(row.created_at)} · {expenseNames[row.group_key]}
                </p>
                {row.memo && <p className={f.entryMemo}>{row.memo}</p>}
              </div>
              <div className={f.entryAmount}>
                <b>{won(row.amount)}</b>
                <button
                  type="button"
                  disabled={Boolean(removing)}
                  onClick={() => void remove(row)}
                  aria-label={`${row.category} ${won(row.amount)} 내역 삭제`}
                >
                  {removing === row.id ? "삭제 중" : "삭제"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {limit < filtered.length && (
        <button type="button" className={s.secondaryAction} onClick={() => setLimit((n) => n + 20)}>
          내역 더 보기
        </button>
      )}
    </section>
  );
}
