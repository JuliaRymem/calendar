import { useMemo, useState } from "react";
import { format, startOfDay, endOfDay, isBefore, isAfter, parseISO } from "date-fns";
import { sv } from "date-fns/locale";
import { useCalendar } from "../context/CalendarContext";
import { useEvents } from "../context/EventsContext";
import { useLabels } from "../context/LabelsContext";
import EventModal from "./EventModal";

function overlapsDay(evt, day) {
  const s = parseISO(evt.start); const e = parseISO(evt.end);
  const from = startOfDay(day); const to = endOfDay(day);
  return isBefore(s, to) && isAfter(e, from);
}

export default function Agenda() {
  const { selectedDate, filterLabelId } = useCalendar();
  const { events } = useEvents();
  const { mapById } = useLabels();

  const [open, setOpen] = useState(false);
  const [editEvent, setEditEvent] = useState(null);

  const labelDate = format(selectedDate, "EEEE d LLLL yyyy", { locale: sv });

  const visibleEvents = useMemo(() => {
    return events
      .filter((e) => (!filterLabelId ? true : e.labelId === filterLabelId))
      .filter((e) => overlapsDay(e, selectedDate))
      .sort((a, b) => (a.start < b.start ? -1 : 1));
  }, [events, selectedDate, filterLabelId]);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div className="subtle">Agenda</div>
        <button className="btn btn-primary" onClick={() => { setEditEvent(null); setOpen(true); }}>Ny händelse</button>
      </div>

      <div className="mb-3 text-lg font-medium capitalize tracking-tight">{labelDate}</div>

      {visibleEvents.length === 0 ? (
        <div className="text-sm text-gray-600">Inga händelser ännu.</div>
      ) : (
        <ul className="space-y-2">
          {visibleEvents.map((e) => {
            const lab = e.labelId ? mapById.get(e.labelId) : null;
            const color = lab?.color ?? e.color;
            const labelName = lab?.name ?? e.label ?? "Övrigt";
            const start = parseISO(e.start); const end = parseISO(e.end);
            return (
              <li key={e.id}>
                <button
                  className="glass-plain w-full px-3 py-2 text-left hover-glow transition-shadow"
                  onClick={() => { setEditEvent(e); setOpen(true); }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: color }} />
                      <div className="font-medium">{e.title}</div>
                      <span className="chip" style={{ borderColor: `${color}55` }}>{labelName}</span>
                    </div>
                    <div className="shrink-0 text-xs text-gray-500">
                      {e.allDay ? "Heldag" : `${format(start, "HH:mm")}–${format(end, "HH:mm")}`}
                    </div>
                  </div>
                  {e.notes && <div className="mt-1 text-xs text-gray-600">{e.notes}</div>}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <EventModal open={open} onClose={() => setOpen(false)} editEvent={editEvent} />
    </div>
  );
}