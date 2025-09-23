// Varje timrad är 64px hög (se HOUR_PX), så totalhöjd = 24 * 64
import { useEffect, useState } from "react";

export default function TimeGrid() {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="col-span-1 flex flex-col text-xs text-gray-500 dark:text-gray-400">
      {hours.map((h) => (
        <div key={h} className="h-16 border-b border-gray-200 dark:border-zinc-800">
          <div className="relative -top-2">{String(h).padStart(2, "0")}:00</div>
        </div>
      ))}
    </div>
  );
}

export function NowLine() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const minutes = now.getHours() * 60 + now.getMinutes();
  const top = (minutes / (24 * 60)) * (24 * 64); // 64px per timme

  return (
    <div
      className="absolute left-0 right-0 z-10 flex items-center"
      style={{ top: `${top}px` }}
    >
      <div className="h-[1px] flex-1 bg-red-500" />
      <div className="ml-1 h-2 w-2 rounded-full bg-red-500" />
    </div>
  );
}