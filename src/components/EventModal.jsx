import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { format } from "date-fns";
import { useCalendar } from "../context/CalendarContext";
import { useEvents } from "../context/EventsContext";
import { useLabels } from "../context/LabelsContext";

export default function EventModal({ open, onClose, editEvent = null }) {
  const { selectedDate } = useCalendar();
  const { addEvent, updateEvent, deleteEvent } = useEvents();
  const { labels, addLabel, mapById } = useLabels();

  const defaults = useMemo(() => {
    const base = selectedDate || new Date();
    const first = labels[0];
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
  const [newLabel, setNewLabel] = useState({ name: "", color: "#7f90f5" });

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prevOverflow; };
  }, [open]);

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
    const [hh, mm] = (timeStr || "00:00").split(":").map(Number);
    return new Date(y, m - 1, d, hh || 0, mm || 0, 0, 0).toISOString();
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
      label: labelObj?.name ?? "Övrigt",
      color: labelObj?.color ?? "#7f90f5",
    };
    if (!payload.title) return;
    if (editEvent?.id) updateEvent(editEvent.id, payload);
    else addEvent(payload);
    onClose();
  }

  function createInlineLabel() {
    if (!newLabel.name.trim()) return;
    const l = addLabel(newLabel.name.trim(), newLabel.color);
    setForm((f) => ({ ...f, labelId: l.id }));
    setCreatingLabel(false);
    setNewLabel({ name: "", color: "#7f90f5" });
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="event-modal-title"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        background:
          "radial-gradient(800px 400px at 10% 0%, rgba(191,234,215,.25), transparent), " +
          "radial-gradient(800px 400px at 90% 10%, rgba(207,225,255,.25), transparent), " +
          "rgba(17,24,39,.35)",
        backdropFilter: "blur(2px)",
      }}
    >
      <form onSubmit={handleSubmit} className="modal-panel glass-card p-5 max-h-[85vh] overflow-auto">
        <div className="mb-3 flex items-center justify-between">
          <h2 id="event-modal-title" className="text-lg font-semibold tracking-tight">
            {editEvent ? "Redigera händelse" : "Ny händelse"}
          </h2>
          <button type="button" className="btn btn-ghost" onClick={onClose} aria-label="Stäng">✕</button>
        </div>

        <div className="grid gap-3">
          <label className="block text-sm">
            Titel
            <input className="input mt-1" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Vad händer?" required />
          </label>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="block text-sm">
              Datum
              <input type="date" className="input mt-1" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
            </label>
            <label className="flex items-end gap-2 text-sm">
              <input type="checkbox" checked={form.allDay} onChange={(e) => setForm({ ...form, allDay: e.target.checked })} />
              Heldag
            </label>
          </div>

          {!form.allDay && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="block text-sm">
                Start
                <input type="time" className="input mt-1" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} required />
              </label>
              <label className="block text-sm">
                Slut
                <input type="time" className="input mt-1" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} required />
              </label>
            </div>
          )}

          {!creatingLabel ? (
            <div className="grid grid-cols-[1fr_auto] items-end gap-3">
              <label className="block text-sm">
                Etikett
                <select className="select mt-1" value={form.labelId ?? ""} onChange={(e) => setForm({ ...form, labelId: e.target.value || null })}>
                  {labels.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
              </label>
              <button type="button" className="btn" onClick={() => setCreatingLabel(true)}>+ Ny etikett</button>
            </div>
          ) : (
            <div className="glass-plain rounded-2xl p-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
                <label className="block text-sm">
                  Ny etikett
                  <input className="input mt-1" value={newLabel.name} onChange={(e) => setNewLabel({ ...newLabel, name: e.target.value })} placeholder="t.ex. Projekt X" />
                </label>
                <label className="block text-sm">
                  Färg
                  <input type="color" className="input mt-1 h-10" value={newLabel.color} onChange={(e) => setNewLabel({ ...newLabel, color: e.target.value })} />
                </label>
              </div>
              <div className="mt-3 flex justify-end gap-2">
                <button type="button" className="btn" onClick={() => setCreatingLabel(false)}>Avbryt</button>
                <button type="button" className="btn btn-primary" onClick={createInlineLabel}>Spara etikett</button>
              </div>
            </div>
          )}

          <label className="block text-sm">
            Anteckningar
            <textarea className="textarea mt-1" rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Valfritt" />
          </label>
        </div>

        <div className="mt-4 flex items-center justify-between">
          {editEvent ? (
            <button type="button" className="btn btn-danger" onClick={() => { deleteEvent(editEvent.id); onClose(); }}>
              Ta bort
            </button>
          ) : <span />}

          <div className="flex gap-2">
            <button type="button" className="btn" onClick={onClose}>Avbryt</button>
            <button type="submit" className="btn btn-primary">Spara</button>
          </div>
        </div>
      </form>
    </div>,
    document.body
  );
}