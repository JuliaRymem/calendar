import {
    addDays,
    endOfMonth,
    endOfWeek,
    startOfMonth,
    startOfWeek,
  } from "date-fns";
  import { sv } from "date-fns/locale";
  
  export function useMonthGrid(date) {
    const monthStart = startOfMonth(date);
    const gridStart = startOfWeek(monthStart, { weekStartsOn: 1, locale: sv }); // måndag
    const gridEnd = endOfWeek(endOfMonth(date), { weekStartsOn: 1, locale: sv });
  
    const days = [];
    let d = gridStart;
    while (d <= gridEnd) {
      days.push(d);
      d = addDays(d, 1);
    }
    return days; // 42–35 dagar beroende på månad
  }