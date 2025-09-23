import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { useCalendar } from "../context/CalendarContext";

export default function Agenda() {
  const { selectedDate } = useCalendar();
  const label = format(selectedDate, "EEEE d LLLL yyyy", { locale: sv });

  return (
    <div className="mt-6 rounded-xl border bg-white p-4 dark:bg-zinc-900">
      <div className="mb-2 text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400">
        Agenda
      </div>
      <div className="mb-3 text-lg font-medium capitalize">{label}</div>

      {/* Placeholder tills du lägger till riktiga events */}
      <div className="text-sm text-gray-600 dark:text-gray-300">
        Inga händelser ännu.
      </div>
    </div>
  );
}