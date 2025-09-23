import { addDays, format, parseISO, startOfDay, endOfDay, isBefore, isAfter, isSameDay } from "date-fns";
import { sv } from "date-fns/locale";
import { useCalendar } from "../context/CalendarContext";
import { useEvents } from "../context/EventsContext";
import { HOUR_PX, yToDate } from "../utils/layout";
import EventBlock from "./EventBlock";
import { NowLine } from "./TimeGrid";
import { useMemo, useRef, useState } from "react";
import EventModal from "./EventModal";
import ViewToolbar from "./ViewToolbar";

function overlapsDay(evt, day) {
  const s = parseISO(evt.start);
  const e = parseISO(evt.end);
  const from = startOfDay(day);
  const to = endOfDay(day);
  return isBefore(s, to) && isAfter(e, from);
}

export default function DayView() {
  const { selectedDate, setSelectedDate, filterLabelId } = useCalendar();
  const { events, addEvent, updateEvent } = useEvents();
  const containerRef = useRef(null);

  const filtered = useMemo(() => events.filter((e) => (!filterLabelId ? true : e.labelId === filterLabelId)), [events, filterLabelId]);
  const allDay = useMemo(() => filtered.filter((e) => e.allDay && overlapsDay(e, selectedDate)), [filtered, selectedDate]);
  const timed = useMemo(() => filtered.filter((e) => !e.allDay && overlapsDay(e, selectedDate)).sort((a, b) => (a.start < b.start ? -1 : 1)), [filtered, selectedDate]);

  const [open, setOpen] = useState(false);
  const [editEvent, setEditEvent] = useState(null);

  function onBackgroundMouseDown(e) {
    const rect = containerRef.current.getBoundingClientRect();
    const y0 = e.clientY - rect.top;
    const start = yToDate(selectedDate, Math.max(0, Math.min(y0, 24 * HOUR_PX)));
    let end = new Date(start.getTime() + 30 * 60000);
    const move = (mm) => { const yy = mm.clientY - rect.top; end = yToDate(selectedDate, Math.max(0, Math.min(yy, 24 * HOUR_PX))); };
    const up = () => {
      window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up);
      const [s, e2] = start <= end ? [start, end] : [end, start];
      addEvent({ title: "Ny händelse", allDay: false, start: s.toISOString(), end: e2.toISOString(), color: "#6366f1", label: "Övrigt" });
    };
    window.addEventListener("mousemove", move); window.addEventListener("mouseup", up);
  }

  function onDragStart(ev, mdEvent) {
    const rect = containerRef.current.getBoundingClientRect();
    const y0 = mdEvent.clientY - rect.top;
    const s0 = new Date(ev.start); const e0 = new Date(ev.end);
    const move = (mm) => {
      const yy = mm.clientY - rect.top;
      const current = yToDate(selectedDate, Math.max(0, Math.min(yy, 24 * HOUR_PX)));
      const base = yToDate(selectedDate, y0);
      const deltaMin = (current - base) / 60000;
      updateEvent(ev.id, { start: new Date(s0.getTime() + deltaMin * 60000).toISOString(), end: new Date(e0.getTime() + deltaMin * 60000).toISOString() });
    };
    const up = () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); };
    window.addEventListener("mousemove", move); window.addEventListener("mouseup", up);
  }

  function onResizeStart(ev, edge) {
    const rect = containerRef.current.getBoundingClientRect();
    const move = (mm) => {
      const yy = mm.clientY - rect.top;
      const current = yToDate(selectedDate, Math.max(0, Math.min(yy, 24 * HOUR_PX)));
      if (edge === "start" && current < parseISO(ev.end)) updateEvent(ev.id, { start: current.toISOString() });
      if (edge === "end" && current > parseISO(ev.start)) updateEvent(ev.id, { end: current.toISOString() });
    };
    const up = () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); };
    window.addEventListener("mousemove", move); window.addEventListener("mouseup", up);
  }

  return (
    <div className="relative">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <button className="btn" onClick={() => setSelectedDate(addDays(selectedDate, -1))}>← Föregående</button>
        <div className={`text-lg font-medium capitalize ${isSameDay(selectedDate, new Date()) ? "text-red-600" : ""}`}>
          {format(selectedDate, "EEEE d LLLL yyyy", { locale: sv })}
        </div>
        <button className="btn" onClick={() => setSelectedDate(addDays(selectedDate, 1))}>Nästa →</button>
      </div>

      {/* Mobil: idag + filter */}
      <ViewToolbar onToday={() => setSelectedDate(new Date())} />

      {/* Heldag chips */}
      {allDay.length > 0 && (
        <div className="sticky top-10 z-10 mb-2 flex flex-wrap gap-1">
          {allDay.map((e) => (
            <span key={e.id} className="chip" style={{ borderColor: `${e.color}55`, background: `${e.color}12` }}>{e.title}</span>
          ))}
        </div>
      )}

      {/* Raster */}
      <div className="relative" ref={containerRef} onMouseDown={onBackgroundMouseDown}>
        {Array.from({ length: 24 }, (_, h) => (
          <div key={h} className="relative h-16 grid-line">
            <div className="absolute left-2 top-0 text-xs text-gray-500">{String(h).padStart(2, "0")}:00</div>
          </div>
        ))}

        <div className="pointer-events-none absolute inset-0">
          {timed.map((e) => (
            <EventBlock
              key={e.id}
              event={e}
              onEdit={(ev) => { setEditEvent(ev); setOpen(true); }}
              onDragStart={(ev, md) => onDragStart(ev, md)}
              onResizeStart={(ev, edge) => onResizeStart(ev, edge)}
            />
          ))}
        </div>
      </div>

      <NowLine />
      <EventModal open={open} onClose={() => setOpen(false)} editEvent={editEvent} />
    </div>
  );
}