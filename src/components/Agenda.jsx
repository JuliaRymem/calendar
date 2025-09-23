import { useMemo, useState } from "react";
import {
  format,
  startOfDay,
  endOfDay,
  isBefore,
  isAfter,
  parseISO,
} from "date-fns";
import { sv } from "date-fns/locale";
import { useCalendar } from "../context/CalendarContext";
import { useEvents } from "../context/EventsContext";
import EventModal from "./EventModal";

function overlapsDay(evt, day) {
  const s = parseISO(evt.start);
  const e = parseISO(evt.end);
  const from = startOfDay(day);
  const to = endOfDay(day);
  return isBefore(s, to) && isAfter(e, from);
}

export default function Agenda() {
  const { selectedDate, filterLabel } = useCalendar();
  const { events } = useEvents();

  const [open, setOpen] = useState(false);
  const [editEvent, setEditEvent] = useState(null);

  const labelDate = format(selectedDate, "EEEE d LLLL yyyy", { locale: sv });

  const visibleEvents = useMemo(() => {
    const filtered =
      filterLabel === "Alla"
        ? events
        : events.filter((e) => e.label === filterLabel);

    return filtered
      .filter((e) => overlapsDay(e, selectedDate))
      .sort((a, b) => (a.start < b.start ? -1 : 1));
  }, [events, selectedDate, filterLabel]);

  return (
    <div className="mt-6 rounded-xl border bg-white p-4 dark:bg-zinc-900">
      {/* Header */}
      <div className="mb-2 flex items-center justify-between">
        <div className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Agenda
        </div>
        <button
          className="rounded-md border px-3 py-1 text-sm"
          onClick={() => {
            setEditEvent(null);
            setOpen(true);
          }}
        >
          Ny händelse
        </button>
      </div>

      {/* Datumrad */}
      <div className="mb-3 text-lg font-medium capitalize">{labelDate}</div>

      {/* Lista */}
      {visibleEvents.length === 0 ? (
        <div className="text-sm text-gray-600 dark:text-gray-300">
          Inga händelser ännu.
        </div>
      ) : (
        <ul className="space-y-2">
          {visibleEvents.map((e) => {
            const start = parseISO(e.start);
            const end = parseISO(e.end);
            return (
              <li key={e.id}>
                <button
                  className="w-full rounded-lg border px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-zinc-800/60"
                  onClick={() => {
                    setEditEvent(e);
                    setOpen(true);
                  }}
                  title="Klicka för att redigera"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block h-2.5 w-2.5 rounded-full"
                        style={{ background: e.color }}
                        aria-hidden="true"
                      />
                      <div className="font-medium">{e.title}</div>
                      <span
                        className="rounded-full border px-1.5 text-[10px]"
                        style={{ borderColor: `${e.color}66` }}
                      >
                        {e.label || "Övrigt"}
                      </span>
                    </div>
                    <div className="shrink-0 text-xs text-gray-500">
                      {e.allDay
                        ? "Heldag"
                        : `${format(start, "HH:mm")}–${format(end, "HH:mm")}`}
                    </div>
                  </div>
                  {e.notes && (
                    <div className="mt-1 text-xs text-gray-500">{e.notes}</div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {/* Modal för skapa/redigera */}
      <EventModal
        open={open}
        onClose={() => setOpen(false)}
        editEvent={editEvent}
      />
    </div>
  );
}