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
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-2xl font-semibold capitalize tracking-tight">
          {fmtMonthTitle(viewCursor)}
        </div>
        <div className="flex gap-2">
          <button className="btn" onClick={() => setViewCursor(addMonths(viewCursor, -1))}>← Föregående</button>
          <button className="btn btn-primary" onClick={() => setViewCursor(new Date())}>Idag</button>
          <button className="btn" onClick={() => setViewCursor(addMonths(viewCursor, 1))}>Nästa →</button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm">
        <label className="chip">
          <input type="checkbox" className="mr-2" checked={showWeekNumbers} onChange={(e) => setShowWeekNumbers(e.target.checked)} />
          Veckonummer
        </label>

        <div className="inline-flex items-center gap-2">
          <span className="subtle">Tema</span>
          <select className="select" value={theme} onChange={(e) => setTheme(e.target.value)}>
            <option value="system">System</option>
            <option value="light">Ljust</option>
            <option value="dark">Mörkt</option>
          </select>
        </div>

        <div className="inline-flex items-center gap-2">
          <span className="subtle">Filter</span>
          <select
            className="select"
            value={filterLabelId ?? ""}
            onChange={(e) => setFilterLabelId(e.target.value || null)}
          >
            <option value="">Alla</option>
            {labels.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
          </select>

          <button className="btn" onClick={() => setManageOpen(true)}>
            Hantera etiketter
          </button>
        </div>
      </div>

      {/* Snabbchips med färgprick */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <button onClick={() => setFilterLabelId(null)} className={`chip ${filterLabelId === null ? "ring-2 ring-brand-500/30" : ""}`}>Alla</button>
        {labels.map((l) => (
          <button
            key={l.id}
            onClick={() => setFilterLabelId(filterLabelId === l.id ? null : l.id)}
            className={`chip ${filterLabelId === l.id ? "ring-2 ring-brand-500/30" : ""}`}
          >
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: l.color }} />
            {l.name}
          </button>
        ))}
      </div>

      <LabelManager open={manageOpen} onClose={() => setManageOpen(false)} />
    </div>
  );
}