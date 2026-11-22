"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { Job, JobFormState } from "../lib/types";
import { isFinishedJob } from "../lib/settlement";
import { aftercareVisit, type FollowUpDraft } from "../lib/followUp";
import { canScheduleInstall } from "../lib/schedule";
import { getSupabase, today, addOneYear } from "../lib/utils";
import { getExtraTechsFromMemo } from "../lib/jobTechs";

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
      const write = patch.memo !== undefined && rows?.some(row => row.id === id && row.from_customer_intake)
        ? { ...patch, intake_assistants: getExtraTechsFromMemo(patch.memo) } : patch;
      let query = getSupabase().from("jobs").update(write).eq("id", id);
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

  const deleteJob = async (id: string) => {
    const table = getSupabase().from("jobs");
    const { data, error } = await table.delete().eq("id", id).select("id");
    if (error || data?.length !== 1) {
      const current = await table.select("id").eq("id", id).maybeSingle();
      if (current.error || current.data) throw new Error("접수 삭제 결과를 확인할 수 없어요.");
    }
    await load();
  };

  function receiveCreated(created: Job) {
    setRows(previous => previous ? [...previous.filter(job => job.id !== created.id), created] : null);
    if (reading.current || rows === null) void load();
  }

  async function insertOnce(payload: Partial<Job> & { id: string }) {
    const jobsTable = getSupabase().from("jobs");
    const { data, error } = await jobsTable.upsert(payload, {
      onConflict: "id", ignoreDuplicates: true,
    }).select("*").maybeSingle();
    if (error) throw error;
    // A previous attempt may have committed before its response reached the device.
    const created = data ?? (await jobsTable.select("*").eq("id", payload.id).single()).data;
    if (!created || (created.aftercare_source_id ?? null) !== (payload.aftercare_source_id ?? null) ||
        Boolean(created.is_aftercare) !== Boolean(payload.is_aftercare)) throw new Error("저장한 일정을 확인할 수 없어요.");
    receiveCreated(created as Job);
    return created as Job;
  }
  const createAftercare = (source: Job, draft: FollowUpDraft) => insertOnce(aftercareVisit(source, draft));

  async function setInstallSchedule(source: Job, date: string | null, time: string | null, onError: (message: string) => void) {
    let message = "";
    const saved = await update(source.id, { install_date: date, install_time: time || null }, {
      status: source.status, is_measurement: source.is_measurement, install_completed: source.install_completed,
      visit_date: source.visit_date, install_date: source.install_date, install_time: source.install_time,
    }, value => { message = value; });
    if (saved) return true;
    // A dropped response or a simultaneous save of the same schedule is already a success.
    const { data } = await getSupabase().from("jobs").select("*").eq("id", source.id).maybeSingle();
    if (data && (!date || canScheduleInstall(data)) && data.install_date === date && (data.install_time || "").slice(0, 5) === (time || "").slice(0, 5)) {
      await load();
      return true;
    }
    onError(message);
    return false;
  }

  const save = async (
    form: JobFormState,
    original: Job | null,
    draftId: string | null,
    onSuccess: (id: string, visitDate: string) => void,
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
        if (changed.some(key => ["visit_date", "install_date", "install_time", "is_measurement", "install_completed", "status"].includes(key))) {
          for (const key of ["visit_date", "install_date", "install_time", "is_measurement", "install_completed", "status"] as const)
            expected[key] = original[key] ?? null;
        }
        if (!(await update(original.id, patch, expected, onError))) return;
      }
      onSuccess(original.id, form.visit_date);
      return;
    }
    try {
      if (!draftId) throw new Error("등록할 일정이 없어요.");
      const created = await insertOnce({ ...payload, id: draftId });
      onSuccess(created.id, created.visit_date);
    } catch {
      onError("일정을 저장하지 못했어요. 연결 상태를 확인한 뒤 다시 시도해 주세요.");
    }
  };

  // 파생 데이터
  const jobs = rows ?? [];
  const reviewPending = jobs.filter((j) => !j.is_aftercare && isFinishedJob(j) && !j.review_requested && j.phone);

  return { jobs, hasData: rows !== null, loadError, refreshing, load, update, deleteJob, save, setInstallSchedule, createAftercare, reviewPending };
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
    is_aftercare: false,
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
    is_aftercare: Boolean(job.is_aftercare),
    is_measurement: job.is_measurement ?? false,
    install_date: job.install_date || null,
    install_time: job.install_time || null,
    install_completed: job.install_completed ?? false,
  };
}
