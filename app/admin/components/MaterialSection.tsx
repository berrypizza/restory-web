"use client";

import { useState, useEffect } from "react";
import type { Material } from "../lib/types";
import type { MaterialStatus, MaterialSupplier } from "../lib/constants";
import { MATERIAL_SUPPLIERS, MATERIAL_SUPPLIER_STYLE } from "../lib/constants";
import { useMaterials } from "../hooks/useMaterials";
import { formatDate } from "../lib/utils";
import MaterialLabelModal, { materialCode } from "./MaterialLabelModal";
import type { MaterialLabelData } from "./MaterialLabelModal";
import MaterialStatusStepper from "./MaterialStatusStepper";

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
  const [newName, setNewName] = useState("");
  const [newSupplier, setNewSupplier] = useState<MaterialSupplier | "">("");
  const [newMemo, setNewMemo] = useState("");
  const [labelData, setLabelData] = useState<MaterialLabelData | null>(null);

  // 더 이상 펼쳐야 불러오지 않는다 — 카드가 보이는 순간 바로 불러온다
  useEffect(() => {
    loadByJob(jobId);
  }, [jobId, loadByJob]);

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

  const openLabel = (m: Material) => {
    setLabelData({
      code: materialCode(visitDate, customerName, m.id),
      customerName,
      visitDate: visitDate ? formatDate(visitDate) : "",
      materialName: m.name,
      supplier: m.supplier,
      memo: m.memo,
    });
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

  // 자재도 없고 추가 권한도 없으면(기사 화면) 아예 아무것도 그리지 않는다
  if (totalCount === 0 && !isAdmin && !adding) return null;

  return (
    <>
      <div className="mt-2 flex flex-col gap-1.5">
        {/* 상태 요약 — 더 이상 누르는 버튼이 아니라 그냥 안내 줄 */}
        {totalCount > 0 && (
          <div className="flex items-center gap-2 px-1">
            <span style={{ fontSize: 13 }}>🔩</span>
            <span
              className="text-xs font-bold"
              style={{
                color: hasIssue ? "#f59e0b" : allReady ? "#1f66ff" : "#334155",
              }}>
              자재
            </span>
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
            {hasIssue && (
              <span
                className="ml-auto text-xs font-bold animate-pulse"
                style={{ color: "#ef4444" }}>
                발주필요
              </span>
            )}
            {allReady && (
              <span
                className="ml-auto text-xs font-bold"
                style={{ color: "#1f66ff" }}>
                ✓ 완료
              </span>
            )}
          </div>
        )}

        {(totalCount > 0 || adding) && (
          <div
            className="rounded-xl overflow-hidden"
            style={{
              border: `1px solid ${hasIssue ? "#f59e0b44" : allReady ? "#bfd3ff" : "#e5e7eb"}`,
            }}>
            {materials.length > 0 && (
              <div
                className="flex flex-col divide-y"
                style={{
                  backgroundColor: "#ffffff",
                  borderColor: "#f3f4f6",
                }}>
                {materials.map((m) => (
                  <MaterialRow
                    key={m.id}
                    material={m}
                    isAdmin={isAdmin}
                    onStatusChange={(status) => update(m.id, { status }, jobId)}
                    onDelete={() => remove(m.id, jobId)}
                    onLabel={() => openLabel(m)}
                  />
                ))}
              </div>
            )}

            {/* 관리자: 추가 폼 */}
            {isAdmin && adding && (
              <div
                className="p-3 flex flex-col gap-2"
                style={{
                  backgroundColor: "#f8fafc",
                  borderTop:
                    materials.length > 0 ? "1px solid #f3f4f6" : "none",
                }}>
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
                    style={{
                      backgroundColor: "#f3f4f6",
                      color: "#64748b",
                    }}>
                    취소
                  </button>
                </div>
              </div>
            )}

            {isAdmin && !adding && materials.length > 0 && (
              <button
                onClick={() => setAdding(true)}
                className="w-full py-2.5 text-xs font-bold"
                style={{
                  backgroundColor: "#f8fafc",
                  color: "#1f66ff",
                  borderTop: "1px solid #f3f4f6",
                }}>
                + 자재 추가
              </button>
            )}
          </div>
        )}

        {/* 자재가 아예 없는 잡 — 관리자만, 탭하기 충분한 크기의 버튼 */}
        {isAdmin && totalCount === 0 && !adding && (
          <button
            onClick={() => setAdding(true)}
            className="self-start inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold"
            style={{
              backgroundColor: "#eaf1ff",
              color: "#1f66ff",
              border: "1px solid #bfd3ff",
            }}>
            <span style={{ fontSize: 13 }}>🔩</span>
            자재 추가
          </button>
        )}
      </div>

      {labelData && (
        <MaterialLabelModal
          data={labelData}
          onClose={() => setLabelData(null)}
        />
      )}
    </>
  );
}

// ── 자재 한 줄 ───────────────────────────────────────────────
function MaterialRow({
  material,
  isAdmin,
  onStatusChange,
  onDelete,
  onLabel,
}: {
  material: Material;
  isAdmin: boolean;
  onStatusChange: (status: MaterialStatus) => void;
  onDelete: () => void;
  onLabel: () => void;
}) {
  const supplierStyle = material.supplier
    ? MATERIAL_SUPPLIER_STYLE[material.supplier]
    : null;

  return (
    <div className="flex flex-col gap-2 px-3 py-2.5">
      <div className="flex items-center gap-2">
        {/* 준비완료 빠른 체크 (기사도 가능) */}
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

        {/* 라벨 — 도착한 자재 확인할 때 바로 누를 수 있게 항상 노출 */}
        <button
          onClick={onLabel}
          className="flex-shrink-0 text-xs font-bold px-2 py-1.5 rounded-lg"
          style={{
            backgroundColor: "#f8fafc",
            color: "#64748b",
            border: "1px solid #e5e7eb",
          }}>
          🏷
        </button>

        {/* 삭제 (관리자만) */}
        {isAdmin && (
          <button
            onClick={onDelete}
            className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-xs"
            style={{ backgroundColor: "#fef2f2", color: "#ef4444" }}>
            ✕
          </button>
        )}
      </div>

      {/* 상태 스텝퍼 (관리자만) — 네이티브 select 대신 앱 디자인에 맞춘 캡슐 3단 컨트롤 */}
      {isAdmin && (
        <MaterialStatusStepper
          status={material.status}
          onChange={onStatusChange}
        />
      )}
    </div>
  );
}
