export const HOUR_PX = 64; // 64px per timme = 24 * 64 = 1536px totalhöjd

export function minutesSinceMidnight(date) {
  return date.getHours() * 60 + date.getMinutes();
}

export function timeToTopPx(date) {
  return (minutesSinceMidnight(date) / (24 * 60)) * (24 * HOUR_PX);
}

export function durationToHeightPx(start, end) {
  const ms = Math.max(0, end - start);
  const mins = ms / 60000;
  return (mins / 60) * HOUR_PX;
}