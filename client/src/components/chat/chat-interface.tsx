import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MessageList } from "./message-list"
import { speak } from "@/lib/tts"
import { Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Message {
  role: "user" | "assistant"
  content: string
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const { toast } = useToast()

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      })
      if (!response.ok) throw new Error("Failed to send message")
      return response.json()
    },
    onSuccess: async (data) => {
      const newMessage: Message = { role: "assistant", content: data.response }
      setMessages(prev => [...prev, newMessage])
      try {
        await speak(data.response)
      } catch (error: any) {
        console.error("Voice generation error:", error)
        toast({
          title: "Voice Generation Failed",
          description: error.message || "Failed to generate Trump's voice. Using fallback voice instead.",
          variant: "destructive",
          duration: 3000
        })
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      })
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = { role: "user", content: input }
    setMessages(prev => [...prev, userMessage])
    chatMutation.mutate(input)
    setInput("")
  }

  return (
    <div className="flex flex-col h-[300px]">
      <div className="flex-1 overflow-y-auto p-4">
        <MessageList messages={messages} />
      </div>

      <Card className="mt-auto border-t">
        <form onSubmit={handleSubmit} className="flex gap-2 p-4">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={chatMutation.isPending}
          />
          <Button 
            type="submit" 
            disabled={chatMutation.isPending}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </Card>
    </div>
  )
}