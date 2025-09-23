import { addMonths } from "date-fns";
import { fmtMonthTitle } from "../utils/date";
import { useCalendar } from "../context/CalendarContext";

export default function CalendarHeader() {
  const { viewCursor, setViewCursor } = useCalendar();

  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="text-2xl font-semibold capitalize">
        {fmtMonthTitle(viewCursor)}
      </div>
      <div className="flex gap-2">
        <button
          className="rounded-md border px-3 py-1 text-sm"
          onClick={() => setViewCursor(addMonths(viewCursor, -1))}
        >
          ← Föregående
        </button>
        <button
          className="rounded-md border px-3 py-1 text-sm"
          onClick={() => setViewCursor(new Date())}
        >
          Idag
        </button>
        <button
          className="rounded-md border px-3 py-1 text-sm"
          onClick={() => setViewCursor(addMonths(viewCursor, 1))}
        >
          Nästa →
        </button>
      </div>
    </div>
  );
}