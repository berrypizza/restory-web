"use client";

import { useState, useEffect, useCallback } from "react";
import type { Job, JobFormState } from "../lib/types";
import { getSupabase, today, addOneYear } from "../lib/utils";

export function useJobs(loggedUser: string | null) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const { data } = await getSupabase()
      .from("jobs")
      .select("*")
      .order("visit_date", { ascending: true })
      .order("visit_time", { ascending: true });
    setJobs(data ?? []);
    setLoading(false);
  }, []);

  // 초기 로드
  useEffect(() => {
    if (!loggedUser) return;
    load();
  }, [load, loggedUser]);

  // 실시간 구독
  useEffect(() => {
    if (!loggedUser) return;
    const supabase = getSupabase();
    const channel = supabase
      .channel("jobs_realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "jobs" },
        () => load(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [load, loggedUser]);

  const update = async (id: string, patch: Partial<Job>) => {
    const { error } = await getSupabase()
      .from("jobs")
      .update(patch)
      .eq("id", id);
    if (error) alert("수정 실패: " + error.message);
  };

  const remove = async (id: string) => {
    if (!confirm("삭제할까요?")) return;
    const { error } = await getSupabase().from("jobs").delete().eq("id", id);
    if (error) alert("삭제 실패: " + error.message);
  };

  const save = async (
    form: JobFormState,
    editId: string | null,
    onSuccess: () => void,
  ) => {
    if (!form.name.trim() || !form.region.trim() || !form.symptom.trim())
      return;
    const payload = {
      ...form,
      install_date: form.install_date || null,
      install_time: form.install_time || null,
    };
    try {
      if (editId) {
        const { error } = await getSupabase()
          .from("jobs")
          .update(payload)
          .eq("id", editId);
        if (error) throw error;
      } else {
        const { error } = await getSupabase().from("jobs").insert(payload);
        if (error) throw error;
      }
      onSuccess();
    } catch (err: unknown) {
      alert(
        "저장 실패: " +
          (err instanceof Error ? err.message : "알 수 없는 오류"),
      );
    }
  };

  // 파생 데이터
  const reviewPending = jobs.filter(
    (j) => j.status === "완료" && !j.review_requested && j.phone,
  );

  return { jobs, loading, load, update, remove, save, reviewPending };
}

// ── 폼 초기값 ─────────────────────────────────────────────────
export function emptyForm(): JobFormState {
  return {
    visit_date: today(),
    visit_time: "00:00",
    name: "",
    phone: "",
    region: "",
    symptom: "",
    price: 0,
    status: "대기",
    tech: "",
    memo: "",
    as_until: addOneYear(today()),
    intake_photos: "",
    is_measurement: false,
    install_date: null,
    install_time: null,
    install_completed: false,
  };
}

export function formFromJob(job: Job): JobFormState {
  return {
    visit_date: job.visit_date,
    visit_time: job.visit_time || "",
    name: job.name,
    phone: job.phone,
    region: job.region,
    symptom: job.symptom,
    price: job.price,
    status: job.status,
    tech: job.tech,
    memo: job.memo,
    as_until: job.as_until || addOneYear(job.visit_date || today()),
    intake_photos: job.intake_photos || "",
    is_measurement: job.is_measurement ?? false,
    install_date: job.install_date || null,
    install_time: job.install_time || null,
    install_completed: job.install_completed ?? false,
  };
}
