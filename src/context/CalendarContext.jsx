/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from "react";

const CalendarContext = createContext(null);

export function CalendarProvider({ children }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewCursor, setViewCursor] = useState(new Date());

  // UI-inställningar
  const [showWeekNumbers, setShowWeekNumbers] = useState(true);
  const [theme, setTheme] = useState("system"); // "light" | "dark" | "system"

  const value = useMemo(
    () => ({
      selectedDate, setSelectedDate,
      viewCursor, setViewCursor,
      showWeekNumbers, setShowWeekNumbers,
      theme, setTheme,
    }),
    [selectedDate, viewCursor, showWeekNumbers, theme]
  );

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendar() {
  const ctx = useContext(CalendarContext);
  if (!ctx) throw new Error("useCalendar must be used within CalendarProvider");
  return ctx;
}