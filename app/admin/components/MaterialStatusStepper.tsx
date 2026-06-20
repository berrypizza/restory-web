"use client";

import type { MaterialStatus } from "../lib/constants";
import { MATERIAL_STATUSES, MATERIAL_STATUS_STYLE } from "../lib/constants";

export default function MaterialStatusStepper({
  status,
  onChange,
}: {
  status: MaterialStatus;
  onChange: (status: MaterialStatus) => void;
}) {
  return (
    <div className="flex items-center gap-1 w-full">
      {MATERIAL_STATUSES.map((s) => {
        const active = s === status;
        const style = MATERIAL_STATUS_STYLE[s];
        return (
          <button
            key={s}
            type="button"
            onClick={() => onChange(s)}
            className="flex-1 text-center text-[11px] font-bold py-1.5 rounded-lg"
            style={{
              backgroundColor: active ? style.color : "#f8fafc",
              color: active ? "#ffffff" : "#94a3b8",
              border: `1px solid ${active ? style.color : "#e5e7eb"}`,
              transition: "all 0.15s",
            }}>
            {s}
          </button>
        );
      })}
    </div>
  );
}
