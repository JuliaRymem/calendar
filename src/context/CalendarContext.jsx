import { createContext, useContext, useMemo, useState } from "react";

const CalendarContext = createContext(null);

export function CalendarProvider({ children }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewCursor, setViewCursor] = useState(new Date()); // månad vi tittar på

  const value = useMemo(
    () => ({ selectedDate, setSelectedDate, viewCursor, setViewCursor }),
    [selectedDate, viewCursor]
  );

  return (
    <CalendarContext.Provider value={value}>{children}</CalendarContext.Provider>
  );
}

export function useCalendar() {
  const ctx = useContext(CalendarContext);
  if (!ctx) throw new Error("useCalendar must be used within CalendarProvider");
  return ctx;
}