/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const LabelsContext = createContext(null);
const STORAGE_KEY = "calendar_labels_v1";

function uuid() {
  return globalThis.crypto?.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);
}

const DEFAULT_LABELS = [
  { id: uuid(), name: "Jobb",        color: "#2563eb" }, // blue-600
  { id: uuid(), name: "Träning",     color: "#16a34a" }, // green-600
  { id: uuid(), name: "Skola/Plugg", color: "#9333ea" }, // purple-600
  { id: uuid(), name: "Familj",      color: "#ea580c" }, // orange-600
  { id: uuid(), name: "Hälsa",       color: "#dc2626" }, // red-600
];

export function LabelsProvider({ children }) {
  const [labels, setLabels] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const arr = JSON.parse(raw);
        // Om tomt → seed med defaults
        return Array.isArray(arr) && arr.length ? arr : DEFAULT_LABELS;
      }
    } catch {}
    return DEFAULT_LABELS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(labels));
  }, [labels]);

  const addLabel = (name, color) => {
    const l = { id: uuid(), name: name.trim(), color };
    setLabels((prev) => [...prev, l]);
    return l;
  };
  const updateLabel = (id, patch) => {
    setLabels((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  };
  const deleteLabel = (id) => {
    setLabels((prev) => prev.filter((l) => l.id !== id));
  };

  const mapById = useMemo(() => {
    const m = new Map();
    labels.forEach((l) => m.set(l.id, l));
    return m;
  }, [labels]);

  const value = useMemo(
    () => ({ labels, mapById, addLabel, updateLabel, deleteLabel }),
    [labels, mapById]
  );

  return <LabelsContext.Provider value={value}>{children}</LabelsContext.Provider>;
}

export function useLabels() {
  const ctx = useContext(LabelsContext);
  if (!ctx) throw new Error("useLabels must be used within LabelsProvider");
  return ctx;
}