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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
         role="dialog" aria-modal="true"
         onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <form onSubmit={handleSubmit} className="card w-full max-w-lg p-4 md:p-5 space-y-3">
        <div className="heading text-base">{editEvent ? "Redigera händelse" : "Ny händelse"}</div>

        <label className="block text-sm">
          Titel
          <input className="input mt-1" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        </label>

        <div className="grid grid-cols-2 gap-2">
          <label className="block text-sm">Datum
            <input type="date" className="input mt-1" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.allDay} onChange={(e) => setForm({ ...form, allDay: e.target.checked })} />
            Heldag
          </label>
        </div>

        {!form.allDay && (
          <div className="grid grid-cols-2 gap-2">
            <label className="block text-sm">Start
              <input type="time" className="input mt-1" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} required />
            </label>
            <label className="block text-sm">Slut
              <input type="time" className="input mt-1" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} required />
            </label>
          </div>
        )}

        {!creatingLabel ? (
          <div className="grid grid-cols-2 gap-2">
            <label className="block text-sm">Etikett
              <select className="select mt-1" value={form.labelId ?? ""} onChange={(e) => setForm({ ...form, labelId: e.target.value || null })}>
                {labels.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
            </label>
            <div className="flex items-end">
              <button type="button" className="btn w-full" onClick={() => setCreatingLabel(true)}>+ Ny etikett</button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <label className="block text-sm">Ny etikett
                <input className="input mt-1" value={newLabel.name} onChange={(e) => setNewLabel({ ...newLabel, name: e.target.value })} />
              </label>
              <label className="block text-sm">Färg
                <input type="color" className="input mt-1 h-10" value={newLabel.color} onChange={(e) => setNewLabel({ ...newLabel, color: e.target.value })} />
              </label>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" className="btn" onClick={() => setCreatingLabel(false)}>Avbryt</button>
              <button type="button" className="btn btn-primary" onClick={createInlineLabel}>Spara etikett</button>
            </div>
          </div>
        )}

        <label className="block text-sm">Anteckningar
          <textarea className="textarea mt-1" rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        </label>

        <div className="flex items-center justify-between pt-1">
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
    </div>
  );
}