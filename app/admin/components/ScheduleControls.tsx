import { TECHS, type Tech } from "../lib/constants";
import s from "../operations.module.css";

export function MonthControls({
  label,
  onPrevious,
  onNext,
  onToday,
  todayLabel = "오늘",
  unit = "달",
}: {
  label: string;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  todayLabel?: string;
  unit?: "달" | "주";
}) {
  return (
    <div className={s.monthControls}>
      <h2>{label}</h2>
      <div className={s.monthButtons}>
        <button
          type="button"
          className={s.arrow}
          aria-label={`이전 ${unit}`}
          onClick={onPrevious}
        >
          ‹
        </button>
        <button type="button" className={s.today} onClick={onToday}>
          {todayLabel}
        </button>
        <button
          type="button"
          className={s.arrow}
          aria-label={`다음 ${unit}`}
          onClick={onNext}
        >
          ›
        </button>
      </div>
    </div>
  );
}

export function TechnicianFilter({
  value,
  onChange,
  isAdmin,
  loggedUser,
}: {
  value: Tech | "전체";
  onChange: (value: Tech | "전체") => void;
  isAdmin: boolean;
  loggedUser: string | null;
}) {
  if (!isAdmin) return <span className={s.assignedUser}>{loggedUser}</span>;
  return (
    <select
      aria-label="담당 기사 필터"
      value={value}
      onChange={(e) => onChange(e.target.value as Tech | "전체")}
      className={s.filterSelect}
    >
      <option value="전체">전체 기사</option>
      {TECHS.map((tech) => (
        <option key={tech} value={tech}>
          {tech}
        </option>
      ))}
    </select>
  );
}
