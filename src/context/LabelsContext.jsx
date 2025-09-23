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
  { id: uuid(), name: "Jobb",        color: "#2563eb" },
  { id: uuid(), name: "Träning",     color: "#16a34a" },
  { id: uuid(), name: "Skola/Plugg", color: "#9333ea" },
  { id: uuid(), name: "Familj",      color: "#ea580c" },
  { id: uuid(), name: "Hälsa",       color: "#dc2626" },
];

export function LabelsProvider({ children }) {
  const [labels, setLabels] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const arr = JSON.parse(raw);
        return Array.isArray(arr) && arr.length ? arr : DEFAULT_LABELS;
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn("Couldn't load labels from localStorage:", err);
    }
    return DEFAULT_LABELS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(labels));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn("Couldn't save labels to localStorage:", err);
    }
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