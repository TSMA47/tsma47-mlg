export interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

export async function sendMessage(message: string): Promise<string> {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  })

  if (!response.ok) {
    throw new Error("Failed to send message")
  }

  const data = await response.json()
  return data.response
}
