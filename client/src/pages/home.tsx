import { Card } from "@/components/ui/card"
import { TrumpModel } from "@/components/3d/trump-model"
import { ChatInterface } from "@/components/chat/chat-interface"
import { MLGBackground } from "@/components/background/mlg-background"

export default function Home() {
  return (
    <div className="relative min-h-screen bg-transparent overflow-hidden">
      <MLGBackground />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 3D Model Section */}
          <Card className="p-4 h-[600px] relative bg-black/40 backdrop-blur-sm border-green-500/30">
            <TrumpModel />
          </Card>

          {/* Chat Section */}
          <Card className="p-4 bg-black/40 backdrop-blur-sm border-green-500/30">
            <ChatInterface />
          </Card>
        </div>
      </div>
    </div>
  )
}