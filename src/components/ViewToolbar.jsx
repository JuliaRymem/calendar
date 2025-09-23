import { useCalendar } from "../context/CalendarContext";
import { useLabels } from "../context/LabelsContext";

/**
 * Liten verktygsrad för mobil:
 * - Idag-knapp
 * - Etikettfilter (Alla + labels)
 * Visas bara på små skärmar (md:hidden), headern sköter desktop.
 */
export default function ViewToolbar({ onToday }) {
  const { filterLabelId, setFilterLabelId } = useCalendar();
  const { labels } = useLabels();

  return (
    <div className="md:hidden flex items-center gap-2 border-b bg-white px-4 py-2 text-sm dark:bg-zinc-900">
      <button
        className="rounded-md border px-3 py-1"
        onClick={onToday}
      >
        Idag
      </button>

      <div className="ml-auto inline-flex items-center gap-2">
        <span>Filter:</span>
        <select
          className="rounded-md border px-2 py-1"
          value={filterLabelId ?? ""}
          onChange={(e) => setFilterLabelId(e.target.value || null)}
        >
          <option value="">Alla</option>
          {labels.map((l) => (
            <option key={l.id} value={l.id}>{l.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
}