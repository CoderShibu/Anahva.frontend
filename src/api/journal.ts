import { BACKEND_URL } from "../config";
import { JournalEntry } from "../types/journal";

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
  const newEntry: JournalEntry = {
    text: entry,
    createdAt: new Date().toISOString()
  };
  history.push(newEntry);
  localStorage.setItem("journal", JSON.stringify(history));
}

// Load from backend or localStorage
export async function getJournalHistory(): Promise<JournalEntry[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/journal/history`);
    if (res.ok) {
      const data: JournalEntry[] = await res.json();
      if (Array.isArray(data)) {
        // Ensure all entries have correct shape
        return data.map(j => ({
          text: j.text || "",
          createdAt: j.createdAt || new Date().toISOString()
        }));
      }
    }
  } catch (e) {
    console.warn("Backend fetch failed, using localStorage:", e);
  }

  // Fallback to localStorage
  const stored = JSON.parse(localStorage.getItem("journal") || "[]") as JournalEntry[];
  return stored.map(j => ({
    text: j.text || "",
    createdAt: j.createdAt || new Date().toISOString()
  }));
}
