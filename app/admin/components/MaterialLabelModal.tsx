"use client";

import JobDialog from "./JobDialog";
import s from "../tabs/reporting.module.css";

export interface MaterialLabelData {
  code: string;
  customerName: string;
  visitDate: string;
  materialName: string;
  supplier?: string | null;
  memo?: string | null;
}

// 같은 자재는 잡카드에서 보든 자재 탭에서 보든 항상 같은 코드가 나와야
// 헷갈리지 않으므로, 등록 순번이 아니라 자재 id 끝자리로 고정 코드를 만든다.
export function materialCode(visitDate: string, customerName: string, materialId: string): string {
  const mmdd = visitDate ? visitDate.slice(5).replace("-", "") : "0000";
  const suffix = materialId.replace(/-/g, "").slice(-4).toUpperCase();
  const safeName = customerName || "고객";
  return `${mmdd}-${safeName}-${suffix}`;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-2 w-full">
      <span className="text-xs font-bold flex-shrink-0" style={{ color: "#526174", width: 46 }}>
        {label}
      </span>
      <span
        className="text-sm font-semibold text-left break-words min-w-0 flex-1"
        style={{ color: "#111827" }}
      >
        {value}
      </span>
    </div>
  );
}

export default function MaterialLabelModal({
  data,
  onClose,
}: {
  data: MaterialLabelData;
  onClose: () => void;
}) {
  return (
    <JobDialog labelledBy="material-label-title" onClose={onClose}>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          dialog[open] { position: absolute !important; inset: 0 !important; margin: 0 !important; width: 100% !important; height: auto !important; max-height: none !important; border: 0; box-shadow: none !important; overflow: visible !important; }
          dialog[open]::backdrop { background: none !important; }
          #material-label-print, #material-label-print * { visibility: visible; }
          #material-label-print { position: absolute; top: 0; left: 0; }
        }
      `}</style>
      <div className={s.dialogBody}>
        <div className={s.panelHeader}>
          <h2 id="material-label-title">자재 라벨</h2>
          <button type="button" className={s.secondaryAction} onClick={onClose}>
            닫기
          </button>
        </div>
        <div id="material-label-print" className={s.printLabel}>
          <strong>{data.code}</strong>
          <Row label="고객" value={data.customerName || "미입력"} />
          <Row label="방문일" value={data.visitDate || "미정"} />
          <Row label="자재" value={data.materialName} />
          {data.supplier && <Row label="공급처" value={data.supplier} />}
          {data.memo && <Row label="메모" value={data.memo} />}
        </div>
        <button type="button" className={s.primaryAction} onClick={() => window.print()}>
          라벨 인쇄
        </button>
      </div>
    </JobDialog>
  );
}
