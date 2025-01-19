import { Button } from "@/components/ui/button"
import { SiGithub, SiTelegram, SiX } from "react-icons/si"
import { FileText } from "lucide-react"

export function SocialLinks() {
  return (
    <div className="flex gap-1 bg-gray-900/70 backdrop-blur-sm p-1.5 rounded-lg border border-gray-800/50 pointer-events-auto">
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-white/80 hover:text-white hover:bg-white/10"
        onClick={() => window.open('#', '_blank')}
      >
        <FileText className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-white/80 hover:text-white hover:bg-white/10"
        onClick={() => window.open('https://github.com', '_blank')}
      >
        <SiGithub className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-white/80 hover:text-white hover:bg-white/10"
        onClick={() => window.open('https://t.me', '_blank')}
      >
        <SiTelegram className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-white/80 hover:text-white hover:bg-white/10"
        onClick={() => window.open('https://x.com', '_blank')}
      >
        <SiX className="h-4 w-4" />
      </Button>
      <span className="text-[10px] text-gray-400/80 self-center ml-2 mr-1">
        0xXXXX...XXXX
      </span>
    </div>
  )
}