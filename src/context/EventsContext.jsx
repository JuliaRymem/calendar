/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { isBefore, parseISO } from "date-fns";

const EventsContext = createContext(null);
const STORAGE_KEY = "calendar_events_v1";

function safeUUID() {
  if (globalThis.crypto?.randomUUID) return crypto.randomUUID();
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function EventsProvider({ children }) {
  const [events, setEvents] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return parsed.sort((a, b) =>
        isBefore(parseISO(a.start), parseISO(b.start)) ? -1 : 1
      );
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  function addEvent(evt) {
    const withId = {
      color: evt.color || "#6366f1",
      label: evt.label || "Övrigt",
      labelId: evt.labelId ?? null,
      ...evt,
      id: evt.id || safeUUID(),
    };
    setEvents((prev) => [...prev, withId]);
    return withId.id;
  }

  function updateEvent(id, patch) {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }

  function deleteEvent(id) {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }

  const value = useMemo(
    () => ({ events, addEvent, updateEvent, deleteEvent }),
    [events]
  );

  return <EventsContext.Provider value={value}>{children}</EventsContext.Provider>;
}

export function useEvents() {
  const ctx = useContext(EventsContext);
  if (!ctx) throw new Error("useEvents must be used within EventsProvider");
  return ctx;
}