import { Card } from "@/components/ui/card"
import { TrumpModel } from "@/components/3d/trump-model"
import { ChatInterface } from "@/components/chat/chat-interface"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 3D Model Section */}
          <Card className="p-4 h-[600px] relative">
            <TrumpModel />
          </Card>

          {/* Chat Section */}
          <Card className="p-4">
            <ChatInterface />
          </Card>
        </div>
      </div>
    </div>
  )
}