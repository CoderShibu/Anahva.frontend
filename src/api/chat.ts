import { BACKEND_URL } from "../config";

export async function sendChatMessage(message: string): Promise<string> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: message })
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();
    return data.reply || "Sorry, I didn't get a response.";
  } catch (e) {
    console.error("Chat API error:", e);
    throw new Error("Chat request failed");
  }
}
