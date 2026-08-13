"use client";

import { useEffect, useMemo, useState } from "react";
import type { Job } from "../lib/types";
import { formatPrice, formatYearMonth, getSupabase } from "../lib/utils";

type ExpenseGroup = "material" | "marketing";

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
];

const GROUP_META: Record<
  ExpenseGroup,
  { title: string; subtitle: string; color: string }
> = {
  material: {
    title: "자재비",
    subtitle: "지엔, 스폰지, 가죽, 기타",
    color: "#1f66ff",
  },
  marketing: {
    title: "마케팅비",
    subtitle: "네이버, 메타",
    color: "#8b5cf6",
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

    setRows((data as BusinessExpenseRow[] | null) ?? []);
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
    const marketing = rows
      .filter((row) => row.group_key === "marketing")
      .reduce((sum, row) => sum + (row.amount || 0), 0);
    const totalExpense = material + marketing;
    const profit = revenue - totalExpense;

    return {
      material,
      marketing,
      totalExpense,
      profit,
      expenseRate: rate(totalExpense, revenue),
      profitRate: rate(profit, revenue),
    };
  }, [rows, revenue]);

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
    if (!window.confirm(`${formatPrice(row.amount || 0)} 내역을 삭제할까요?`))
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
      label: "자재비",
      value: totals.material,
      sub: `${rate(totals.material, revenue)}%`,
      color: "#0f766e",
    },
    {
      label: "마케팅비",
      value: totals.marketing,
      sub: `${rate(totals.marketing, revenue)}%`,
      color: "#8b5cf6",
    },
    {
      label: "순이익",
      value: totals.profit,
      sub: `${totals.profitRate}%`,
      color: totals.profit >= 0 ? "#16a34a" : "#ef4444",
    },
  ];

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
    <div className="flex flex-col gap-4">
      <div
        className="flex items-center justify-between rounded-xl p-1.5"
        style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb" }}>
        <button
          onClick={() => changeMonth(-1)}
          className="px-4 py-2 rounded-lg text-xl font-bold"
          style={{ color: "#111827" }}>
          ‹
        </button>
        <span className="text-sm font-bold" style={{ color: "#111827" }}>
          {formatYearMonth(monthFilter)}
        </span>
        <button
          onClick={() => changeMonth(1)}
          className="px-4 py-2 rounded-lg text-xl font-bold"
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

      <div className="grid grid-cols-2 gap-3">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl p-4"
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
            }}>
            <p
              className="text-xs mb-2 font-medium"
              style={{ color: "#64748b" }}>
              {card.label}
            </p>
            <p className="text-xl font-black" style={{ color: card.color }}>
              {formatPrice(card.value)}
            </p>
            <p className="text-xs mt-1" style={{ color: "#94a3b8" }}>
              {card.sub}
            </p>
          </div>
        ))}
      </div>

      <div
        className="rounded-2xl p-4"
        style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb" }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold" style={{ color: "#111827" }}>
            총 비용
          </span>
          <span className="text-sm font-black" style={{ color: "#ef4444" }}>
            {formatPrice(totals.totalExpense)}
          </span>
        </div>
        <div
          className="h-3 rounded-full overflow-hidden"
          style={{ backgroundColor: "#e5e7eb" }}>
          <div
            className="h-full"
            style={{
              width: `${Math.min(totals.expenseRate, 100)}%`,
              background: "linear-gradient(to right, #1f66ff, #8b5cf6)",
            }}
          />
        </div>
        <div
          className="flex items-center justify-between text-xs mt-2"
          style={{ color: "#64748b" }}>
          <span>매출 대비 비용률</span>
          <span className="font-bold">{totals.expenseRate}%</span>
        </div>
      </div>

      {(["material", "marketing"] as const).map((group) => {
        const meta = GROUP_META[group];
        const items = EXPENSE_ITEMS.filter((item) => item.group === group);
        const groupTotal = rows
          .filter((row) => row.group_key === group)
          .reduce((sum, row) => sum + (row.amount || 0), 0);

        return (
          <section
            key={group}
            className="rounded-2xl p-4"
            style={{
              backgroundColor: "#ffffff",
              border: `1px solid ${meta.color}22`,
            }}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2
                  className="text-base font-black"
                  style={{ color: "#111827" }}>
                  {meta.title}
                </h2>
                <p className="text-xs mt-1" style={{ color: "#94a3b8" }}>
                  {meta.subtitle}
                </p>
              </div>
              <span
                className="text-sm font-black px-3 py-1 rounded-full"
                style={{
                  color: meta.color,
                  backgroundColor: meta.color + "14",
                }}>
                {formatPrice(groupTotal)}
              </span>
            </div>

            <div className="flex flex-col gap-5">
              {items.map((item) => {
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
                    style={{
                      borderTop: "1px solid #f1f5f9",
                      paddingTop: 16,
                    }}>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <p
                          className="text-sm font-bold"
                          style={{ color: "#111827" }}>
                          {item.label}
                        </p>
                        <p className="text-xs" style={{ color: "#94a3b8" }}>
                          {item.helper}
                        </p>
                      </div>
                      <span
                        className="text-xs font-black px-2.5 py-1 rounded-full"
                        style={{
                          color: meta.color,
                          backgroundColor: meta.color + "12",
                        }}>
                        {formatPrice(itemTotal)}
                      </span>
                    </div>

                    <div
                      className="grid gap-2 mb-3"
                      style={{ gridTemplateColumns: "minmax(0, 1fr) 76px" }}>
                      <div className="flex flex-col gap-2">
                        <input
                          inputMode="numeric"
                          value={
                            draftRow.amount
                              ? draftRow.amount.toLocaleString()
                              : ""
                          }
                          onChange={(e) =>
                            updateDraft(key, {
                              amount: toAmount(e.target.value),
                            })
                          }
                          placeholder="금액"
                          className="w-full rounded-xl px-3 py-2.5 text-right text-sm font-bold"
                          style={{
                            backgroundColor: "#f8fafc",
                            border: "1px solid #e5e7eb",
                            color: "#111827",
                            outline: "none",
                          }}
                        />
                        <input
                          value={draftRow.memo}
                          onChange={(e) =>
                            updateDraft(key, { memo: e.target.value })
                          }
                          placeholder="메모"
                          className="w-full rounded-xl px-3 py-2 text-xs"
                          style={{
                            backgroundColor: "#ffffff",
                            border: "1px solid #eef2f7",
                            color: "#64748b",
                            outline: "none",
                          }}
                        />
                      </div>
                      <button
                        onClick={() => addExpense(item)}
                        disabled={draftRow.amount <= 0 || Boolean(savingKey)}
                        className="rounded-xl text-sm font-black"
                        style={{
                          backgroundColor:
                            draftRow.amount > 0 && !savingKey
                              ? meta.color
                              : "#cbd5e1",
                          color: "white",
                        }}>
                        {isSaving ? "저장" : "추가"}
                      </button>
                    </div>

                    {itemEntries.length === 0 ? (
                      <p className="text-xs" style={{ color: "#cbd5e1" }}>
                        추가 내역 없음
                      </p>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {itemEntries.map((row) => (
                          <div
                            key={row.id}
                            className="flex items-center justify-between gap-2 rounded-xl px-3 py-2"
                            style={{
                              backgroundColor: "#f8fafc",
                              border: "1px solid #eef2f7",
                            }}>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span
                                  className="text-sm font-black"
                                  style={{ color: "#111827" }}>
                                  {formatPrice(row.amount || 0)}
                                </span>
                                <span
                                  className="text-[11px]"
                                  style={{ color: "#94a3b8" }}>
                                  {shortDate(row.created_at)}
                                </span>
                              </div>
                              {row.memo && (
                                <p
                                  className="text-xs truncate"
                                  style={{ color: "#64748b" }}>
                                  {row.memo}
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() => removeExpense(row)}
                              disabled={Boolean(savingKey)}
                              className="text-xs font-bold px-2 py-1 rounded-lg"
                              style={{
                                color: "#ef4444",
                                backgroundColor: "#fef2f2",
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
        );
      })}

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
