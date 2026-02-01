import { BACKEND_URL } from "../config";
import { ChatRequest, ChatResponse } from "../types/chat";

export async function sendChatMessage(message: string): Promise<string> {
  try {
    const payload: ChatRequest = { prompt: message };

    const res = await fetch(`${BACKEND_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data: ChatResponse = await res.json();
    
    if (!data.reply) {
      throw new Error("No reply in response");
    }

    return data.reply;
  } catch (e) {
    console.error("Chat API error:", e);
    throw new Error(`Chat request failed: ${e instanceof Error ? e.message : "Unknown error"}`);
  }
}
