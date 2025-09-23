import { addMonths } from "date-fns";
import { fmtMonthTitle } from "../utils/date";
import { useCalendar } from "../context/CalendarContext";

export default function CalendarHeader() {
  const {
    viewCursor, setViewCursor,
    showWeekNumbers, setShowWeekNumbers,
    theme, setTheme
  } = useCalendar();

  return (
    <div className="mb-4 space-y-3">
      {/* Titel + navigering */}
      <div className="flex items-center justify-between">
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

      {/* Inställningar */}
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={showWeekNumbers}
            onChange={(e) => setShowWeekNumbers(e.target.checked)}
          />
          Visa veckonummer
        </label>

        <div className="inline-flex items-center gap-2">
          Tema:
          <select
            className="rounded-md border px-2 py-1"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            <option value="system">System</option>
            <option value="light">Ljust</option>
            <option value="dark">Mörkt</option>
          </select>
        </div>
      </div>
    </div>
  );
}