"use client";

import { useState, useEffect } from "react";
import type { Material } from "../lib/types";
import type { MaterialStatus, MaterialSupplier } from "../lib/constants";
import {
  MATERIAL_STATUSES,
  MATERIAL_SUPPLIERS,
  MATERIAL_STATUS_STYLE,
  MATERIAL_SUPPLIER_STYLE,
} from "../lib/constants";
import { useMaterials } from "../hooks/useMaterials";

interface MaterialSectionProps {
  jobId: string;
  isAdmin: boolean;
}

export default function MaterialSection({
  jobId,
  isAdmin,
}: MaterialSectionProps) {
  const { materials, loadByJob, add, update, remove } = useMaterials();
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newSupplier, setNewSupplier] = useState<MaterialSupplier | "">("");
  const [newMemo, setNewMemo] = useState("");

  useEffect(() => {
    if (open) loadByJob(jobId);
  }, [open, jobId, loadByJob]);

  const readyCount = materials.filter((m) => m.status === "준비완료").length;
  const totalCount = materials.length;
  const allReady = totalCount > 0 && readyCount === totalCount;
  const hasIssue = materials.some((m) => m.status === "발주필요");

  const handleAdd = async () => {
    if (!newName.trim()) return;
    await add(jobId, {
      name: newName.trim(),
      supplier: newSupplier || null,
      status: "발주필요",
      memo: newMemo.trim(),
    });
    setNewName("");
    setNewSupplier("");
    setNewMemo("");
    setAdding(false);
  };

  const inputStyle: React.CSSProperties = {
    backgroundColor: "#f8fafc",
    border: "1px solid #dbe3f0",
    color: "#111827",
    borderRadius: 8,
    padding: "7px 10px",
    fontSize: 13,
    outline: "none",
    width: "100%",
  };

  return (
    <div className="mt-2">
      {/* 섹션 토글 버튼 */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-left"
        style={{
          backgroundColor: open ? "#fff7ed" : "#f8fafc",
          border: `1px solid ${hasIssue ? "#f59e0b44" : allReady ? "#bfd3ff" : "#e5e7eb"}`,
        }}>
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 14 }}>🔩</span>
          <span
            className="text-sm font-bold"
            style={{
              color: hasIssue ? "#f59e0b" : allReady ? "#1f66ff" : "#334155",
            }}>
            자재
          </span>
          {totalCount > 0 && (
            <span
              className="text-xs px-2 py-0.5 rounded-full font-bold"
              style={{
                backgroundColor: allReady
                  ? "#eaf1ff"
                  : hasIssue
                    ? "#fef2f2"
                    : "#f59e0b18",
                color: allReady ? "#1f66ff" : hasIssue ? "#ef4444" : "#f59e0b",
              }}>
              {readyCount}/{totalCount} 준비
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          {hasIssue && (
            <span
              className="text-xs font-bold animate-pulse"
              style={{ color: "#ef4444" }}>
              발주필요
            </span>
          )}
          {allReady && (
            <span className="text-xs font-bold" style={{ color: "#1f66ff" }}>
              ✓ 완료
            </span>
          )}
          <span
            style={{
              color: "#94a3b8",
              fontSize: 14,
              transition: "transform 0.2s",
              display: "inline-block",
              transform: open ? "rotate(180deg)" : "none",
            }}>
            ▾
          </span>
        </div>
      </button>

      {/* 펼쳐진 내용 */}
      {open && (
        <div
          className="rounded-xl mt-1 overflow-hidden"
          style={{ border: "1px solid #e5e7eb", borderTop: "none" }}>
          {/* 자재 목록 */}
          {materials.length === 0 ? (
            <div
              className="py-4 text-center text-xs"
              style={{ color: "#94a3b8", backgroundColor: "#f8fafc" }}>
              등록된 자재 없음
            </div>
          ) : (
            <div
              className="flex flex-col divide-y"
              style={{ backgroundColor: "#ffffff", borderColor: "#f3f4f6" }}>
              {materials.map((m) => (
                <MaterialRow
                  key={m.id}
                  material={m}
                  isAdmin={isAdmin}
                  onStatusChange={(status) => update(m.id, { status }, jobId)}
                  onDelete={() => remove(m.id, jobId)}
                />
              ))}
            </div>
          )}

          {/* 관리자: 추가 폼 */}
          {isAdmin && (
            <div
              style={{
                backgroundColor: "#f8fafc",
                borderTop: "1px solid #f3f4f6",
              }}>
              {adding ? (
                <div className="p-3 flex flex-col gap-2">
                  <input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="자재명 (예: 베니스 가죽 검정 0.5마)"
                    style={inputStyle}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={newSupplier}
                      onChange={(e) =>
                        setNewSupplier(e.target.value as MaterialSupplier)
                      }
                      style={inputStyle}>
                      <option value="">공급처 선택</option>
                      {MATERIAL_SUPPLIERS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <input
                      value={newMemo}
                      onChange={(e) => setNewMemo(e.target.value)}
                      placeholder="메모 (치수, 수량 등)"
                      style={inputStyle}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleAdd}
                      className="flex-1 rounded-lg py-2 text-xs font-bold text-white"
                      style={{ backgroundColor: "#1f66ff" }}>
                      추가
                    </button>
                    <button
                      onClick={() => {
                        setAdding(false);
                        setNewName("");
                        setNewSupplier("");
                        setNewMemo("");
                      }}
                      className="flex-1 rounded-lg py-2 text-xs font-bold"
                      style={{ backgroundColor: "#f3f4f6", color: "#64748b" }}>
                      취소
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setAdding(true)}
                  className="w-full py-2.5 text-xs font-bold"
                  style={{ color: "#1f66ff" }}>
                  + 자재 추가
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── 자재 한 줄 ───────────────────────────────────────────────
function MaterialRow({
  material,
  isAdmin,
  onStatusChange,
  onDelete,
}: {
  material: Material;
  isAdmin: boolean;
  onStatusChange: (status: MaterialStatus) => void;
  onDelete: () => void;
}) {
  const statusStyle = MATERIAL_STATUS_STYLE[material.status];
  const supplierStyle = material.supplier
    ? MATERIAL_SUPPLIER_STYLE[material.supplier]
    : null;

  return (
    <div className="flex items-center gap-2 px-3 py-2.5">
      {/* 준비완료 체크 (기사도 가능) */}
      <button
        onClick={() =>
          onStatusChange(
            material.status === "준비완료" ? "발주완료" : "준비완료",
          )
        }
        className="flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center"
        style={{
          backgroundColor:
            material.status === "준비완료" ? "#1f66ff" : "transparent",
          borderColor: material.status === "준비완료" ? "#1f66ff" : "#cbd5e1",
        }}>
        {material.status === "준비완료" && (
          <span style={{ color: "white", fontSize: 10 }}>✓</span>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-medium truncate"
          style={{
            color: material.status === "준비완료" ? "#94a3b8" : "#111827",
            textDecoration:
              material.status === "준비완료" ? "line-through" : "none",
          }}>
          {material.name}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
          {/* 공급처 (관리자만) */}
          {isAdmin && material.supplier && supplierStyle && (
            <span
              className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
              style={{
                backgroundColor: supplierStyle.bg,
                color: supplierStyle.color,
              }}>
              {material.supplier}
            </span>
          )}
          {/* 메모 */}
          {material.memo && (
            <span className="text-[10px]" style={{ color: "#94a3b8" }}>
              {material.memo}
            </span>
          )}
        </div>
      </div>

      {/* 상태 변경 + 삭제 (관리자만) */}
      {isAdmin && (
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <select
            value={material.status}
            onChange={(e) => onStatusChange(e.target.value as MaterialStatus)}
            className="text-[10px] font-bold rounded-lg px-2 py-1 cursor-pointer"
            style={{
              backgroundColor: statusStyle.bg,
              color: statusStyle.color,
              border: `1px solid ${statusStyle.border}`,
              outline: "none",
            }}>
            {MATERIAL_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button
            onClick={onDelete}
            className="w-6 h-6 flex items-center justify-center rounded-lg text-xs"
            style={{ backgroundColor: "#fef2f2", color: "#ef4444" }}>
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
