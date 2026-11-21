import { formatYearMonth, thisYearMonth } from "../lib/utils";
import { MonthControls } from "./ScheduleControls";

export default function ReportMonth({
  value,
  onChange,
  disabled = false,
}: {
  value: string;
  onChange: (month: string) => void;
  disabled?: boolean;
}) {
  function move(offset: number) {
    const [year, month] = value.split("-").map(Number);
    const next = new Date(Date.UTC(year, month - 1 + offset, 1));
    onChange(next.toISOString().slice(0, 7));
  }
  return (
    <fieldset disabled={disabled} aria-label="조회할 월" style={{ minWidth: 0 }}>
      <MonthControls
        label={formatYearMonth(value)}
        onPrevious={() => move(-1)}
        onNext={() => move(1)}
        todayLabel="이번 달"
        onToday={() => onChange(thisYearMonth())}
      />
    </fieldset>
  );
}
