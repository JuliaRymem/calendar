import { parseISO, format } from "date-fns";
import { timeToTopPx, durationToHeightPx } from "../utils/layout";
import { useState } from "react";

export default function EventBlock({
  event, lane = 0, lanes = 1,
  onEdit, onDragStart, onResizeStart,
}) {
  const start = parseISO(event.start);
  const end = parseISO(event.end);
  const top = timeToTopPx(start);
  const height = Math.max(30, durationToHeightPx(start, end));
  const widthPercent = 100 / lanes;
  const leftPercent = lane * widthPercent;

  const [hover, setHover] = useState(false);
  const tint = event.color || "#7f90f5";

  return (
    <div
      className="event-pill hoverable absolute transition-shadow"
      style={{
        top,
        height,
        left: `${leftPercent}%`,
        width: `calc(${widthPercent}% - 8px)`,
        pointerEvents: "auto",
        borderImageSlice: 1,
        borderWidth: "1px",
        borderStyle: "solid",
        borderImageSource: `linear-gradient(145deg, ${tint}55, #e6c35a55)`,
        background: `linear-gradient(180deg, ${tint}15, rgba(255,255,255,.88))`,
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onEdit?.(event); }}
        className="w-full px-3 py-1.5 text-left focus:outline-none"
      >
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: tint }} />
          <div className="text-xs font-medium leading-tight line-clamp-1">{event.title}</div>
        </div>
        {!event.allDay && (
          <div className="text-[10px] text-gray-600">
            {format(start, "HH:mm")}–{format(end, "HH:mm")}
          </div>
        )}
        {event.notes && <div className="mt-1 text-[10px] text-gray-600 line-clamp-2">{event.notes}</div>}
      </button>

      {/* dra hela blocket */}
      {hover && (
        <div
          className="absolute inset-0 cursor-move rounded-2xl"
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