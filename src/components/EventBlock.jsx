import { parseISO, format } from "date-fns";
import { timeToTopPx, durationToHeightPx } from "../utils/layout";

export default function EventBlock({ event, lane = 0, lanes = 1, onClick }) {
  const start = parseISO(event.start);
  const end = parseISO(event.end);

  const top = timeToTopPx(start);
  const height = Math.max(24, durationToHeightPx(start, end)); // min-höjd

  // kolumnbredd vid överlappning
  const widthPercent = 100 / lanes;
  const leftPercent = lane * widthPercent;

  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute overflow-hidden rounded-md border text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      style={{
        top,
        height,
        left: `${leftPercent}%`,
        width: `calc(${widthPercent}% - 4px)`, // litet mellanrum
        background: "rgb(99 102 241 / 0.12)", // indigo-500 @ 12%
        borderColor: "rgb(99 102 241 / 0.35)",
      }}
      title={event.title}
    >
      <div className="px-2 py-1">
        <div className="text-xs font-medium line-clamp-1">{event.title}</div>
        {!event.allDay && (
          <div className="text-[10px] opacity-70">
            {format(start, "HH:mm")}–{format(end, "HH:mm")}
          </div>
        )}
        {event.notes && (
          <div className="mt-1 text-[10px] opacity-70 line-clamp-2">{event.notes}</div>
        )}
      </div>
    </button>
  );
}