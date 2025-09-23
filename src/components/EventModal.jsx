import { useEffect, useMemo, useState } from "react";
import { useCalendar } from "../context/CalendarContext";
import { useEvents } from "../context/EventsContext";
import { useLabels } from "../context/LabelsContext";
import { format } from "date-fns";

export default function EventModal({ open, onClose, editEvent = null }) {
  const { selectedDate } = useCalendar();
  const { addEvent, updateEvent, deleteEvent } = useEvents();
  const { labels, addLabel, mapById } = useLabels();

  const defaults = useMemo(() => {
    const base = selectedDate || new Date();
    const first = labels[0]; // default label
    return {
      title: "",
      allDay: false,
      date: format(base, "yyyy-MM-dd"),
      startTime: "09:00",
      endTime: "10:00",
      notes: "",
      labelId: first?.id ?? null,
    };
  }, [selectedDate, labels]);

  const [form, setForm] = useState(defaults);
  const [creatingLabel, setCreatingLabel] = useState(false);
  const [newLabel, setNewLabel] = useState({ name: "", color: "#6366f1" });

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
        labelId: editEvent.labelId || null,
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
    const labelObj = form.labelId ? mapById.get(form.labelId) : null;
    const payload = {
      title: form.title.trim(),
      allDay: form.allDay,
      start: form.allDay ? toISO(form.date, "00:00") : toISO(form.date, form.startTime || "09:00"),
      end: form.allDay ? toISO(form.date, "23:59") : toISO(form.date, form.endTime || "10:00"),
      notes: form.notes.trim(),
      labelId: labelObj?.id ?? null,
      // fallback för äldre renderingar:
      label: labelObj?.name ?? "Övrigt",
      color: labelObj?.color ?? "#6366f1",
    };
    if (!payload.title) return;

    if (editEvent?.id) updateEvent(editEvent.id, payload);
    else addEvent(payload);

    onClose();
  }

  function createInlineLabel() {
    if (!newLabel.name.trim()) return;
    const l = addLabel(newLabel.name, newLabel.color);
    setForm((f) => ({ ...f, labelId: l.id }));
    setCreatingLabel(false);
    setNewLabel({ name: "", color: "#6366f1" });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog" aria-modal="true"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-xl border bg-white p-4 shadow-lg dark:bg-zinc-900">
        <div className="mb-3 text-lg font-semibold">
          {editEvent ? "Redigera händelse" : "Ny händelse"}
        </div>

        <label className="mb-2 block text-sm">
          Titel
          <input
            className="mt-1 w-full rounded-md border px-3 py-2"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
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

        {/* Etikett-väljare */}
        {!creatingLabel ? (
          <div className="mb-2 grid grid-cols-2 gap-2">
            <label className="block text-sm">
              Etikett
              <select
                className="mt-1 w-full rounded-md border px-3 py-2"
                value={form.labelId ?? ""}
                onChange={(e) => setForm({ ...form, labelId: e.target.value || null })}
              >
                {labels.map((l) => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
            </label>
            <div className="flex items-end">
              <button
                type="button"
                className="w-full rounded-md border px-3 py-2 text-sm"
                onClick={() => setCreatingLabel(true)}
              >
                + Ny etikett
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-2 grid grid-cols-2 gap-2">
            <label className="block text-sm">
              Ny etikett
              <input
                className="mt-1 w-full rounded-md border px-3 py-2"
                value={newLabel.name}
                onChange={(e) => setNewLabel({ ...newLabel, name: e.target.value })}
                placeholder="t.ex. Projekt X"
              />
            </label>
            <label className="block text-sm">
              Färg
              <input
                type="color"
                className="mt-1 h-10 w-full rounded-md border"
                value={newLabel.color}
                onChange={(e) => setNewLabel({ ...newLabel, color: e.target.value })}
              />
            </label>
            <div className="col-span-2 flex justify-end gap-2">
              <button type="button" className="rounded-md border px-3 py-2 text-sm" onClick={() => setCreatingLabel(false)}>
                Avbryt
              </button>
              <button type="button" className="rounded-md border bg-indigo-500 px-3 py-2 text-sm text-white" onClick={createInlineLabel}>
                Spara etikett
              </button>
            </div>
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
              onClick={() => { deleteEvent(editEvent.id); onClose(); }}
            >
              Ta bort
            </button>
          ) : <span />}

          <div className="flex gap-2">
            <button type="button" className="rounded-md border px-3 py-2 text-sm" onClick={onClose}>Avbryt</button>
            <button type="submit" className="rounded-md border bg-indigo-500 px-3 py-2 text-sm text-white">Spara</button>
          </div>
        </div>
      </form>
    </div>
  );
}