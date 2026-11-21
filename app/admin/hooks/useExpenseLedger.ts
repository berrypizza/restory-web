"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "../lib/utils";
import type { ExpenseRow } from "../lib/settlement";

type Snapshot = { month: string; version: number; rows: ExpenseRow[] | null };

export function useExpenseLedger(month: string, enabled: boolean) {
  const [version, setVersion] = useState(0);
  const [result, setResult] = useState<Snapshot | null>(null);
  useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();
    async function read() {
      const rows: ExpenseRow[] = [];
      const batch = 500;
      try {
        let cursor = "";
        while (true) {
          let query = getSupabase()
            .from("business_expenses")
            .select("id,expense_month,group_key,category,amount,memo,created_at")
            .eq("expense_month", month)
            .order("id", { ascending: true })
            .limit(batch);
          if (cursor) query = query.gt("id", cursor);
          const { data, error } = await query.abortSignal(controller.signal);
          if (error) throw error;
          rows.push(...((data ?? []) as ExpenseRow[]));
          if (!data || data.length < batch) break;
          const lastId = data[data.length - 1].id;
          if (lastId <= cursor) throw new Error("Expense cursor did not advance");
          cursor = lastId;
        }
        rows.sort(
          (a, b) => Date.parse(b.created_at) - Date.parse(a.created_at) || b.id.localeCompare(a.id),
        );
        if (!controller.signal.aborted)
          setResult({ month, version, rows: rows.filter((row) => row.amount > 0) });
      } catch {
        if (!controller.signal.aborted) setResult({ month, version, rows: null });
      }
    }
    void read();
    return () => controller.abort();
  }, [month, enabled, version]);

  const current = enabled && result?.month === month && result.version === version ? result : null;
  return {
    rows: current?.rows ?? null,
    failed: current !== null && current.rows === null,
    reload: () => setVersion((v) => v + 1),
  };
}
