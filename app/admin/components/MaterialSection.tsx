"use client";

import { useState, useEffect } from "react";
import type { Material } from "../lib/types";
import { MATERIAL_SUPPLIERS, type MaterialStatus, type MaterialSupplier } from "../lib/constants";
import { useMaterials } from "../hooks/useMaterials";
import { formatDate } from "../lib/utils";
import MaterialLabelModal, { materialCode, type MaterialLabelData } from "./MaterialLabelModal";
import MaterialStatusStepper from "./MaterialStatusStepper";
import s from "../tabs/reporting.module.css";

interface MaterialSectionProps {
  jobId: string;
  isAdmin: boolean;
  customerName?: string;
  visitDate?: string;
}

export default function MaterialSection({
  jobId,
  isAdmin,
  customerName = "",
  visitDate = "",
}: MaterialSectionProps) {
  const { materials, loadByJob, add, update, remove } = useMaterials();
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [supplier, setSupplier] = useState<MaterialSupplier | "">("");
  const [memo, setMemo] = useState("");
  const [busy, setBusy] = useState(false);
  const [label, setLabel] = useState<MaterialLabelData | null>(null);

  useEffect(() => {
    void loadByJob(jobId);
  }, [jobId, loadByJob]);
  const ready = materials.filter((m) => m.status === "준비완료").length;
  if (!materials.length && !isAdmin) return null;

  function closeForm() {
    setAdding(false);
    setName("");
    setSupplier("");
    setMemo("");
  }
  async function submit() {
    if (!name.trim() || busy) return;
    setBusy(true);
    try {
      const saved = await add(jobId, {
        name: name.trim(),
        supplier: supplier || null,
        status: "발주필요",
        memo: memo.trim(),
      });
      if (saved) closeForm();
    } finally {
      setBusy(false);
    }
  }
  function openLabel(material: Material) {
    setLabel({
      code: materialCode(visitDate, customerName, material.id),
      customerName,
      visitDate: visitDate ? formatDate(visitDate) : "",
      materialName: material.name,
      supplier: material.supplier,
      memo: material.memo,
    });
  }
  async function changeStatus(material: Material, status: MaterialStatus) {
    if (busy || status === material.status) return;
    setBusy(true);
    try {
      await update(material.id, { status }, jobId);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={s.material}>
      <div className={s.materialHead}>
        <strong>
          작업 자재{" "}
          {materials.length > 0 && (
            <span className={s.badge}>
              준비 {ready}/{materials.length}
            </span>
          )}
        </strong>
        {isAdmin && !adding && (
          <button type="button" className={s.softAction} onClick={() => setAdding(true)}>
            자재 추가
          </button>
        )}
      </div>
      {materials.length > 0 && (
        <div className={s.materialRows}>
          {materials.map((m) => (
            <div key={m.id}>
              <div className={s.materialInfo}>
                <button
                  type="button"
                  className={s.check}
                  aria-label={`${m.name} 준비 완료`}
                  aria-pressed={m.status === "준비완료"}
                  disabled={busy}
                  onClick={() => changeStatus(m, m.status === "준비완료" ? "발주완료" : "준비완료")}
                >
                  <span aria-hidden="true">{m.status === "준비완료" ? "✓" : "○"}</span>
                </button>
                <div>
                  <strong>{m.name}</strong>
                  {(m.memo || (isAdmin && m.supplier)) && (
                    <p className={s.muted}>
                      {[isAdmin && m.supplier, m.memo].filter(Boolean).join(" · ")}
                    </p>
                  )}
                  {!isAdmin && <p className={s.muted}>{m.status}</p>}
                </div>
                <button
                  type="button"
                  className={s.secondaryAction}
                  aria-label={`${m.name} 라벨 열기`}
                  onClick={() => openLabel(m)}
                >
                  라벨
                </button>
                {isAdmin && (
                  <button
                    type="button"
                    className={s.smallAction}
                    aria-label={`${m.name} 삭제`}
                    disabled={busy}
                    onClick={async () => {
                      setBusy(true);
                      try {
                        await remove(m.id, jobId);
                      } finally {
                        setBusy(false);
                      }
                    }}
                  >
                    삭제
                  </button>
                )}
              </div>
              {isAdmin && (
                <MaterialStatusStepper
                  status={m.status}
                  disabled={busy}
                  onChange={(status) => changeStatus(m, status)}
                />
              )}
            </div>
          ))}
        </div>
      )}
      {isAdmin && adding && (
        <form
          className={s.materialForm}
          onSubmit={(e) => {
            e.preventDefault();
            void submit();
          }}
        >
          <label>
            자재명
            <input
              autoFocus
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 베니스 가죽 검정 0.5마"
            />
          </label>
          <label>
            공급처 (선택)
            <select
              value={supplier}
              onChange={(e) => setSupplier(e.target.value as MaterialSupplier | "")}
            >
              <option value="">선택하세요</option>
              {MATERIAL_SUPPLIERS.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label>
            메모 (선택)
            <input
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="치수, 수량 등"
            />
          </label>
          <div className={s.line}>
            <button type="button" className={s.secondaryAction} disabled={busy} onClick={closeForm}>
              취소
            </button>
            <button type="submit" className={s.primaryAction} disabled={!name.trim() || busy}>
              {busy ? "저장 중…" : "자재 저장"}
            </button>
          </div>
        </form>
      )}
      {label && <MaterialLabelModal data={label} onClose={() => setLabel(null)} />}
    </div>
  );
}
