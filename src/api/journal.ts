import { BACKEND_URL } from "../config";

export interface JournalEntry {
  entry: string;
  date: string;
}

// Save to backend + localStorage (guaranteed persistence)
export async function saveJournal(entry: string): Promise<void> {
  try {
    // Save to backend
    const res = await fetch(`${BACKEND_URL}/api/journal`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entry })
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
  } catch (e) {
    console.warn("Backend save failed, using localStorage only:", e);
  }

  // ALWAYS save locally (guaranteed persistence)
  const history = JSON.parse(localStorage.getItem("journal") || "[]") as JournalEntry[];
  history.push({ entry, date: new Date().toISOString() });
  localStorage.setItem("journal", JSON.stringify(history));
}

// Load from backend or localStorage
export async function getJournalHistory(): Promise<JournalEntry[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/journal/history`);
    if (res.ok) {
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    }
  } catch (e) {
    console.warn("Backend fetch failed, using localStorage:", e);
  }

  // Fallback to localStorage
  return JSON.parse(localStorage.getItem("journal") || "[]") as JournalEntry[];
}
