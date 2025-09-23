import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, format, parseISO, isBefore, isAfter, startOfDay, endOfDay, getISOWeek } from "date-fns";
import { sv } from "date-fns/locale";
import { useCalendar } from "../context/CalendarContext";
import { useEvents } from "../context/EventsContext";
import { useLabels } from "../context/LabelsContext";
import ViewToolbar from "./ViewToolbar";

function overlapsDay(evt, day) {
  const s = parseISO(evt.start); const e = parseISO(evt.end);
  const from = startOfDay(day); const to = endOfDay(day);
  return isBefore(s, to) && isAfter(e, from);
}

export default function MonthView() {
  const { viewCursor, setViewCursor, selectedDate, setSelectedDate, showWeekNumbers, filterLabelId } = useCalendar();
  const { events } = useEvents(); const { mapById } = useLabels();

  const monthStart = startOfMonth(viewCursor);
  const monthEnd = endOfMonth(viewCursor);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = []; for (let d = gridStart; d <= gridEnd; d = addDays(d, 1)) days.push(d);
  const weeks = []; for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));

  return (
    <div>
      {/* Mobil: Idag + filter */}
      <ViewToolbar onToday={() => { const t = new Date(); setSelectedDate(t); setViewCursor(t); }} />

      {/* Rubrikrad */}
      <div className={`grid ${showWeekNumbers ? "grid-cols-[auto_repeat(7,minmax(0,1fr))]" : "grid-cols-7"} text-center text-xs font-medium uppercase`}>
        {showWeekNumbers && <div className="py-2 subtle">V</div>}
        {["Mån","Tis","Ons","Tors","Fre","Lör","Sön"].map((d) => <div key={d} className="py-2 subtle">{d}</div>)}
      </div>

      {/* Veckorader */}
      <div className="divide-y border-t border-gray-200 dark:border-zinc-800 text-sm">
        {weeks.map((week, wi) => {
          const weekNumber = getISOWeek(week[0]);
          return (
            <div key={wi} className={`grid ${showWeekNumbers ? "grid-cols-[auto_repeat(7,minmax(0,1fr))]" : "grid-cols-7"}`}>
              {showWeekNumbers && (
                <div className="flex items-center justify-center border-r border-gray-200 bg-gray-50 text-xs text-gray-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-gray-400">
                  {weekNumber}
                </div>
              )}

              {week.map((day, i) => {
                const inMonth = isSameMonth(day, monthStart);
                const isToday = isSameDay(day, new Date());

                const dayEvents = events.filter((e) => (!filterLabelId ? true : e.labelId === filterLabelId) && overlapsDay(e, day));
                const labelSet = new Map();
                dayEvents.forEach((e) => {
                  const lab = e.labelId ? mapById.get(e.labelId) : null;
                  const color = lab?.color ?? e.color ?? "#6366f1";
                  const name = lab?.name ?? e.label ?? "Övrigt";
                  labelSet.set(name, color);
                });
                const labels = Array.from(labelSet.entries());

                return (
                  <div key={i}
                    className={`relative h-24 border-r border-gray-200 p-1 dark:border-zinc-800 ${
                      inMonth ? "bg-white dark:bg-zinc-950" : "bg-gray-50 text-gray-400 dark:bg-zinc-900 dark:text-gray-600"
                    }`}
                    onClick={() => setSelectedDate(day)}
                  >
                    <div className="mb-1 text-right text-xs">
                      <span className={`inline-block rounded px-1 ${isToday ? "bg-red-500 text-white" : isSameDay(day, selectedDate) ? "bg-brand-600 text-white" : ""}`}>
                        {format(day, "d", { locale: sv })}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {labels.slice(0, 4).map(([name, color]) => (
                        <span key={name} className="h-2 w-2 rounded-full" style={{ background: color }} title={name} />
                      ))}
                      {labels.length > 4 && (
                        <span className="text-[10px] text-gray-500" title={labels.slice(4).map(([name]) => name).join(", ")}>
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
    </div>
  );
}