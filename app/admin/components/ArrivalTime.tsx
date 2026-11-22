"use client";

import { useId } from "react";
import s from "../operations.module.css";

const hours = Array.from({ length: 24 }, (_, index) => String(index).padStart(2, "0"));

export default function ArrivalTime({ value, name, label, onChange }: {
  value: string;
  name: string;
  label: string;
  onChange: (value: string) => void;
}) {
  const id = useId();
  const hour = value.slice(0, 2);
  const minute = value.slice(3, 5);
  const seconds = Number(value.slice(6));
  const legacy = Boolean(value) && (!hours.includes(hour) || (minute !== "00" && minute !== "30") || seconds !== 0);
  return (
    <div className={s.field}>
      <label htmlFor={id}>{label}</label>
      <div className={s.clockInputs}>
        <select id={id} value={legacy ? "original" : hour} onChange={event => {
          const next = event.target.value;
          onChange(next ? `${next}:${minute === "30" ? "30" : "00"}` : "");
        }}>
          <option value="">시간 미정</option>
          {legacy && <option value="original" disabled>기존 {seconds ? value : value.slice(0, 5)}</option>}
          {hours.map(h => <option key={h} value={h}>{h}시</option>)}
        </select>
        {!legacy && <select aria-label={`${label} 분`} disabled={!hour} value={minute || "00"}
          onChange={event => onChange(`${hour}:${event.target.value}`)}>
          <option value="00">00분</option>
          <option value="30">30분</option>
        </select>}
      </div>
      <input type="hidden" name={name} value={value} />
    </div>
  );
}
