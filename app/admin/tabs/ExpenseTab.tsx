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

type BusinessExpenseRow = {
  id: string;
  expense_month: string;
  group_key: ExpenseGroup;
  category: string;
  amount: number | null;
  memo: string | null;
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

function toAmount(value: string) {
  return Number(value.replace(/[^\d]/g, "")) || 0;
}

function rate(value: number, base: number) {
  if (base <= 0) return 0;
  return Math.round((value / base) * 1000) / 10;
}

export default function ExpenseTab({
  monthFilter,
  setMonthFilter,
  doneMonth,
  revenue,
  isAdmin,
}: ExpenseTabProps) {
  const [draft, setDraft] = useState<ExpenseDraft>(() => emptyDraft());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [tableError, setTableError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const loadExpenses = async () => {
    if (!isAdmin) return;
    setLoading(true);
    setTableError(null);

    const { data, error } = await getSupabase()
      .from("business_expenses")
      .select("*")
      .eq("expense_month", monthFilter);

    if (error) {
      setTableError(error.message);
      setDraft(emptyDraft());
      setLoading(false);
      return;
    }

    const next = emptyDraft();
    (data as BusinessExpenseRow[] | null)?.forEach((row) => {
      const key = expenseKey({
        group: row.group_key,
        category: row.category,
      });
      if (!next[key]) return;
      next[key] = {
        amount: row.amount ?? 0,
        memo: row.memo ?? "",
      };
    });

    setDraft(next);
    setLoading(false);
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadExpenses();
    }, 0);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthFilter, isAdmin]);

  const totals = useMemo(() => {
    const material = EXPENSE_ITEMS.filter((item) => item.group === "material")
      .map((item) => draft[expenseKey(item)]?.amount || 0)
      .reduce((sum, amount) => sum + amount, 0);

    const marketing = EXPENSE_ITEMS.filter(
      (item) => item.group === "marketing",
    )
      .map((item) => draft[expenseKey(item)]?.amount || 0)
      .reduce((sum, amount) => sum + amount, 0);

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
  }, [draft, revenue]);

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

  const saveExpenses = async () => {
    setSaving(true);
    setTableError(null);

    const payload = EXPENSE_ITEMS.map((item) => {
      const key = expenseKey(item);
      const row = draft[key] ?? { amount: 0, memo: "" };
      return {
        expense_month: monthFilter,
        group_key: item.group,
        category: item.category,
        amount: row.amount || 0,
        memo: row.memo.trim() || null,
        updated_at: new Date().toISOString(),
      };
    });

    const { error } = await getSupabase()
      .from("business_expenses")
      .upsert(payload, {
        onConflict: "expense_month,group_key,category",
      });

    if (error) {
      setTableError(error.message);
      setSaving(false);
      return;
    }

    setSavedAt(new Date().toLocaleTimeString("ko-KR", { hour12: false }));
    setSaving(false);
    loadExpenses();
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
            `docs/admin-business-expenses.sql`을 Supabase SQL Editor에서 한 번
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
        const groupTotal = items
          .map((item) => draft[expenseKey(item)]?.amount || 0)
          .reduce((sum, amount) => sum + amount, 0);

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

            <div className="flex flex-col gap-3">
              {items.map((item) => {
                const key = expenseKey(item);
                const row = draft[key] ?? { amount: 0, memo: "" };
                return (
                  <div
                    key={key}
                    className="grid gap-2"
                    style={{
                      gridTemplateColumns: "minmax(88px, 0.8fr) minmax(0, 1fr)",
                    }}>
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
                    <div className="flex flex-col gap-2">
                      <input
                        inputMode="numeric"
                        value={row.amount ? row.amount.toLocaleString() : ""}
                        onChange={(e) =>
                          updateDraft(key, {
                            amount: toAmount(e.target.value),
                          })
                        }
                        placeholder="0"
                        className="w-full rounded-xl px-3 py-2.5 text-right text-sm font-bold"
                        style={{
                          backgroundColor: "#f8fafc",
                          border: "1px solid #e5e7eb",
                          color: "#111827",
                          outline: "none",
                        }}
                      />
                      <input
                        value={row.memo}
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
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}

      <button
        onClick={saveExpenses}
        disabled={saving || loading || Boolean(tableError)}
        className="rounded-2xl py-3 text-sm font-black text-white"
        style={{
          background:
            saving || loading || tableError
              ? "#cbd5e1"
              : "linear-gradient(to right, #1f66ff, #4f8fff)",
        }}>
        {saving ? "저장 중..." : "비용 저장"}
      </button>

      {savedAt && (
        <p className="text-center text-xs" style={{ color: "#94a3b8" }}>
          {savedAt} 저장됨
        </p>
      )}
    </div>
  );
}
