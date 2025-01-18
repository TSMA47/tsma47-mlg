import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MessageList } from "./message-list"
import { speak } from "@/lib/tts"
import { Send, VolumeX, Volume2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Message {
  role: "user" | "assistant"
  content: string
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isMuted, setIsMuted] = useState(false)
  const { toast } = useToast()
  const hasVoice = Boolean(import.meta.env.VITE_ELEVEN_LABS_API_KEY)

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      })
      if (!response.ok) {
        const error = await response.text()
        throw new Error(error || "Failed to send message")
      }
      return response.json()
    },
    onSuccess: async (data) => {
      const newMessage: Message = { role: "assistant", content: data.response }
      setMessages(prev => [...prev, newMessage])

      // Only attempt voice generation if API key is present and not muted
      if (hasVoice && !isMuted) {
        try {
          await speak(data.response)
        } catch (error: any) {
          console.error("Voice generation error:", error)
          toast({
            title: "Voice Generation Failed",
            description: error.message || "Failed to generate voice response",
            variant: "destructive",
            duration: 3000
          })
        }
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive",
        duration: 3000
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

  const toggleMute = () => {
    setIsMuted(!isMuted)
    toast({
      title: !isMuted ? "Voice Muted" : "Voice Unmuted",
      description: !isMuted ? "Trump's voice responses are now muted" : "Trump's voice responses are now enabled",
      duration: 1500
    })
  }

  return (
    <div className="flex flex-col h-[600px] bg-gray-900/95 rounded-lg">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800">
        <span className="text-sm text-gray-400">Chat with Trump</span>
        {hasVoice ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            className="h-8 w-8 text-gray-400 hover:text-white"
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
        ) : (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <VolumeX className="w-3 h-3" />
            <span>Voice disabled</span>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        <MessageList messages={messages} />
      </div>

      <Card className="mt-auto border-t border-gray-800 bg-gray-900">
        <form onSubmit={handleSubmit} className="flex gap-2 p-4">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={chatMutation.isPending}
            className="bg-gray-800 border-gray-700 text-white"
          />
          <Button 
            type="submit" 
            disabled={chatMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </Card>
    </div>
  )
}