import { Button } from "@/components/ui/button"
import { 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Maximize2 
} from "lucide-react"

interface SceneControlsProps {
  className?: string
}

export function SceneControls({ className }: SceneControlsProps) {
  return (
    <div className={className}>
      <div className="flex gap-2">
        <Button variant="secondary" size="icon">
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button variant="secondary" size="icon">
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="secondary" size="icon">
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="secondary" size="icon">
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
