"use client";

import { useState, useCallback } from "react";
import type { Material } from "../lib/types";
import type { MaterialStatus, MaterialSupplier } from "../lib/constants";
import { getSupabase } from "../lib/utils";

export function useMaterials() {
  const [materials, setMaterials] = useState<Material[]>([]);

  const loadByJob = useCallback(async (jobId: string) => {
    const { data } = await getSupabase()
      .from("materials")
      .select("*")
      .eq("job_id", jobId)
      .order("created_at", { ascending: true });
    setMaterials(data ?? []);
  }, []);

  // 날짜 범위로 전체 로드 (자재 탭용)
  const loadByDate = useCallback(async (date: string) => {
    const { data } = await getSupabase()
      .from("materials")
      .select("*, jobs(id, name, region, visit_date, tech)")
      .eq("jobs.visit_date", date)
      .order("created_at", { ascending: true });
    return (data ?? []) as (Material & {
      jobs: {
        id: string;
        name: string;
        region: string;
        visit_date: string;
        tech: string;
      };
    })[];
  }, []);

  const add = async (
    jobId: string,
    payload: {
      name: string;
      supplier: MaterialSupplier | null;
      status: MaterialStatus;
      memo: string;
    },
  ) => {
    const { error } = await getSupabase()
      .from("materials")
      .insert({ job_id: jobId, ...payload });
    if (error) {
      alert("추가 실패: " + error.message);
      return;
    }
    await loadByJob(jobId);
  };

  const update = async (
    id: string,
    patch: Partial<Material>,
    jobId: string,
  ) => {
    const { error } = await getSupabase()
      .from("materials")
      .update(patch)
      .eq("id", id);
    if (error) {
      alert("수정 실패: " + error.message);
      return;
    }
    await loadByJob(jobId);
  };

  const remove = async (id: string, jobId: string) => {
    if (!confirm("삭제할까요?")) return;
    const { error } = await getSupabase()
      .from("materials")
      .delete()
      .eq("id", id);
    if (error) {
      alert("삭제 실패: " + error.message);
      return;
    }
    await loadByJob(jobId);
  };

  return { materials, loadByJob, loadByDate, add, update, remove };
}
