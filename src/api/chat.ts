const BACKEND_URL = "https://anahva-backend-vh3h.vercel.app";

export async function sendChatMessage(message: string): Promise<string> {
  const res = await fetch(`${BACKEND_URL}/api/chat/message`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: message,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Chat request failed: ${res.status} ${errorText}`);
  }

  const data = await res.json();
  console.log("CHAT RESPONSE:", data);

  // Backend sends `response`, not `reply`
  return data.response;
}
