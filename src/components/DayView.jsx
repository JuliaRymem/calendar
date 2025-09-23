import { addDays, format } from "date-fns";
import { sv } from "date-fns/locale";
import { useCalendar } from "../context/CalendarContext";
import { NowLine } from "./TimeGrid";

export default function DayView() {
  const { selectedDate, setSelectedDate } = useCalendar();
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="relative rounded-xl border overflow-hidden">
      {/* Header med navigation */}
      <div className="flex items-center justify-between border-b bg-white px-4 py-2 dark:bg-zinc-900">
        <button
          className="rounded-md border px-3 py-1 text-sm"
          onClick={() => setSelectedDate(addDays(selectedDate, -1))}
        >
          ← Föregående
        </button>
        <div className="text-lg font-medium capitalize">
          {format(selectedDate, "EEEE d LLLL yyyy", { locale: sv })}
        </div>
        <button
          className="rounded-md border px-3 py-1 text-sm"
          onClick={() => setSelectedDate(addDays(selectedDate, 1))}
        >
          Nästa →
        </button>
      </div>

      {/* Timraster */}
      <div className="relative">
        {hours.map((h) => (
          <div
            key={h}
            className="h-16 border-b border-gray-200 dark:border-zinc-800 relative"
          >
            <div className="absolute left-2 top-0 text-xs text-gray-500 dark:text-gray-400">
              {String(h).padStart(2, "0")}:00
            </div>
          </div>
        ))}
      </div>

      {/* Nu-linjen */}
      <NowLine />
    </div>
  );
}