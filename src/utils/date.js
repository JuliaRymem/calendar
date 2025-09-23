import { format, isSameDay, isSameMonth, isToday, getISOWeek } from "date-fns";
import { sv } from "date-fns/locale";

export const fmtDayNum = (d) => format(d, "d", { locale: sv });
export const fmtMonthTitle = (d) => format(d, "LLLL yyyy", { locale: sv });
export const isOutsideMonth = (d, cursor) => !isSameMonth(d, cursor);
export const isTodayFn = (d) => isToday(d);
export const isSelected = (d, selected) => isSameDay(d, selected);
export const isoWeek = (d) => getISOWeek(d);

export const WEEKDAY_LABELS = ["må", "ti", "on", "to", "fr", "lö", "sö"];