import { BACKEND_URL } from "../config";
import { JournalEntry } from "../types/journal";

// Save to backend + localStorage (guaranteed persistence)
export async function saveJournal(entry: string): Promise<void> {
  // Don't save empty entries
  if (!entry || !entry.trim()) {
    console.log("[Journal API] Skipping empty entry");
    return;
  }

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
    console.log("[Journal API] Saved to backend successfully");
  } catch (e) {
    console.warn("[Journal API] Backend save failed, using localStorage only:", e);
  }

  // ALWAYS save locally (guaranteed persistence)
  const history = JSON.parse(localStorage.getItem("journal") || "[]") as JournalEntry[];
  const newEntry: JournalEntry = {
    text: entry,
    createdAt: new Date().toISOString()
  };
  history.push(newEntry);
  localStorage.setItem("journal", JSON.stringify(history));
  console.log("[Journal API] Saved to localStorage");
}

// Load from backend or localStorage
export async function getJournalHistory(): Promise<JournalEntry[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/journal/history`);
    if (res.ok) {
      const data = await res.json();
      console.log("[Journal API] Backend response:", data);
      if (Array.isArray(data)) {
        // Backend uses 'entry' field, frontend uses 'text' field
        // Map backend response to frontend format
        return data.map((j: any) => ({
          text: j.text || j.entry || "",  // Handle both field names
          createdAt: j.createdAt || j.date || new Date().toISOString()
        }));
      }
    }
  } catch (e) {
    console.warn("[Journal API] Backend fetch failed, using localStorage:", e);
  }

  // Fallback to localStorage
  const stored = JSON.parse(localStorage.getItem("journal") || "[]") as JournalEntry[];
  console.log("[Journal API] Using localStorage:", stored);
  return stored.map(j => ({
    text: j.text || "",
    createdAt: j.createdAt || new Date().toISOString()
  }));
}
