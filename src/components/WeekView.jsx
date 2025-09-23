import { addDays, startOfWeek, parseISO, isBefore, isAfter, startOfDay, endOfDay } from "date-fns";
import { sv } from "date-fns/locale";
import { format } from "date-fns";
import { useCalendar } from "../context/CalendarContext";
import { useEvents } from "../context/EventsContext";
import TimeGrid, { NowLine } from "./TimeGrid";
import EventBlock from "./EventBlock";
import { HOUR_PX } from "../utils/layout";
import { useMemo, useState } from "react";
import EventModal from "./EventModal";

function overlapsDay(evt, day) {
  const s = parseISO(evt.start);
  const e = parseISO(evt.end);
  const from = startOfDay(day);
  const to = endOfDay(day);
  return isBefore(s, to) && isAfter(e, from);
}

// mycket enkel layout: tilldela “lanes” för överlappande händelser
function layoutLanes(items) {
  const lanes = [];
  const placed = items.map((it) => ({ ...it, lane: 0, lanes: 1 }));
  for (const ev of placed) {
    let lane = 0;
    while (true) {
      const conflict = lanes[lane]?.some(
        (other) => !(parseISO(ev.end) <= parseISO(other.start) || parseISO(ev.start) >= parseISO(other.end))
      );
      if (!conflict) {
        if (!lanes[lane]) lanes[lane] = [];
        lanes[lane].push(ev);
        ev.lane = lane;
        break;
      }
      lane++;
    }
  }
  const laneCount = lanes.length || 1;
  placed.forEach((p) => (p.lanes = laneCount));
  return placed;
}

export default function WeekView() {
  const { viewCursor } = useCalendar();
  const { events } = useEvents();
  const weekStart = startOfWeek(viewCursor, { weekStartsOn: 1, locale: sv });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // modal för redigering via klick på block
  const [open, setOpen] = useState(false);
  const [editEvent, setEditEvent] = useState(null);

  return (
    <div className="relative grid grid-cols-[auto_repeat(7,minmax(0,1fr))] rounded-xl border overflow-hidden">
      {/* Vänster kolumn = timmar */}
      <TimeGrid />

      {/* 7 dagar */}
      {days.map((day) => {
        const allDay = events.filter((e) => e.allDay && overlapsDay(e, day));
        const timedRaw = events
          .filter((e) => !e.allDay && overlapsDay(e, day))
          .sort((a, b) => (a.start < b.start ? -1 : 1));
        const timed = layoutLanes(timedRaw);

        return (
          <div key={day} className="relative border-l border-gray-200 dark:border-zinc-800">
            {/* Dag-header */}
            <div className="sticky top-0 z-20 bg-white px-2 py-1 text-center text-sm font-medium dark:bg-zinc-900">
              {format(day, "EEE d", { locale: sv })}
            </div>

            {/* Heldag chips */}
            {allDay.length > 0 && (
              <div className="sticky top-7 z-10 flex flex-wrap gap-1 bg-white px-2 py-1 dark:bg-zinc-900">
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

            {/* Timraster (tomma rutor) */}
            {Array.from({ length: 24 }, (_, h) => (
              <div key={h} className="h-16 border-b border-gray-200 dark:border-zinc-800" />
            ))}

            {/* Timade events (absoluta block) */}
            <div className="pointer-events-none absolute left-0 right-0 top-[28px]" style={{ height: 24 * HOUR_PX }}>
              {timed.map((e) => (
                <EventBlock
                  key={e.id}
                  event={e}
                  lane={e.lane}
                  lanes={e.lanes}
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
        );
      })}

      {/* Nu-linjen över hela veckan */}
      <NowLine />

      {/* Modal för edit */}
      <EventModal open={open} onClose={() => setOpen(false)} editEvent={editEvent} />
    </div>
  );
}