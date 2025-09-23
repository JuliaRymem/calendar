import { clsx } from "clsx";
import { fmtDayNum, isOutsideMonth, isSelected, isTodayFn } from "../utils/date";
import { useCalendar } from "../context/CalendarContext";

export default function DayCell({ day, monthCursor }) {
  const { selectedDate, setSelectedDate } = useCalendar();
  const outside = isOutsideMonth(day, monthCursor);
  const today = isTodayFn(day);
  const selected = isSelected(day, selectedDate);

  function handleKeyDown(e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setSelectedDate(day);
    }
  }

  return (
    <button
      type="button"
      onClick={() => setSelectedDate(day)}
      onKeyDown={handleKeyDown}
      className={clsx(
        "min-h-24 w-full rounded-xl border p-2 text-left transition",
        "focus:outline-none focus:ring-2 focus:ring-indigo-500",
        outside
          ? "bg-gray-50 text-gray-400 dark:bg-zinc-900/40 dark:text-zinc-500"
          : "bg-white dark:bg-zinc-900",
        selected && "ring-2 ring-indigo-500",
        "hover:shadow-sm"
      )}
      aria-current={today ? "date" : undefined}
      aria-pressed={selected}
    >
      <div className="flex items-center justify-between">
        <span className={clsx("text-sm", outside && "line-through opacity-60")}>
          {fmtDayNum(day)}
        </span>
        {today && (
          <span className="inline-flex items-center justify-center rounded-full border px-2 text-[10px]">
            Idag
          </span>
        )}
      </div>
      {/* plats för små event-taggar senare */}
    </button>
  );
}