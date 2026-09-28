"use client";

import { useEffect, useMemo, useState } from "react";
import type { Job } from "../lib/types";
import { PRODUCT_OPTIONS, productBucket } from "../lib/constants";
import { formatPrice, formatYearMonth, getSupabase } from "../lib/utils";

type ExpenseRow = {
  id: string;
  expense_month: string;
  group_key: string;
  category: string;
  amount: number | null;
};

interface AnalysisTabProps {
  monthFilter: string;
  setMonthFilter: (v: string) => void;
  doneMonth: Job[];
  isAdmin: boolean;
}

const PRODUCT_BUCKETS = [...PRODUCT_OPTIONS, "기타"] as const;

function rate(value: number, base: number) {
  if (base <= 0) return 0;
  return Math.round((value / base) * 1000) / 10;
}

function won(value: number) {
  return `${value.toLocaleString("ko-KR")}원`;
}

export default function AnalysisTab({
  monthFilter,
  setMonthFilter,
  doneMonth,
  isAdmin,
}: AnalysisTabProps) {
  const [expenses, setExpenses] = useState<ExpenseRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [tableError, setTableError] = useState<string | null>(null);

  const revenue = doneMonth.reduce((sum, job) => sum + (job.price || 0), 0);

  const loadExpenses = async () => {
    if (!isAdmin) return;
    setLoading(true);
    setTableError(null);

    const { data, error } = await getSupabase()
      .from("business_expenses")
      .select("id, expense_month, group_key, category, amount")
      .eq("expense_month", monthFilter);

    if (error) {
      setExpenses([]);
      setTableError(error.message);
      setLoading(false);
      return;
    }

    setExpenses((data as ExpenseRow[] | null) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadExpenses();
    }, 0);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthFilter, isAdmin]);

  const materialCost = expenses
    .filter((row) => row.group_key === "material")
    .reduce((sum, row) => sum + (row.amount || 0), 0);

  const materialByCategory = expenses
    .filter((row) => row.group_key === "material")
    .reduce<Record<string, number>>((acc, row) => {
      acc[row.category] = (acc[row.category] || 0) + (row.amount || 0);
      return acc;
    }, {});

  const rows = useMemo(() => {
    return PRODUCT_BUCKETS.map((product) => {
      const jobs = doneMonth.filter((job) => productBucket(job.symptom) === product);
      const productRevenue = jobs.reduce((sum, job) => sum + (job.price || 0), 0);
      const share = revenue > 0 ? productRevenue / revenue : 0;
      const allocatedMaterial = Math.round(materialCost * share);
      return {
        product,
        count: jobs.length,
        revenue: productRevenue,
        revenueRate: rate(productRevenue, revenue),
        materialCost: allocatedMaterial,
        profit: productRevenue - allocatedMaterial,
      };
    })
      .filter((row) => row.count > 0 || row.product === "기타")
      .sort((a, b) => b.revenue - a.revenue);
  }, [doneMonth, materialCost, revenue]);

  const changeMonth = (delta: number) => {
    const date = new Date(`${monthFilter}-01`);
    date.setMonth(date.getMonth() + delta);
    setMonthFilter(date.toISOString().slice(0, 7));
  };

  if (!isAdmin) {
    return (
      <div
        className="rounded-2xl p-5 text-center"
        style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb" }}>
        <p className="text-sm font-bold" style={{ color: "#111827" }}>
          관리자만 분석을 확인할 수 있어요.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
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
            품목 분석
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
          style={{ backgroundColor: "#fff7ed", border: "1px solid #fed7aa", color: "#9a3412" }}>
          <p className="font-bold mb-1">자재비 테이블 확인 필요</p>
          <p>비용 탭의 자재비 데이터가 불러와지지 않았어요.</p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "완료", value: `${doneMonth.length}건`, color: "#111827" },
          { label: "매출", value: formatPrice(revenue), color: "#1f66ff" },
          { label: "자재비", value: won(materialCost), color: "#ef4444" },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-2xl p-4"
            style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb" }}>
            <p className="text-xs font-bold mb-2" style={{ color: "#64748b" }}>
              {card.label}
            </p>
            <p className="text-base font-black break-keep" style={{ color: card.color }}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <section
        className="rounded-2xl overflow-hidden"
        style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb" }}>
        <div className="px-4 py-3" style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #e5e7eb" }}>
          <h2 className="text-sm font-black" style={{ color: "#111827" }}>
            품목별 매출 · 자재비
          </h2>
          <p className="text-xs mt-1" style={{ color: "#64748b" }}>
            직접 입력한 품목은 기타로 집계됩니다. 자재비는 비용 탭의 월 자재비를 매출 비중으로 배분해 보여줍니다.
          </p>
        </div>

        <div className="flex flex-col divide-y" style={{ borderColor: "#f1f5f9" }}>
          {rows.map((row) => (
            <div key={row.product} className="px-4 py-3.5">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="min-w-0">
                  <p className="text-sm font-black" style={{ color: "#111827" }}>
                    {row.product}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "#64748b" }}>
                    {row.count}건 · 매출비중 {row.revenueRate}%
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-black" style={{ color: "#1f66ff" }}>
                    {formatPrice(row.revenue)}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "#ef4444" }}>
                    자재 {won(row.materialCost)}
                  </p>
                </div>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#e5e7eb" }}>
                <div
                  className="h-full rounded-full"
                  style={{ width: `${Math.min(row.revenueRate, 100)}%`, backgroundColor: "#1f66ff" }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        className="rounded-2xl p-4"
        style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb" }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-black" style={{ color: "#111827" }}>
            자재비 입력 현황
          </h2>
          <span className="text-xs font-bold" style={{ color: "#64748b" }}>
            {loading ? "불러오는 중..." : won(materialCost)}
          </span>
        </div>
        {Object.keys(materialByCategory).length === 0 ? (
          <p className="text-sm" style={{ color: "#94a3b8" }}>
            이번 달 입력된 자재비가 없어요.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(materialByCategory).map(([category, amount]) => (
              <div key={category} className="rounded-xl p-3" style={{ backgroundColor: "#f8fafc" }}>
                <p className="text-xs font-bold" style={{ color: "#64748b" }}>
                  {category}
                </p>
                <p className="text-sm font-black mt-1" style={{ color: "#111827" }}>
                  {won(amount)}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}