"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { Job, JobFormState } from "../lib/types";
import { isFinishedJob } from "../lib/settlement";
import { getSupabase, today, addOneYear } from "../lib/utils";

export function useJobs() {
  const [rows, setRows] = useState<Job[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const sequence = useRef(0);
  const reading = useRef(false);
  const latestWrite = useRef(new Map<string, symbol>());

  const load = useCallback(async () => {
    const request = ++sequence.current;
    reading.current = true;
    setRefreshing(true);
    try {
      const all: Job[] = [];
      const batchSize = 500;
      let cursor: string | undefined;
      while (true) {
        let query = getSupabase().from("jobs").select("*").order("id").limit(batchSize);
        if (cursor) query = query.gt("id", cursor);
        const { data, error } = await query;
        if (request !== sequence.current) return;
        if (error) throw error;
        const batch = (data ?? []) as Job[];
        all.push(...batch);
        if (batch.length < batchSize) break;
        cursor = batch[batch.length - 1].id;
      }
      setRows(all);
      setLoadError(false);
    } catch {
      if (request === sequence.current) setLoadError(true);
    } finally {
      if (request === sequence.current) {
        reading.current = false;
        setRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    const invalidateRequests = () => {
      sequence.current += 1;
    };
    const timer = window.setTimeout(() => void load(), 0);
    let unsubscribe: (() => void) | undefined;
    try {
      const db = getSupabase();
      const channel = db
        .channel("jobs_realtime")
        .on("postgres_changes", { event: "*", schema: "public", table: "jobs" }, () => void load())
        .subscribe();
      unsubscribe = () => {
        void db.removeChannel(channel);
      };
    } catch {
      // The initial read also handles missing connection settings.
    }
    return () => {
      window.clearTimeout(timer);
      invalidateRequests();
      unsubscribe?.();
    };
  }, [load]);

  const update = async (
    id: string,
    patch: Partial<Job>,
    expected?: Partial<Job>,
    onError: (message: string) => void = message => window.alert(message),
  ) => {
    const token = Symbol();
    latestWrite.current.set(id, token);
    try {
      let query = getSupabase().from("jobs").update(patch).eq("id", id);
      for (const [column, value] of Object.entries(expected ?? {})) {
        query = value == null ? query.is(column, null) : query.eq(column, value);
      }
      const { data, error } = await query.select("*");
      if (error) throw error;
      if (data?.length !== 1) {
        await load();
        onError("작업 내역이 바뀌었거나 접근할 수 없어요. 최신 내용을 확인하고 다시 시도해 주세요.");
        return false;
      }
      if (latestWrite.current.get(id) !== token) {
        await load();
      } else {
        const saved = data[0] as Job;
        const interruptedRead = reading.current;
        sequence.current += 1;
        reading.current = false;
        setRefreshing(false);
        setRows(previous => previous?.map(row => row.id === id ? saved : row) ?? null);
        if (interruptedRead) void load();
      }
      return true;
    } catch {
      onError("변경 사항을 저장하지 못했어요. 연결 상태를 확인하고 다시 시도해 주세요.");
      return false;
    } finally {
      if (latestWrite.current.get(id) === token) latestWrite.current.delete(id);
    }
  };

  const remove = async (id: string) => {
    const name = rows?.find((job) => job.id === id)?.name;
    if (!confirm(`${name ? name + " 고객님의 " : ""}접수를 삭제할까요? 삭제한 접수는 복구할 수 없어요.`))
      return;
    try {
      const { data, error } = await getSupabase().from("jobs").delete().eq("id", id).select("id");
      if (error || data?.length !== 1) throw new Error();
    } catch {
      alert("삭제하지 못했어요. 연결 상태와 작업 내역을 확인한 뒤 다시 시도해 주세요.");
      return;
    }
    await load();
  };

  const save = async (
    form: JobFormState,
    original: Job | null,
    onSuccess: (id: string) => void,
    onError: (message: string) => void,
  ) => {
    if (!form.name.trim() || !form.region.trim() || !form.symptom.trim() || !form.visit_date) return;
    const payload = {
      ...form,
      visit_time: form.visit_time || null,
      as_until: form.as_until || null,
      install_date: form.install_date || null,
      install_time: form.install_time || null,
    };
    if (original) {
      const before = formFromJob(original);
      const changed = (Object.keys(form) as (keyof JobFormState)[]).filter(key => form[key] !== before[key]);
      if (changed.length) {
        const patch = Object.fromEntries(changed.map(key => [key, payload[key]]));
        const expected = Object.fromEntries(changed.map(key => [key, original[key] ?? null]));
        if (!(await update(original.id, patch, expected, onError))) return;
      }
      onSuccess(original.id);
      return;
    }
    try {
      const { data, error } = await getSupabase().from("jobs").insert(payload).select("*").single();
      if (error || !data?.id) throw new Error();
      const created = data as Job;
      // Merge a Realtime echo and the insert response into one visible row.
      setRows(previous => previous ? [...previous.filter(job => job.id !== created.id), created] : null);
      onSuccess(created.id);
      // A read that started before the insert must not replace the new row.
      if (reading.current || rows === null) void load();
    } catch {
      onError("일정을 저장하지 못했어요. 연결 상태를 확인한 뒤 다시 시도해 주세요.");
    }
  };

  // 파생 데이터
  const jobs = rows ?? [];
  const reviewPending = jobs.filter((j) => isFinishedJob(j) && !j.review_requested && j.phone);

  return { jobs, hasData: rows !== null, loadError, refreshing, load, update, remove, save, reviewPending };
}

// ── 폼 초기값 ─────────────────────────────────────────────────
export function emptyForm(date = today()): JobFormState {
  return {
    visit_date: date,
    visit_time: "",
    name: "",
    phone: "",
    region: "",
    symptom: "",
    price: 0,
    status: "대기",
    tech: "",
    memo: "",
    as_until: addOneYear(date),
    intake_photos: "",
    is_measurement: false,
    install_date: null,
    install_time: null,
    install_completed: false,
  };
}

export function formFromJob(job: Job): JobFormState {
  return {
    visit_date: job.visit_date || "",
    visit_time: job.visit_time || "",
    name: job.name || "",
    phone: job.phone || "",
    region: job.region || "",
    symptom: job.symptom || "",
    price: job.price ?? 0,
    status: job.status || "대기",
    tech: job.tech || "",
    memo: job.memo || "",
    as_until: job.as_until || "",
    intake_photos: job.intake_photos || "",
    is_measurement: job.is_measurement ?? false,
    install_date: job.install_date || null,
    install_time: job.install_time || null,
    install_completed: job.install_completed ?? false,
  };
}
