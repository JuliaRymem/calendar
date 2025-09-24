import CalendarHeader from "./CalendarHeader";
import MonthView from "./MonthView";
import WeekView from "./WeekView";
import DayView from "./DayView";
import Agenda from "./Agenda";
import { useState } from "react";

export default function CalendarShell() {
  const [tab, setTab] = useState("month");

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-3 py-4 sm:space-y-8 sm:px-4 sm:py-6">
      <section className="glass-card p-4 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h1 className="heading-hero">Kalender</h1>
          <div className="toolbar">
            <button className={`btn btn-ghost ${tab === "month" ? "ring-2 ring-brand-500/30" : ""}`} onClick={() => setTab("month")}>Månad</button>
            <button className={`btn btn-ghost ${tab === "week" ? "ring-2 ring-brand-500/30" : ""}`} onClick={() => setTab("week")}>Vecka</button>
            <button className={`btn btn-ghost ${tab === "day" ? "ring-2 ring-brand-500/30" : ""}`} onClick={() => setTab("day")}>Dag</button>
          </div>
        </div>
        <CalendarHeader />
      </section>

      <section className="grid gap-6 sm:grid-cols-3">
        <div className="glass-card p-2 sm:col-span-2 sm:p-3">
          {tab === "month" && <MonthView />}
          {tab === "week" && <WeekView />}
          {tab === "day" && <DayView />}
        </div>

        <aside className="glass-card p-4">
          <div className="subtle mb-2">Översikt</div>
          <Agenda />
        </aside>
      </section>
    </div>
  );
}