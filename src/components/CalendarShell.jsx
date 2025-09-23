import { useState } from "react";
import CalendarHeader from "./CalendarHeader";
import MonthView from "./MonthView";
import WeekView from "./WeekView";
import DayView from "./DayView";
import Agenda from "./Agenda";

export default function CalendarShell() {
  const [view, setView] = useState("month"); // "month" | "week" | "day"

  return (
    <div className="mx-auto max-w-6xl p-4">
      <CalendarHeader />

      {/* Välj vy */}
      <div className="mb-4 flex gap-2">
        <button
          className={`rounded-md border px-3 py-1 text-sm ${view === "month" ? "bg-indigo-500 text-white" : ""}`}
          onClick={() => setView("month")}
        >
          Månad
        </button>
        <button
          className={`rounded-md border px-3 py-1 text-sm ${view === "week" ? "bg-indigo-500 text-white" : ""}`}
          onClick={() => setView("week")}
        >
          Vecka
        </button>
        <button
          className={`rounded-md border px-3 py-1 text-sm ${view === "day" ? "bg-indigo-500 text-white" : ""}`}
          onClick={() => setView("day")}
        >
          Dag
        </button>
      </div>

      {/* Rendera vald vy */}
      {view === "month" && <MonthView />}
      {view === "week" && <WeekView />}
      {view === "day" && <DayView />}

      <Agenda />
    </div>
  );
}