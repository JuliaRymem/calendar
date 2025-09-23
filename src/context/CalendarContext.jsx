/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from "react";

const CalendarContext = createContext(null);

export function CalendarProvider({ children }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewCursor, setViewCursor] = useState(new Date());
  const [showWeekNumbers, setShowWeekNumbers] = useState(true);
  const [theme, setTheme] = useState("system");

  // NYTT: filter (label) – "Alla" innebär inget filter
  const [filterLabel, setFilterLabel] = useState("Alla");

  const value = useMemo(
    () => ({
      selectedDate, setSelectedDate,
      viewCursor, setViewCursor,
      showWeekNumbers, setShowWeekNumbers,
      theme, setTheme,
      filterLabel, setFilterLabel,
    }),
    [selectedDate, viewCursor, showWeekNumbers, theme, filterLabel]
  );

  return <CalendarContext.Provider value={value}>{children}</CalendarContext.Provider>;
}

export function useCalendar() {
  const ctx = useContext(CalendarContext);
  if (!ctx) throw new Error("useCalendar must be used within CalendarProvider");
  return ctx;
}