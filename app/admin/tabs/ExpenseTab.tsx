"use client";

import { useEffect, useMemo, useState } from "react";
import type { Job } from "../lib/types";
import { formatYearMonth, getSupabase } from "../lib/utils";

type ExpenseGroup = "material" | "labor" | "marketing";

type ExpenseItem = {
  group: ExpenseGroup;
  category: string;
  label: string;
  helper: string;
};

type ExpenseDraft = Record<string, { amount: number; memo: string }>;
type ExpenseEntries = Record<string, BusinessExpenseRow[]>;

type BusinessExpenseRow = {
  id: string;
  expense_month: string;
  group_key: ExpenseGroup;
  category: string;
  amount: number | null;
  memo: string | null;
  created_at: string;
  updated_at: string | null;
};

interface ExpenseTabProps {
  monthFilter: string;
  setMonthFilter: (v: string) => void;
  doneMonth: Job[];
  revenue: number;
  isAdmin: boolean;
}

const EXPENSE_ITEMS: ExpenseItem[] = [
  { group: "material", category: "지엔", label: "지엔", helper: "공장/문짝" },
  {
    group: "material",
    category: "스폰지",
    label: "스폰지",
    helper: "폼/충전재",
  },
  { group: "material", category: "가죽", label: "가죽", helper: "원단/가죽" },
  { group: "material", category: "기타", label: "기타", helper: "부자재" },
  {
    group: "marketing",
    category: "네이버",
    label: "네이버",
    helper: "검색/플레이스",
  },
  { group: "marketing", category: "메타", label: "메타", helper: "페북/인스타" },
  { group: "labor", category: "팀장", label: "팀장", helper: "현장/관리" },
  { group: "labor", category: "기사", label: "기사", helper: "시공 인력" },
  { group: "labor", category: "외주", label: "외주", helper: "외부 작업" },
  { group: "labor", category: "기타", label: "기타", helper: "식대/추가 인건" },
];

const EXPENSE_GROUPS: ExpenseGroup[] = ["material", "labor", "marketing"];

const GROUP_META: Record<
  ExpenseGroup,
  { title: string; subtitle: string; color: string; softBg: string }
> = {
  material: {
    title: "자재비",
    subtitle: "지엔, 스폰지, 가죽, 기타",
    color: "#1f66ff",
    softBg: "#eff6ff",
  },
  labor: {
    title: "인건비",
    subtitle: "팀장, 기사, 외주, 기타",
    color: "#0f766e",
    softBg: "#ecfdf5",
  },
  marketing: {
    title: "마케팅비",
    subtitle: "네이버, 메타",
    color: "#8b5cf6",
    softBg: "#f5f3ff",
  },
};

function expenseKey(item: Pick<ExpenseItem, "group" | "category">) {
  return `${item.group}:${item.category}`;
}

function emptyDraft(): ExpenseDraft {
  return EXPENSE_ITEMS.reduce<ExpenseDraft>((acc, item) => {
    acc[expenseKey(item)] = { amount: 0, memo: "" };
    return acc;
  }, {});
}

function emptyEntries(): ExpenseEntries {
  return EXPENSE_ITEMS.reduce<ExpenseEntries>((acc, item) => {
    acc[expenseKey(item)] = [];
    return acc;
  }, {});
}

function toAmount(value: string) {
  return Number(value.replace(/[^\d]/g, "")) || 0;
}

function formatWon(value: number) {
  return `${value.toLocaleString("ko-KR")}원`;
}

function rate(value: number, base: number) {
  if (base <= 0) return 0;
  return Math.round((value / base) * 1000) / 10;
}

function shortDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("ko-KR", {
    month: "numeric",
    day: "numeric",
  });
}

export default function ExpenseTab({
  monthFilter,
  setMonthFilter,
  doneMonth,
  revenue,
  isAdmin,
}: ExpenseTabProps) {
  const [activeGroup, setActiveGroup] = useState<ExpenseGroup>("material");
  const [draft, setDraft] = useState<ExpenseDraft>(() => emptyDraft());
  const [rows, setRows] = useState<BusinessExpenseRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [tableError, setTableError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const loadExpenses = async () => {
    if (!isAdmin) return;
    setLoading(true);
    setTableError(null);

    const { data, error } = await getSupabase()
      .from("business_expenses")
      .select("*")
      .eq("expense_month", monthFilter)
      .order("created_at", { ascending: false });

    if (error) {
      setTableError(error.message);
      setRows([]);
      setLoading(false);
      return;
    }

    setRows(
      ((data as BusinessExpenseRow[] | null) ?? []).filter(
        (row) => (row.amount || 0) > 0,
      ),
    );
    setLoading(false);
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadExpenses();
    }, 0);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthFilter, isAdmin]);

  const entries = useMemo(() => {
    const next = emptyEntries();
    rows.forEach((row) => {
      const key = expenseKey({
        group: row.group_key,
        category: row.category,
      });
      if (!next[key]) return;
      next[key].push(row);
    });
    return next;
  }, [rows]);

  const totals = useMemo(() => {
    const material = rows
      .filter((row) => row.group_key === "material")
      .reduce((sum, row) => sum + (row.amount || 0), 0);
    const labor = rows
      .filter((row) => row.group_key === "labor")
      .reduce((sum, row) => sum + (row.amount || 0), 0);
    const marketing = rows
      .filter((row) => row.group_key === "marketing")
      .reduce((sum, row) => sum + (row.amount || 0), 0);
    const totalExpense = material + labor + marketing;
    const profit = revenue - totalExpense;

    return {
      material,
      labor,
      marketing,
      totalExpense,
      profit,
      expenseRate: rate(totalExpense, revenue),
      profitRate: rate(profit, revenue),
    };
  }, [rows, revenue]);

  const groupTotal = (group: ExpenseGroup) =>
    rows
      .filter((row) => row.group_key === group)
      .reduce((sum, row) => sum + (row.amount || 0), 0);

  const changeMonth = (delta: number) => {
    const d = new Date(monthFilter + "-01");
    d.setMonth(d.getMonth() + delta);
    setMonthFilter(d.toISOString().slice(0, 7));
  };

  const updateDraft = (
    key: string,
    patch: Partial<{ amount: number; memo: string }>,
  ) => {
    setDraft((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        ...patch,
      },
    }));
  };

  const addExpense = async (item: ExpenseItem) => {
    const key = expenseKey(item);
    const row = draft[key] ?? { amount: 0, memo: "" };
    if (row.amount <= 0) return;

    setSavingKey(key);
    setTableError(null);

    const { error } = await getSupabase().from("business_expenses").insert({
      expense_month: monthFilter,
      group_key: item.group,
      category: item.category,
      amount: row.amount,
      memo: row.memo.trim() || null,
    });

    if (error) {
      setTableError(error.message);
      setSavingKey(null);
      return;
    }

    updateDraft(key, { amount: 0, memo: "" });
    setSavedAt(new Date().toLocaleTimeString("ko-KR", { hour12: false }));
    setSavingKey(null);
    loadExpenses();
  };

  const removeExpense = async (row: BusinessExpenseRow) => {
    if (!window.confirm(`${formatWon(row.amount || 0)} 내역을 삭제할까요?`))
      return;

    setSavingKey(row.id);
    setTableError(null);

    const { error } = await getSupabase()
      .from("business_expenses")
      .delete()
      .eq("id", row.id);

    if (error) {
      setTableError(error.message);
      setSavingKey(null);
      return;
    }

    setRows((prev) => prev.filter((item) => item.id !== row.id));
    setSavingKey(null);
  };

  const summaryCards = [
    {
      label: "매출",
      value: revenue,
      sub: `${doneMonth.length}건 완료`,
      color: "#1f66ff",
    },
    {
      label: "총 비용",
      value: totals.totalExpense,
      sub: `비용률 ${totals.expenseRate}%`,
      color: "#ef4444",
    },
    {
      label: totals.profit >= 0 ? "남은 금액" : "초과 지출",
      value: totals.profit,
      sub: `순이익률 ${totals.profitRate}%`,
      color: totals.profit >= 0 ? "#16a34a" : "#ef4444",
    },
  ];

  const activeItems = EXPENSE_ITEMS.filter(
    (item) => item.group === activeGroup,
  );
  const activeMeta = GROUP_META[activeGroup];

  if (!isAdmin) {
    return (
      <div
        className="rounded-2xl p-5 text-center"
        style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb" }}>
        <p className="text-sm font-bold" style={{ color: "#111827" }}>
          관리자만 비용을 확인할 수 있어요.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div
        className="flex items-center justify-between rounded-2xl p-1.5"
        style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb" }}>
        <button
          onClick={() => changeMonth(-1)}
          className="px-4 py-2 rounded-xl text-xl font-bold"
          style={{ color: "#111827" }}>
          ‹
        </button>
        <div className="text-center">
          <p className="text-xs font-bold" style={{ color: "#94a3b8" }}>
            비용 장부
          </p>
          <span className="text-base font-black" style={{ color: "#111827" }}>
            {formatYearMonth(monthFilter)}
          </span>
        </div>
        <button
          onClick={() => changeMonth(1)}
          className="px-4 py-2 rounded-xl text-xl font-bold"
          style={{ color: "#111827" }}>
          ›
        </button>
      </div>

      {tableError && (
        <div
          className="rounded-2xl p-4 text-sm"
          style={{
            backgroundColor: "#fff7ed",
            border: "1px solid #fed7aa",
            color: "#9a3412",
          }}>
          <p className="font-bold mb-1">Supabase 비용 테이블 확인 필요</p>
          <p>
            `docs/admin-business-expenses.sql`을 Supabase SQL Editor에서 다시
            실행하면 저장이 가능해요.
          </p>
        </div>
      )}

      <section
        className="rounded-2xl p-5"
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #e5e7eb",
          boxShadow: "0 8px 24px rgba(15,23,42,0.05)",
        }}>
        <div className="flex items-start justify-between gap-3 mb-5">
          <div>
            <p className="text-xs font-bold mb-1" style={{ color: "#94a3b8" }}>
              이번 달 손익
            </p>
            <p
              className="text-3xl font-black leading-tight"
              style={{ color: totals.profit >= 0 ? "#111827" : "#ef4444" }}>
              {formatWon(totals.profit)}
            </p>
          </div>
          <span
            className="text-xs font-black px-3 py-1.5 rounded-full"
            style={{
              color: totals.profit >= 0 ? "#16a34a" : "#ef4444",
              backgroundColor: totals.profit >= 0 ? "#dcfce7" : "#fef2f2",
            }}>
            {totals.profitRate}%
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-5">
          {summaryCards.map((card) => (
            <div
              key={card.label}
              className="rounded-xl p-3"
              style={{ backgroundColor: "#f8fafc" }}>
              <p
                className="text-[11px] font-bold mb-1"
                style={{ color: "#64748b" }}>
                {card.label}
              </p>
              <p
                className="text-sm font-black leading-snug break-keep"
                style={{ color: card.color }}>
                {formatWon(card.value)}
              </p>
              <p className="text-[11px] mt-1" style={{ color: "#94a3b8" }}>
                {card.sub}
              </p>
            </div>
          ))}
        </div>

        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-bold" style={{ color: "#64748b" }}>
            매출 대비 비용률
          </span>
          <span className="text-xs font-black" style={{ color: "#111827" }}>
            {totals.expenseRate}%
          </span>
        </div>
        <div
          className="h-2.5 rounded-full overflow-hidden"
          style={{ backgroundColor: "#e5e7eb" }}>
          <div
            className="h-full rounded-full"
            style={{
              width: `${Math.min(totals.expenseRate, 100)}%`,
              background: "linear-gradient(to right, #1f66ff, #8b5cf6)",
            }}
          />
        </div>
      </section>

      <div
        className="grid grid-cols-3 gap-2 rounded-2xl p-1"
        style={{ backgroundColor: "#e9eef7" }}>
        {EXPENSE_GROUPS.map((group) => {
          const meta = GROUP_META[group];
          const selected = activeGroup === group;
          return (
            <button
              key={group}
              onClick={() => setActiveGroup(group)}
              className="rounded-xl px-3 py-3 text-left"
              style={{
                backgroundColor: selected ? "#ffffff" : "transparent",
                boxShadow: selected ? "0 4px 14px rgba(15,23,42,0.08)" : "none",
              }}>
              <span
                className="block text-xs font-bold"
                style={{ color: selected ? meta.color : "#64748b" }}>
                {meta.title}
              </span>
              <span
                className="block text-sm font-black mt-1"
                style={{ color: selected ? "#111827" : "#64748b" }}>
                {formatWon(groupTotal(group))}
              </span>
            </button>
          );
        })}
      </div>

      <section
        className="rounded-2xl"
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #cbd5e1",
          boxShadow: "0 10px 28px rgba(15,23,42,0.06)",
          overflow: "hidden",
        }}>
        <div
          className="px-5 py-4"
          style={{
            backgroundColor: activeMeta.softBg,
            borderBottom: "1px solid #dbe4f0",
          }}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-black" style={{ color: "#111827" }}>
                {activeMeta.title}
              </h2>
              <p className="text-sm mt-1 font-bold" style={{ color: "#64748b" }}>
                {activeMeta.subtitle}
              </p>
            </div>
            <span
              className="text-base font-black px-3 py-1 rounded-full"
              style={{
                color: activeMeta.color,
                backgroundColor: "#ffffff",
                border: "1px solid #dbe4f0",
              }}>
              {formatWon(groupTotal(activeGroup))}
            </span>
          </div>
        </div>

        <div className="flex flex-col">
          {activeItems.map((item, index) => {
            const key = expenseKey(item);
            const draftRow = draft[key] ?? { amount: 0, memo: "" };
            const itemEntries = entries[key] ?? [];
            const itemTotal = itemEntries.reduce(
              (sum, row) => sum + (row.amount || 0),
              0,
            );
            const isSaving = savingKey === key;

            return (
              <div
                key={key}
                className="px-5 py-6"
                style={{
                  borderTop: index > 0 ? "1px solid #dbe4f0" : "none",
                }}>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <p className="text-lg font-black" style={{ color: "#111827" }}>
                      {item.label}
                    </p>
                    <p className="text-sm mt-1 font-bold" style={{ color: "#64748b" }}>
                      {item.helper} · {itemEntries.length}건
                    </p>
                  </div>
                  <span
                    className="text-lg font-black text-right"
                    style={{ color: itemTotal > 0 ? activeMeta.color : "#64748b" }}>
                    {formatWon(itemTotal)}
                  </span>
                </div>

                <div className="flex flex-col gap-2.5 mb-4">
                  <label className="text-sm font-black" style={{ color: "#334155" }}>
                    추가할 금액
                  </label>
                  <input
                    inputMode="numeric"
                    value={
                      draftRow.amount ? draftRow.amount.toLocaleString("ko-KR") : ""
                    }
                    onChange={(e) =>
                      updateDraft(key, {
                        amount: toAmount(e.target.value),
                      })
                    }
                    placeholder="금액"
                    className="w-full rounded-xl px-4 py-3.5 text-right text-xl font-black placeholder:text-slate-500"
                    style={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #cbd5e1",
                      color: "#111827",
                      outline: "none",
                      boxShadow: "inset 0 1px 2px rgba(15,23,42,0.04)",
                    }}
                  />
                  <input
                    value={draftRow.memo}
                    onChange={(e) => updateDraft(key, { memo: e.target.value })}
                    placeholder="메모 선택 입력"
                    className="w-full rounded-xl px-4 py-3.5 text-base font-bold placeholder:text-slate-500"
                    style={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #dbe4f0",
                      color: "#334155",
                      outline: "none",
                    }}
                  />
                  <button
                    onClick={() => addExpense(item)}
                    disabled={draftRow.amount <= 0 || Boolean(savingKey)}
                    className="w-full rounded-xl py-3.5 text-base font-black"
                    style={{
                      backgroundColor:
                        draftRow.amount > 0 && !savingKey
                          ? activeMeta.color
                          : "#cbd5e1",
                      color: "white",
                    }}>
                    {isSaving ? "추가 중..." : `${item.label} 비용 추가`}
                  </button>
                </div>

                {itemEntries.length === 0 ? (
                  <div
                    className="rounded-xl px-4 py-3.5 text-base font-bold"
                    style={{
                      backgroundColor: "#f8fafc",
                      border: "1px solid #dbe4f0",
                      color: "#64748b",
                    }}>
                    아직 추가된 내역이 없어요.
                  </div>
                ) : (
                  <div
                    className="flex flex-col gap-2"
                    style={{
                      maxHeight: itemEntries.length > 4 ? 240 : "none",
                      overflowY: itemEntries.length > 4 ? "auto" : "visible",
                    }}>
                    {itemEntries.map((row) => (
                      <div
                        key={row.id}
                        className="flex items-center justify-between gap-3 rounded-xl px-4 py-3.5"
                        style={{
                          backgroundColor: "#ffffff",
                          border: "1px solid #dbe4f0",
                          boxShadow: "0 3px 10px rgba(15,23,42,0.04)",
                        }}>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              className="text-lg font-black"
                              style={{ color: "#111827" }}>
                              {formatWon(row.amount || 0)}
                            </span>
                            <span
                              className="text-sm font-black"
                              style={{ color: "#64748b" }}>
                              {shortDate(row.created_at)}
                            </span>
                          </div>
                          {row.memo && (
                            <p
                              className="text-sm font-bold truncate mt-1"
                              style={{ color: "#475569" }}>
                              {row.memo}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => removeExpense(row)}
                          disabled={Boolean(savingKey)}
                          className="text-sm font-black px-3 py-2 rounded-lg"
                          style={{
                            color: "#ef4444",
                            backgroundColor: "#fef2f2",
                            border: "1px solid #fee2e2",
                            flexShrink: 0,
                          }}>
                          삭제
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {loading && (
        <p className="text-center text-xs" style={{ color: "#94a3b8" }}>
          불러오는 중...
        </p>
      )}

      {savedAt && (
        <p className="text-center text-xs" style={{ color: "#94a3b8" }}>
          {savedAt} 추가됨
        </p>
      )}
    </div>
  );
}
