import { useState } from "react";
import CalendarHeader from "./CalendarHeader";
import MonthView from "./MonthView";
import WeekView from "./WeekView";
import Agenda from "./Agenda";

export default function CalendarShell() {
  const [view, setView] = useState("month"); // "month" | "week"

  return (
    <div className="mx-auto max-w-6xl p-4">
      <CalendarHeader />
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
      </div>
      {view === "month" ? <MonthView /> : <WeekView />}
      <Agenda />
    </div>
  );
}