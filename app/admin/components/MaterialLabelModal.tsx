"use client";

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
export function materialCode(
  visitDate: string,
  customerName: string,
  materialId: string,
): string {
  const mmdd = visitDate ? visitDate.slice(5).replace("-", "") : "0000";
  const suffix = materialId.replace(/-/g, "").slice(-4).toUpperCase();
  const safeName = customerName || "고객";
  return `${mmdd}-${safeName}-${suffix}`;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-2 w-full">
      <span
        className="text-xs font-bold flex-shrink-0"
        style={{ color: "#94a3b8", width: 44 }}>
        {label}
      </span>
      <span className="text-sm font-bold flex-1" style={{ color: "#111827" }}>
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
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(15,23,42,0.78)" }}
      onClick={onClose}>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #material-label-print, #material-label-print * { visibility: visible; }
          #material-label-print { position: fixed; top: 24px; left: 0; right: 0; margin: 0 auto; }
        }
      `}</style>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xs flex flex-col gap-3">
        <div
          id="material-label-print"
          className="rounded-3xl p-6 flex flex-col items-center text-center gap-3"
          style={{ backgroundColor: "#ffffff", border: "3px solid #111827" }}>
          <span
            className="text-[10px] font-bold tracking-widest"
            style={{ color: "#94a3b8" }}>
            리스토리 스튜디오 · 자재표
          </span>
          <span
            className="text-2xl font-black tracking-tight"
            style={{ color: "#111827" }}>
            {data.code}
          </span>
          <div className="w-full h-px" style={{ backgroundColor: "#e5e7eb" }} />
          <div className="w-full flex flex-col gap-2">
            <Row label="고객" value={`${data.customerName} 고객님`} />
            <Row label="방문일" value={data.visitDate} />
            <Row label="자재" value={data.materialName} />
            {data.supplier && <Row label="공급처" value={data.supplier} />}
            {data.memo && <Row label="메모" value={data.memo} />}
          </div>
        </div>

        <div className="flex gap-2 print:hidden">
          <button
            onClick={() => window.print()}
            className="flex-1 rounded-xl py-3 text-sm font-bold text-white"
            style={{ backgroundColor: "#1f66ff" }}>
            🖨 인쇄
          </button>
          <button
            onClick={onClose}
            className="flex-1 rounded-xl py-3 text-sm font-bold"
            style={{
              backgroundColor: "#ffffff",
              color: "#334155",
              border: "1px solid #e5e7eb",
            }}>
            닫기
          </button>
        </div>
        <p
          className="text-center text-xs print:hidden"
          style={{ color: "rgba(255,255,255,0.75)" }}>
          화면 캡처해서 인쇄하거나, 보면서 박스에 적어주세요
        </p>
      </div>
    </div>
  );
}
