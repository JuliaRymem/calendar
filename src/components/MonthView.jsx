import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  format,
  parseISO,
  isBefore,
  isAfter,
  startOfDay,
  endOfDay,
  getISOWeek,
} from "date-fns";
import { sv } from "date-fns/locale";
import { useCalendar } from "../context/CalendarContext";
import { useEvents } from "../context/EventsContext";
import { useLabels } from "../context/LabelsContext";
import { useState } from "react";
import EventModal from "./EventModal";

function overlapsDay(evt, day) {
  const s = parseISO(evt.start);
  const e = parseISO(evt.end);
  const from = startOfDay(day);
  const to = endOfDay(day);
  return isBefore(s, to) && isAfter(e, from);
}

export default function MonthView() {
  const {
    viewCursor,
    selectedDate,
    setSelectedDate,
    showWeekNumbers,
    filterLabelId,
  } = useCalendar();
  const { events } = useEvents();
  const { mapById } = useLabels();

  const [open, setOpen] = useState(false);
  const [editEvent, setEditEvent] = useState(null);

  const monthStart = startOfMonth(viewCursor);
  const monthEnd = endOfMonth(viewCursor);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = [];
  let d = gridStart;
  while (d <= gridEnd) {
    days.push(d);
    d = addDays(d, 1);
  }

  // veckogrupper för att kunna rendera radvis
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <div className="rounded-xl border overflow-hidden">
      {/* Rubrikrad */}
      <div
        className={`grid ${
          showWeekNumbers
            ? "grid-cols-[auto_repeat(7,minmax(0,1fr))]"
            : "grid-cols-7"
        } bg-gray-50 text-center text-xs font-medium uppercase dark:bg-zinc-900`}
      >
        {showWeekNumbers && <div className="py-2">V</div>}
        {["Mån", "Tis", "Ons", "Tors", "Fre", "Lör", "Sön"].map((d) => (
          <div key={d} className="py-2">
            {d}
          </div>
        ))}
      </div>

      {/* Veckorader */}
      <div className="divide-y border-t text-sm">
        {weeks.map((week, wi) => {
          const weekNumber = getISOWeek(week[0]);
          return (
            <div
              key={wi}
              className={`grid ${
                showWeekNumbers
                  ? "grid-cols-[auto_repeat(7,minmax(0,1fr))]"
                  : "grid-cols-7"
              }`}
            >
              {showWeekNumbers && (
                <div className="flex items-center justify-center border-r bg-gray-50 text-xs text-gray-500 dark:bg-zinc-900 dark:text-gray-400">
                  {weekNumber}
                </div>
              )}

              {week.map((day, i) => {
                const inMonth = isSameMonth(day, monthStart);
                const dayEvents = events.filter(
                  (e) =>
                    (!filterLabelId ? true : e.labelId === filterLabelId) &&
                    overlapsDay(e, day)
                );

                // plocka unika etiketter
                const labelSet = new Map();
                dayEvents.forEach((e) => {
                  const lab = e.labelId ? mapById.get(e.labelId) : null;
                  const color = lab?.color ?? e.color ?? "#6366f1";
                  const name = lab?.name ?? e.label ?? "Övrigt";
                  labelSet.set(name, color);
                });
                const labels = Array.from(labelSet.entries());

                return (
                  <div
                    key={i}
                    className={`relative h-24 border-r p-1 ${
                      inMonth
                        ? "bg-white dark:bg-black"
                        : "bg-gray-50 text-gray-400 dark:bg-zinc-900 dark:text-gray-600"
                    }`}
                    onClick={() => setSelectedDate(day)}
                  >
                    {/* Datum */}
                    <div
                      className={`mb-1 text-right text-xs ${
                        isSameDay(day, selectedDate)
                          ? "rounded bg-indigo-500 px-1 text-white"
                          : ""
                      }`}
                    >
                      {format(day, "d", { locale: sv })}
                    </div>

                    {/* Etikettprickar */}
                    <div className="flex flex-wrap gap-1">
                      {labels.slice(0, 4).map(([name, color]) => (
                        <span
                          key={name}
                          className="h-2 w-2 rounded-full"
                          style={{ background: color }}
                          title={name} // tooltip!
                        />
                      ))}
                      {labels.length > 4 && (
                        <span
                          className="text-[10px] text-gray-500"
                          title={labels
                            .slice(4)
                            .map(([name]) => name)
                            .join(", ")}
                        >
                          +{labels.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      <EventModal
        open={open}
        onClose={() => setOpen(false)}
        editEvent={editEvent}
      />
    </div>
  );
}