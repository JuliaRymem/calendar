import { addDays, format, parseISO } from "date-fns";
import { sv } from "date-fns/locale";
import { useCalendar } from "../context/CalendarContext";
import { useEvents } from "../context/EventsContext";
import { HOUR_PX } from "../utils/layout";
import EventBlock from "./EventBlock";
import { NowLine } from "./TimeGrid";
import { endOfDay, isAfter, isBefore, startOfDay } from "date-fns";
import { useMemo, useState } from "react";
import EventModal from "./EventModal";

function overlapsDay(evt, day) {
  const s = parseISO(evt.start);
  const e = parseISO(evt.end);
  const from = startOfDay(day);
  const to = endOfDay(day);
  return isBefore(s, to) && isAfter(e, from);
}

export default function DayView() {
  const { selectedDate, setSelectedDate } = useCalendar();
  const { events } = useEvents();
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const allDay = useMemo(
    () => events.filter((e) => e.allDay && overlapsDay(e, selectedDate)),
    [events, selectedDate]
  );
  const timed = useMemo(
    () => events.filter((e) => !e.allDay && overlapsDay(e, selectedDate)).sort((a, b) => (a.start < b.start ? -1 : 1)),
    [events, selectedDate]
  );

  const [open, setOpen] = useState(false);
  const [editEvent, setEditEvent] = useState(null);

  return (
    <div className="relative overflow-hidden rounded-xl border">
      {/* Header med navigation */}
      <div className="flex items-center justify-between border-b bg-white px-4 py-2 dark:bg-zinc-900">
        <button
          className="rounded-md border px-3 py-1 text-sm"
          onClick={() => setSelectedDate(addDays(selectedDate, -1))}
        >
          ← Föregående
        </button>
        <div className="text-lg font-medium capitalize">
          {format(selectedDate, "EEEE d LLLL yyyy", { locale: sv })}
        </div>
        <button
          className="rounded-md border px-3 py-1 text-sm"
          onClick={() => setSelectedDate(addDays(selectedDate, 1))}
        >
          Nästa →
        </button>
      </div>

      {/* Heldag chips */}
      {allDay.length > 0 && (
        <div className="sticky top-10 z-10 flex flex-wrap gap-1 bg-white px-4 py-2 dark:bg-zinc-900">
          {allDay.map((e) => (
            <button
              key={e.id}
              onClick={() => { setEditEvent(e); setOpen(true); }}
              className="rounded-full border border-indigo-300/60 bg-indigo-500/10 px-2 py-0.5 text-[10px]"
              title={e.title}
            >
              {e.title}
            </button>
          ))}
        </div>
      )}

      {/* Timraster */}
      <div className="relative">
        {hours.map((h) => (
          <div key={h} className="relative h-16 border-b border-gray-200 dark:border-zinc-800">
            <div className="absolute left-2 top-0 text-xs text-gray-500 dark:text-gray-400">
              {String(h).padStart(2, "0")}:00
            </div>
          </div>
        ))}

        {/* Timade event-blocks */}
        <div className="pointer-events-none absolute left-16 right-0" style={{ height: 24 * HOUR_PX, top: 0 }}>
          {timed.map((e) => (
            <EventBlock
              key={e.id}
              event={e}
              onClick={(ev) => {
                ev.preventDefault();
                ev.stopPropagation();
                setEditEvent(e);
                setOpen(true);
              }}
            />
          ))}
        </div>
      </div>

      {/* Nu-linjen */}
      <NowLine />

      {/* Modal */}
      <EventModal open={open} onClose={() => setOpen(false)} editEvent={editEvent} />
    </div>
  );
}