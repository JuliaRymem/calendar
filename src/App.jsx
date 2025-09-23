import { useEffect } from "react";
import { CalendarProvider, useCalendar } from "./context/CalendarContext";
import CalendarShell from "./components/CalendarShell";

function ThemeRoot({ children }) {
  const { theme } = useCalendar();
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else if (theme === "light") root.classList.remove("dark");
    else {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const apply = () => root.classList.toggle("dark", mq.matches);
      apply();
      mq.addEventListener("change", apply);
      return () => mq.removeEventListener("change", apply);
    }
  }, [theme]);
  return children;
}

export default function App() {
  return (
    <div className="min-h-dvh bg-gray-100 p-4 dark:bg-black">
      <CalendarProvider>
        <ThemeRoot>
          <CalendarShell />
        </ThemeRoot>
      </CalendarProvider>
    </div>
  );
}