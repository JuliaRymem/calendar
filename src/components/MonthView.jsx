import { WEEKDAY_LABELS } from "../utils/date";
import { useCalendar } from "../context/CalendarContext";
import { useMonthGrid } from "../hooks/useMonthGrid";
import DayCell from "./DayCell";

export default function MonthView() {
  const { viewCursor } = useCalendar();
  const days = useMonthGrid(viewCursor);

  return (
    <div role="grid" aria-label="Kalender månadsvy">
      {/* Veckodagar */}
      <div className="mb-1 grid grid-cols-7 text-center text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
        {WEEKDAY_LABELS.map((w) => (
          <div key={w} className="py-2">
            {w}
          </div>
        ))}
      </div>

      {/* Raster */}
      <div className="grid grid-cols-7 gap-1" role="rowgroup">
        {days.map((day, i) => (
          <div key={i} role="gridcell">
            <DayCell day={day} monthCursor={viewCursor} />
          </div>
        ))}
      </div>
    </div>
  );
}