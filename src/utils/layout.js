export const HOUR_PX = 64;           // px per timme
export const SNAP_MIN = 30;          // 30 min-raster

export function minutesSinceMidnight(date) {
  return date.getHours() * 60 + date.getMinutes();
}

export function timeToTopPx(date) {
  return (minutesSinceMidnight(date) / 60) * HOUR_PX;
}

export function durationToHeightPx(start, end) {
  const ms = Math.max(0, end - start);
  const mins = ms / 60000;
  return (mins / 60) * HOUR_PX;
}

export function snapMinutes(mins, snap = SNAP_MIN) {
  return Math.round(mins / snap) * snap;
}

export function yToDate(baseDate, yPx) {
  // yPx relativt kolumnens topp (0–24*HOUR_PX)
  const mins = (yPx / HOUR_PX) * 60;
  const snapped = snapMinutes(mins);
  const d = new Date(baseDate);
  d.setHours(0, 0, 0, 0);
  d.setMinutes(snapped);
  return d;
}