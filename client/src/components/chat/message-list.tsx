import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface MessageListProps {
  messages: Message[]
}

export function MessageList({ messages }: MessageListProps) {
  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {messages.map((message, i) => (
          <div
            key={i}
            className={cn(
              "flex items-start gap-4",
              message.role === "assistant" ? "flex-row" : "flex-row-reverse"
            )}
          >
            <Avatar className="h-8 w-8">
              <img
                src={message.role === "assistant" 
                  ? "https://api.dicebear.com/7.x/personas/svg?seed=trump" 
                  : "https://api.dicebear.com/7.x/personas/svg?seed=user"}
                alt={message.role}
              />
            </Avatar>
            <div
              className={cn(
                "rounded-lg p-4 max-w-[80%]",
                message.role === "assistant" 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted"
              )}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
