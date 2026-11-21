"use client";

import { useId, useState } from "react";
import { QUICK_TIMES } from "../lib/constants";
import common from "../operations.module.css";

const quickTimes = QUICK_TIMES.map((time) => ({
  label: time.label,
  value:
    String((time.h % 12) + (time.ampm === "PM" ? 12 : 0)).padStart(2, "0") +
    ":" +
    String(time.m).padStart(2, "0"),
}));

export default function ArrivalTime({
  value,
  name,
  label,
  onChange,
}: {
  value: string;
  name: string;
  label: string;
  onChange: (value: string) => void;
}) {
  const id = useId();
  const [custom, setCustom] = useState(() =>
    Boolean(value && !quickTimes.some((item) => item.value === value.slice(0, 5))),
  );
  const selectValue = custom ? "custom" : value.slice(0, 5);
  return (
    <div className={common.field}>
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        name={custom ? undefined : name}
        value={selectValue}
        onChange={(event) => {
          const choice = event.target.value;
          setCustom(choice === "custom");
          if (choice !== "custom") onChange(choice);
        }}
      >
        <option value="">시간 미정</option>
        {quickTimes.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
        <option value="custom">직접 입력</option>
      </select>
      {custom && (
        <input
          type="time"
          name={name}
          aria-label={label + " 직접 입력"}
          value={value.slice(0, 5)}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </div>
  );
}
