import { useCalendar } from "../context/CalendarContext";
import { useLabels } from "../context/LabelsContext";

export default function ViewToolbar({ onToday }) {
  const { filterLabelId, setFilterLabelId } = useCalendar();
  const { labels } = useLabels();

  return (
    <div className="md:hidden mb-3 flex items-center justify-between">
      <button className="btn btn-primary" onClick={onToday}>Idag</button>
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
      </div>
    </div>
  );
}