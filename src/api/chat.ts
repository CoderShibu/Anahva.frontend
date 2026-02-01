const BACKEND_URL = "https://anahva-backend-vh3h.vercel.app";

export async function sendChatMessage(message: string): Promise<string> {
  const res = await fetch(`${BACKEND_URL}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ prompt: message })
  });

  const data = await res.json();
  console.log("CHAT RESPONSE:", data);

  return data.reply;
}
