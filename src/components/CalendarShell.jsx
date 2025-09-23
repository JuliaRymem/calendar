import CalendarHeader from "./CalendarHeader";
import MonthView from "./MonthView";
import WeekView from "./WeekView";
import DayView from "./DayView";
import Agenda from "./Agenda";
import { useState } from "react";

export default function CalendarShell() {
  const [tab, setTab] = useState("month"); // month | week | day

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-6">
      {/* Hero / toppkort */}
      <section className="glass-card p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <h1 className="heading-hero">Kalender</h1>
          <div className="toolbar">
            <button className={`btn btn-ghost ${tab === "month" ? "ring-2 ring-brand-500/30" : ""}`} onClick={() => setTab("month")}>Månad</button>
            <button className={`btn btn-ghost ${tab === "week" ? "ring-2 ring-brand-500/30" : ""}`} onClick={() => setTab("week")}>Vecka</button>
            <button className={`btn btn-ghost ${tab === "day" ? "ring-2 ring-brand-500/30" : ""}`} onClick={() => setTab("day")}>Dag</button>
          </div>
        </div>
        <CalendarHeader />
      </section>

      {/* Content-grid */}
      <section className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 glass-card p-3">
          {tab === "month" && <MonthView />}
          {tab === "week" && <WeekView />}
          {tab === "day" && <DayView />}
        </div>

        <aside className="glass-card p-5">
          <div className="subtle mb-3">Översikt</div>
          <Agenda />
        </aside>
      </section>
    </div>
  );
}