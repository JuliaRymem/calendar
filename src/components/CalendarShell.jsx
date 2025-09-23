import CalendarHeader from "./CalendarHeader";
import MonthView from "./MonthView";
import Agenda from "./Agenda";

export default function CalendarShell() {
  return (
    <div className="mx-auto max-w-4xl p-4">
      <CalendarHeader />
      <MonthView />
      <Agenda />
    </div>
  );
}