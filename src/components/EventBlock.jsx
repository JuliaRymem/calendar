import { parseISO, format } from "date-fns";
import { timeToTopPx, durationToHeightPx } from "../utils/layout";
import { useState } from "react";

export default function EventBlock({ event, lane = 0, lanes = 1, onEdit, onDragStart, onResizeStart }) {
  const start = parseISO(event.start);
  const end = parseISO(event.end);
  const top = timeToTopPx(start);
  const height = Math.max(24, durationToHeightPx(start, end));
  const widthPercent = 100 / lanes;
  const leftPercent = lane * widthPercent;

  const [hover, setHover] = useState(false);

  return (
    <div
      className="absolute rounded-md border text-left shadow-sm"
      style={{
        top,
        height,
        left: `${leftPercent}%`,
        width: `calc(${widthPercent}% - 4px)`,
        background: `${event.color}1f`,      // ~12% alpha
        borderColor: `${event.color}59`,     // ~35% alpha
        pointerEvents: "auto",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* innehåll */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onEdit?.(event); }}
        className="w-full px-2 py-1 text-left focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <div className="text-xs font-medium line-clamp-1">{event.title}</div>
        {!event.allDay && (
          <div className="text-[10px] opacity-70">
            {format(start, "HH:mm")}–{format(end, "HH:mm")}
          </div>
        )}
        {event.notes && <div className="mt-1 text-[10px] opacity-70 line-clamp-2">{event.notes}</div>}
      </button>

      {/* drag-handle (hela blocket) */}
      {hover && (
        <div
          className="absolute inset-0 cursor-move"
          onMouseDown={(e) => { e.preventDefault(); onDragStart?.(event, e); }}
        />
      )}

      {/* resize-handles */}
      <div
        className="absolute -top-1 left-1/2 h-2 w-8 -translate-x-1/2 cursor-n-resize rounded bg-white/60"
        onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); onResizeStart?.(event, "start", e); }}
      />
      <div
        className="absolute -bottom-1 left-1/2 h-2 w-8 -translate-x-1/2 cursor-s-resize rounded bg-white/60"
        onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); onResizeStart?.(event, "end", e); }}
      />
    </div>
  );
}