import { useEffect, useMemo, useState } from "react";
import { useCalendar } from "../context/CalendarContext";
import { useEvents } from "../context/EventsContext";
import { format, set } from "date-fns";
import { sv } from "date-fns/locale";

export default function EventModal({ open, onClose, editEvent = null }) {
  const { selectedDate } = useCalendar();
  const { addEvent, updateEvent, deleteEvent } = useEvents();

  // Förifyll värden
  const defaults = useMemo(() => {
    const base = selectedDate || new Date();
    const start = set(base, { hours: 9, minutes: 0, seconds: 0, milliseconds: 0 });
    const end = set(base, { hours: 10, minutes: 0, seconds: 0, milliseconds: 0 });
    return {
      title: "",
      allDay: false,
      date: format(base, "yyyy-MM-dd"),
      startTime: "09:00",
      endTime: "10:00",
      notes: "",
    };
  }, [selectedDate]);

  const [form, setForm] = useState(defaults);

  useEffect(() => {
    if (editEvent) {
      const s = new Date(editEvent.start);
      const e = new Date(editEvent.end);
      setForm({
        title: editEvent.title || "",
        allDay: !!editEvent.allDay,
        date: format(s, "yyyy-MM-dd"),
        startTime: format(s, "HH:mm"),
        endTime: format(e, "HH:mm"),
        notes: editEvent.notes || "",
      });
    } else {
      setForm(defaults);
    }
  }, [editEvent, defaults]);

  if (!open) return null;

  function toISO(dateStr, timeStr) {
    const [y, m, d] = dateStr.split("-").map(Number);
    const [hh, mm] = timeStr.split(":").map(Number);
    const dt = new Date(y, m - 1, d, hh || 0, mm || 0, 0, 0);
    return dt.toISOString();
  }

  function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      title: form.title.trim(),
      allDay: form.allDay,
      start: form.allDay
        ? toISO(form.date, "00:00")
        : toISO(form.date, form.startTime || "09:00"),
      end: form.allDay
        ? toISO(form.date, "23:59")
        : toISO(form.date, form.endTime || "10:00"),
      notes: form.notes.trim(),
    };
    if (!payload.title) return;

    if (editEvent?.id) {
      updateEvent(editEvent.id, payload);
    } else {
      addEvent(payload);
    }
    onClose();
  }

  function handleDelete() {
    if (editEvent?.id) {
      deleteEvent(editEvent.id);
      onClose();
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog" aria-modal="true"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl border bg-white p-4 shadow-lg dark:bg-zinc-900"
      >
        <div className="mb-3 text-lg font-semibold">
          {editEvent ? "Redigera händelse" : "Ny händelse"}
        </div>

        <label className="mb-2 block text-sm">
          Titel
          <input
            className="mt-1 w-full rounded-md border px-3 py-2"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Vad händer?"
            required
          />
        </label>

        <div className="mb-2 grid grid-cols-2 gap-2">
          <label className="block text-sm">
            Datum
            <input
              type="date"
              className="mt-1 w-full rounded-md border px-3 py-2"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
            />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.allDay}
              onChange={(e) => setForm({ ...form, allDay: e.target.checked })}
            />
            Heldag
          </label>
        </div>

        {!form.allDay && (
          <div className="mb-2 grid grid-cols-2 gap-2">
            <label className="block text-sm">
              Start
              <input
                type="time"
                className="mt-1 w-full rounded-md border px-3 py-2"
                value={form.startTime}
                onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                required
              />
            </label>
            <label className="block text-sm">
              Slut
              <input
                type="time"
                className="mt-1 w-full rounded-md border px-3 py-2"
                value={form.endTime}
                onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                required
              />
            </label>
          </div>
        )}

        <label className="mb-3 block text-sm">
          Anteckningar
          <textarea
            className="mt-1 w-full rounded-md border px-3 py-2"
            rows={3}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="Valfritt"
          />
        </label>

        <div className="flex items-center justify-between">
          {editEvent ? (
            <button
              type="button"
              className="rounded-md border border-red-500 px-3 py-2 text-sm text-red-600"
              onClick={handleDelete}
            >
              Ta bort
            </button>
          ) : <span />}
          <div className="flex gap-2">
            <button
              type="button"
              className="rounded-md border px-3 py-2 text-sm"
              onClick={onClose}
            >
              Avbryt
            </button>
            <button
              type="submit"
              className="rounded-md border bg-indigo-500 px-3 py-2 text-sm text-white"
            >
              Spara
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}