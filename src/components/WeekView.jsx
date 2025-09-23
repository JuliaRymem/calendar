import { addDays, startOfWeek } from "date-fns";
import { sv } from "date-fns/locale";
import { format } from "date-fns";
import { useCalendar } from "../context/CalendarContext";
import TimeGrid, { NowLine } from "./TimeGrid";

export default function WeekView() {
  const { viewCursor } = useCalendar();
  const weekStart = startOfWeek(viewCursor, { weekStartsOn: 1, locale: sv });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="relative grid grid-cols-[auto_repeat(7,minmax(0,1fr))] border rounded-xl overflow-hidden">
      {/* Vänster kolumn = timmar */}
      <TimeGrid />

      {/* Dagar */}
      {days.map((day) => (
        <div key={day} className="relative col-span-1 border-l border-gray-200 dark:border-zinc-800">
          {/* Header med datum */}
          <div className="sticky top-0 z-20 bg-white px-2 py-1 text-center text-sm font-medium dark:bg-zinc-900">
            {format(day, "EEE d", { locale: sv })}
          </div>
          {/* 24 timmar */}
          {Array.from({ length: 24 }, (_, h) => (
            <div
              key={h}
              className="h-16 border-b border-gray-200 dark:border-zinc-800"
            />
          ))}
        </div>
      ))}

      {/* Nu-linjen */}
      <NowLine />
    </div>
  );
}