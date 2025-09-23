import { useState } from "react";
import { useLabels } from "../context/LabelsContext";

export default function LabelManager({ open, onClose }) {
  const { labels, addLabel, updateLabel, deleteLabel } = useLabels();
  const [draft, setDraft] = useState({ name: "", color: "#6366f1" });

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-lg rounded-xl border bg-white p-4 dark:bg-zinc-900">
        <div className="mb-3 text-lg font-semibold">Etiketter</div>

        <div className="mb-4 space-y-2">
          {labels.map((l) => (
            <div key={l.id} className="flex items-center gap-2">
              <input
                className="w-44 rounded-md border px-2 py-1"
                value={l.name}
                onChange={(e) => updateLabel(l.id, { name: e.target.value })}
              />
              <input
                type="color"
                className="h-9 w-16 rounded-md border"
                value={l.color}
                onChange={(e) => updateLabel(l.id, { color: e.target.value })}
              />
              <button
                className="ml-auto rounded-md border px-2 py-1 text-sm"
                onClick={() => deleteLabel(l.id)}
              >
                Ta bort
              </button>
            </div>
          ))}
        </div>

        <div className="mb-3 flex items-center gap-2">
          <input
            className="w-44 rounded-md border px-2 py-1"
            placeholder="Ny etikett"
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
          />
          <input
            type="color"
            className="h-9 w-16 rounded-md border"
            value={draft.color}
            onChange={(e) => setDraft({ ...draft, color: e.target.value })}
          />
          <button
            className="rounded-md border bg-indigo-500 px-3 py-1 text-sm text-white"
            onClick={() => {
              if (!draft.name.trim()) return;
              addLabel(draft.name, draft.color);
              setDraft({ name: "", color: "#6366f1" });
            }}
          >
            Lägg till
          </button>
        </div>

        <div className="text-right">
          <button className="rounded-md border px-3 py-1 text-sm" onClick={onClose}>
            Stäng
          </button>
        </div>
      </div>
    </div>
  );
}