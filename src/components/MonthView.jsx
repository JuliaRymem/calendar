import {
  addDays, addMonths, addYears,
  startOfWeek, endOfWeek
} from "date-fns";
import { WEEKDAY_LABELS, isoWeek } from "../utils/date";
import { useCalendar } from "../context/CalendarContext";
import { useMonthGrid } from "../hooks/useMonthGrid";
import DayCell from "./DayCell";
import { sv } from "date-fns/locale";

export default function MonthView() {
  const {
    viewCursor, selectedDate, setSelectedDate, setViewCursor, showWeekNumbers
  } = useCalendar();
  const days = useMonthGrid(viewCursor);

  // Dela upp i veckor
  const rows = [];
  for (let i = 0; i < days.length; i += 7) rows.push(days.slice(i, i + 7));

  function onKeyDown(e) {
    if (
      ["ArrowLeft","ArrowRight","ArrowUp","ArrowDown",
       "Home","End","PageUp","PageDown"].includes(e.key)
    ) {
      e.preventDefault();
    }
    switch (e.key) {
      case "ArrowLeft":
        setSelectedDate(addDays(selectedDate, -1)); break;
      case "ArrowRight":
        setSelectedDate(addDays(selectedDate, 1)); break;
      case "ArrowUp":
        setSelectedDate(addDays(selectedDate, -7)); break;
      case "ArrowDown":
        setSelectedDate(addDays(selectedDate, 7)); break;
      case "Home":
        setSelectedDate(startOfWeek(selectedDate, { weekStartsOn: 1, locale: sv }));
        break;
      case "End":
        setSelectedDate(endOfWeek(selectedDate, { weekStartsOn: 1, locale: sv }));
        break;
      case "PageUp":
        if (e.shiftKey) {
          setSelectedDate(addYears(selectedDate, -1));
          setViewCursor(addYears(viewCursor, -1));
        } else {
          setSelectedDate(addMonths(selectedDate, -1));
          setViewCursor(addMonths(viewCursor, -1));
        }
        break;
      case "PageDown":
        if (e.shiftKey) {
          setSelectedDate(addYears(selectedDate, 1));
          setViewCursor(addYears(viewCursor, 1));
        } else {
          setSelectedDate(addMonths(selectedDate, 1));
          setViewCursor(addMonths(viewCursor, 1));
        }
        break;
      default:
    }
  }

  return (
    <div
      role="grid"
      aria-label="Kalender månadsvy"
      tabIndex={0}
      onKeyDown={onKeyDown}
      className="outline-none"
    >
      {/* Veckodagar */}
      <div className="mb-1 grid grid-cols-[auto_repeat(7,minmax(0,1fr))] items-center text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
        {showWeekNumbers ? (
          <div className="px-2 text-center">v.</div>
        ) : (
          <div className="hidden" />
        )}
        {WEEKDAY_LABELS.map((w) => (
          <div key={w} className="py-2 text-center">{w}</div>
        ))}
      </div>

      {/* Raster */}
      <div className="space-y-1">
        {rows.map((week, rIdx) => (
          <div
            key={rIdx}
            className="grid grid-cols-[auto_repeat(7,minmax(0,1fr))] gap-1"
          >
            {showWeekNumbers ? (
              <div className="flex items-center justify-center rounded-xl border bg-gray-50 px-2 text-xs text-gray-600 dark:bg-zinc-900/40 dark:text-zinc-400">
                {isoWeek(week[0])}
              </div>
            ) : (
              <div className="hidden" />
            )}
            {week.map((day, i) => (
              <div key={i} role="gridcell">
                <DayCell day={day} monthCursor={viewCursor} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}