"use client";

import { MATERIAL_STATUSES, type MaterialStatus } from "../lib/constants";
import s from "../tabs/reporting.module.css";

export default function MaterialStatusStepper({
  status,
  onChange,
  disabled = false,
}: {
  status: MaterialStatus;
  onChange: (status: MaterialStatus) => void;
  disabled?: boolean;
}) {
  return (
    <div className={s.stepper} role="group" aria-label="자재 준비 상태">
      {MATERIAL_STATUSES.map((step) => (
        <button
          key={step}
          type="button"
          aria-pressed={status === step}
          disabled={disabled}
          onClick={() => {
            if (status !== step) onChange(step);
          }}
        >
          {step}
        </button>
      ))}
    </div>
  );
}
