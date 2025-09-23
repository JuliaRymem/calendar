import { addDays, startOfWeek, parseISO, isBefore, isAfter, startOfDay, endOfDay } from "date-fns";
import { sv } from "date-fns/locale";
import { format } from "date-fns";
import { useCalendar } from "../context/CalendarContext";
import { useEvents } from "../context/EventsContext";
import TimeGrid, { NowLine } from "./TimeGrid";
import EventBlock from "./EventBlock";
import { HOUR_PX, yToDate, SNAP_MIN } from "../utils/layout";
import { useMemo, useRef, useState } from "react";
import EventModal from "./EventModal";

function overlapsDay(evt, day) {
  const s = parseISO(evt.start);
  const e = parseISO(evt.end);
  const from = startOfDay(day);
  const to = endOfDay(day);
  return isBefore(s, to) && isAfter(e, from);
}

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
        (lanes[lane] ||= []).push(ev);
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
  const { viewCursor, filterLabel } = useCalendar();
  const { events, addEvent, updateEvent } = useEvents();
  const weekStart = startOfWeek(viewCursor, { weekStartsOn: 1, locale: sv });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const [open, setOpen] = useState(false);
  const [editEvent, setEditEvent] = useState(null);

  // --- Skapa via drag ---
  const containerRefs = useRef({}); // per dag: ref till kolumn
  const [draft, setDraft] = useState(null); // {dayIndex, startISO, endISO, color, label}

  function beginCreate(dayIndex, e) {
    const col = containerRefs.current[dayIndex];
    const rect = col.getBoundingClientRect();
    const y = e.clientY - rect.top - 28; // minus headerhöjd i kolumnen
    const base = days[dayIndex];
    const start = yToDate(base, Math.max(0, Math.min(y, 24 * HOUR_PX)));
    setDraft({ dayIndex, start, end: new Date(start), color: "#6366f1", label: "Övrigt" });
    window.addEventListener("mousemove", dragCreate);
    window.addEventListener("mouseup", endCreate);
  }
  function dragCreate(e) {
    setDraft((d) => {
      if (!d) return d;
      const col = containerRefs.current[d.dayIndex];
      const rect = col.getBoundingClientRect();
      const y = e.clientY - rect.top - 28;
      const end = yToDate(days[d.dayIndex], Math.max(0, Math.min(y, 24 * HOUR_PX)));
      return { ...d, end };
    });
  }
  function endCreate() {
    window.removeEventListener("mousemove", dragCreate);
    window.removeEventListener("mouseup", endCreate);
    setDraft((d) => {
      if (!d) return null;
      let [start, end] = d.start <= d.end ? [d.start, d.end] : [d.end, d.start];
      if (start.getTime() === end.getTime()) end = new Date(start.getTime() + SNAP_MIN * 60000);
      addEvent({
        title: "Ny händelse",
        allDay: false,
        start: start.toISOString(),
        end: end.toISOString(),
        color: d.color,
        label: d.label,
      });
      return null;
    });
  }

  // --- Drag/resize av befintliga ---
  const dragState = useRef(null); // {id, type:'move'|'start'|'end', startY, baseStart, baseEnd, dayIndex}

  function onBlockDragStart(event, e, dayIndex) {
    const col = containerRefs.current[dayIndex];
    const rect = col.getBoundingClientRect();
    dragState.current = {
      id: event.id, type: "move", startY: e.clientY, rectTop: rect.top,
      baseStart: new Date(event.start), baseEnd: new Date(event.end), dayIndex
    };
    window.addEventListener("mousemove", onDragMove);
    window.addEventListener("mouseup", onDragEnd);
  }

  function onBlockResizeStart(event, edge, e, dayIndex) {
    const col = containerRefs.current[dayIndex];
    const rect = col.getBoundingClientRect();
    dragState.current = {
      id: event.id, type: edge, startY: e.clientY, rectTop: rect.top,
      baseStart: new Date(event.start), baseEnd: new Date(event.end), dayIndex
    };
    window.addEventListener("mousemove", onDragMove);
    window.addEventListener("mouseup", onDragEnd);
  }

  function onDragMove(e) {
    const s = dragState.current;
    if (!s) return;
    const dy = e.clientY - s.rectTop - 28; // relativ y i kolumnen
    const base = days[s.dayIndex];
    const current = yToDate(base, Math.max(0, Math.min(dy, 24 * HOUR_PX)));

    if (s.type === "move") {
      const deltaMin = (current - yToDate(base, s.startY - s.rectTop - 28)) / 60000;
      const newStart = new Date(s.baseStart.getTime() + deltaMin * 60000);
      const newEnd = new Date(s.baseEnd.getTime() + deltaMin * 60000);
      updateEvent(s.id, { start: newStart.toISOString(), end: newEnd.toISOString() });
    } else if (s.type === "start") {
      if (current < s.baseEnd) updateEvent(s.id, { start: current.toISOString() });
    } else if (s.type === "end") {
      if (current > s.baseStart) updateEvent(s.id, { end: current.toISOString() });
    }
  }

  function onDragEnd() {
    window.removeEventListener("mousemove", onDragMove);
    window.removeEventListener("mouseup", onDragEnd);
    dragState.current = null;
  }

  return (
    <div className="relative grid grid-cols-[auto_repeat(7,minmax(0,1fr))] rounded-xl border overflow-hidden">
      <TimeGrid />

      {days.map((day, idx) => {
        const filtered = events.filter(e => filterLabel === "Alla" || e.label === filterLabel);
        const allDay = filtered.filter((e) => e.allDay && overlapsDay(e, day));
        const timedRaw = filtered.filter((e) => !e.allDay && overlapsDay(e, day)).sort((a, b) => (a.start < b.start ? -1 : 1));
        const timed = layoutLanes(timedRaw);

        return (
          <div
            key={day}
            ref={(el) => (containerRefs.current[idx] = el)}
            className="relative border-l border-gray-200 dark:border-zinc-800"
            onMouseDown={(e) => beginCreate(idx, e)}
          >
            <div className="sticky top-0 z-20 bg-white px-2 py-1 text-center text-sm font-medium dark:bg-zinc-900">
              {format(day, "EEE d", { locale: sv })}
            </div>

            {allDay.length > 0 && (
              <div className="sticky top-7 z-10 flex flex-wrap gap-1 bg-white px-2 py-1 dark:bg-zinc-900">
                {allDay.map((e) => (
                  <span key={e.id} className="rounded-full border px-2 py-0.5 text-[10px]" style={{ borderColor: `${e.color}80`, background: `${e.color}1f` }}>
                    {e.title}
                  </span>
                ))}
              </div>
            )}

            {Array.from({ length: 24 }, (_, h) => (
              <div key={h} className="h-16 border-b border-gray-200 dark:border-zinc-800" />
            ))}

            <div className="pointer-events-none absolute left-0 right-0 top-[28px]" style={{ height: 24 * HOUR_PX }}>
              {timed.map((e) => (
                <EventBlock
                  key={e.id}
                  event={e}
                  lane={e.lane}
                  lanes={e.lanes}
                  onEdit={(ev) => { setEditEvent(ev); setOpen(true); }}
                  onDragStart={(ev, mdEvent) => onBlockDragStart(ev, mdEvent, idx)}
                  onResizeStart={(ev, edge, mdEvent) => onBlockResizeStart(ev, edge, mdEvent, idx)}
                />
              ))}

              {/* Draft vid skapande */}
              {draft && draft.dayIndex === idx && (
                <div
                  className="absolute left-1 right-1 rounded-md border border-dashed"
                  style={{
                    top: Math.min(yToDate(days[idx], 0), draft.start) && Math.min(
                      (draft.start.getHours()*60+draft.start.getMinutes())/60*HOUR_PX,
                      (draft.end.getHours()*60+draft.end.getMinutes())/60*HOUR_PX
                    ),
                  }}
                />
              )}
            </div>
          </div>
        );
      })}

      <NowLine />

      <EventModal open={open} onClose={() => setOpen(false)} editEvent={editEvent} />
    </div>
  );
}