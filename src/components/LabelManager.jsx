import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useLabels } from "../context/LabelsContext";

export default function LabelManager({ open, onClose }) {
  const { labels, addLabel, updateLabel, deleteLabel } = useLabels();
  const [drafts, setDrafts] = useState(labels);
  const [newLabel, setNewLabel] = useState({ name: "", color: "#7f90f5" });

  useEffect(() => { if (open) setDrafts(labels); }, [open, labels]);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prevOverflow; };
  }, [open]);

  if (!open) return null;

  function saveAll() {
    drafts.forEach((d) => updateLabel(d.id, { name: d.name.trim(), color: d.color }));
    if (newLabel.name.trim()) addLabel(newLabel.name.trim(), newLabel.color);
    setNewLabel({ name: "", color: "#7f90f5" });
    onClose();
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="labels-modal-title"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        background:
          "radial-gradient(800px 400px at 10% 0%, rgba(191,234,215,.25), transparent), " +
          "radial-gradient(800px 400px at 90% 10%, rgba(207,225,255,.25), transparent), " +
          "rgba(17,24,39,.35)",
        backdropFilter: "blur(2px)",
      }}
    >
      <div className="glass-card w-full max-w-lg p-5 max-h-[85vh] overflow-auto">
        <div className="mb-3 flex items-center justify-between">
          <h2 id="labels-modal-title" className="text-lg font-semibold tracking-tight">Hantera etiketter</h2>
          <button className="btn btn-ghost" onClick={onClose} aria-label="Stäng">✕</button>
        </div>

        <div className="space-y-2">
          {drafts.map((l, idx) => (
            <div key={l.id} className="glass-plain p-3">
              <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
                <span className="inline-block h-4 w-4 rounded-full" style={{ background: l.color }} />
                <input
                  className="input"
                  value={l.name}
                  onChange={(e) => setDrafts((arr) => arr.map((it, i) => (i === idx ? { ...it, name: e.target.value } : it)))}
                />
                <input
                  type="color"
                  className="input h-10 w-16"
                  value={l.color}
                  onChange={(e) => setDrafts((arr) => arr.map((it, i) => (i === idx ? { ...it, color: e.target.value } : it)))}
                />
              </div>
              <div className="mt-2 flex justify-end">
                <button className="btn btn-danger" onClick={() => deleteLabel(l.id)}>Ta bort</button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 glass-plain p-3">
          <div className="mb-2 text-sm font-medium">Ny etikett</div>
          <div className="grid grid-cols-[1fr_auto] items-center gap-3">
            <input className="input" placeholder="t.ex. Projekt X" value={newLabel.name} onChange={(e) => setNewLabel({ ...newLabel, name: e.target.value })} />
            <input type="color" className="input h-10 w-16" value={newLabel.color} onChange={(e) => setNewLabel({ ...newLabel, color: e.target.value })} />
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button className="btn" onClick={onClose}>Avbryt</button>
          <button className="btn btn-primary" onClick={saveAll}>Spara</button>
        </div>
      </div>
    </div>,
    document.body
  );
}