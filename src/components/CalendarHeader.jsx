import { addMonths } from "date-fns";
import { fmtMonthTitle } from "../utils/date";
import { useCalendar } from "../context/CalendarContext";
import { useLabels } from "../context/LabelsContext";
import { useState } from "react";
import LabelManager from "./LabelManager";

export default function CalendarHeader() {
  const {
    viewCursor, setViewCursor,
    showWeekNumbers, setShowWeekNumbers,
    theme, setTheme,
    filterLabelId, setFilterLabelId,
  } = useCalendar();
  const { labels } = useLabels();

  const [manageOpen, setManageOpen] = useState(false);

  return (
    <div className="mb-4 space-y-3">
      {/* --- Månadstitel och navigation --- */}
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

      {/* --- Inställningar --- */}
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

        <div className="inline-flex items-center gap-2">
          <button
            className="rounded-md border px-2 py-1"
            onClick={() => setManageOpen(true)}
          >
            Hantera etiketter
          </button>
        </div>
      </div>

      {/* --- Snabbfilter med chips --- */}
      <div className="flex flex-wrap items-center gap-2 pt-2">
        <button
          onClick={() => setFilterLabelId(null)}
          className={`rounded-full border px-3 py-1 text-sm ${
            filterLabelId === null
              ? "bg-indigo-500 text-white"
              : "bg-white dark:bg-zinc-900"
          }`}
        >
          Alla
        </button>
        {labels.map((l) => (
          <button
            key={l.id}
            onClick={() =>
              setFilterLabelId(filterLabelId === l.id ? null : l.id)
            }
            className={`flex items-center gap-2 rounded-full border px-3 py-1 text-sm ${
              filterLabelId === l.id
                ? "ring-2 ring-indigo-500"
                : "bg-white dark:bg-zinc-900"
            }`}
          >
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: l.color }}
            />
            {l.name}
          </button>
        ))}
      </div>

      <LabelManager open={manageOpen} onClose={() => setManageOpen(false)} />
    </div>
  );
}