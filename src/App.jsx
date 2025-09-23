import { CalendarProvider } from "./context/CalendarContext";
import CalendarShell from "./components/CalendarShell";

export default function App() {
  return (
    <div className="min-h-dvh bg-gray-100 p-4 dark:bg-black">
      <CalendarProvider>
        <CalendarShell />
      </CalendarProvider>
    </div>
  );
}