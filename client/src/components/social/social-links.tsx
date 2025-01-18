import { Button } from "@/components/ui/button"
import { SiGithub, SiTelegram, SiX } from "react-icons/si"
import { FileText } from "lucide-react"

export function SocialLinks() {
  return (
    <div className="flex gap-2 bg-gray-900/90 backdrop-blur-sm p-3 rounded-lg border border-gray-800">
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-2 text-white/80 hover:text-white hover:bg-white/10"
        onClick={() => window.open('#', '_blank')}
      >
        <FileText className="h-4 w-4" />
        <span>Whitepaper</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-2 text-white/80 hover:text-white hover:bg-white/10"
        onClick={() => window.open('https://github.com', '_blank')}
      >
        <SiGithub className="h-4 w-4" />
        <span>GitHub</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-2 text-white/80 hover:text-white hover:bg-white/10"
        onClick={() => window.open('https://t.me', '_blank')}
      >
        <SiTelegram className="h-4 w-4" />
        <span>Telegram</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-2 text-white/80 hover:text-white hover:bg-white/10"
        onClick={() => window.open('https://x.com', '_blank')}
      >
        <SiX className="h-4 w-4" />
        <span>X</span>
      </Button>
      <div className="text-xs text-gray-400 self-center ml-4">
        Contract: 0xXXXX...XXXX
      </div>
    </div>
  )
}