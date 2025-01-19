import { useEffect, useRef } from 'react'
import { SiDogecoin } from "react-icons/si"
import { TrendingUp, Target, Cannabis } from 'lucide-react'

export function MLGBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Create meme elements
    const memes = [
      { emoji: '🎯', x: Math.random() * canvas.width, y: Math.random() * canvas.height, speed: 1 },
      { emoji: '🌿', x: Math.random() * canvas.width, y: Math.random() * canvas.height, speed: 0.8 },
      { emoji: '🚀', x: Math.random() * canvas.width, y: Math.random() * canvas.height, speed: 1.2 },
      { emoji: '💎', x: Math.random() * canvas.width, y: Math.random() * canvas.height, speed: 0.9 },
      { emoji: '🎮', x: Math.random() * canvas.width, y: Math.random() * canvas.height, speed: 1.1 },
    ]

    // Animation function
    let frame = 0
    const animate = () => {
      frame++
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw rainbow background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, `hsl(${frame % 360}, 100%, 50%)`)
      gradient.addColorStop(1, `hsl(${(frame + 180) % 360}, 100%, 50%)`)
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Animate memes
      memes.forEach((meme) => {
        meme.y = (meme.y + meme.speed) % canvas.height
        ctx.font = '24px Arial'
        ctx.fillText(meme.emoji, meme.x, meme.y)
      })

      requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <>
      <canvas 
        ref={canvasRef} 
        className="fixed inset-0 w-full h-full -z-10"
      />
      <div className="fixed inset-0 pointer-events-none">
        {/* MLG static elements */}
        <div className="absolute top-5 left-5 text-6xl animate-bounce">
          <SiDogecoin className="text-yellow-400" />
        </div>
        <div className="absolute top-5 right-5 rotate-12">
          <img src="/mlg/sniper.png" alt="sniper" className="w-24 h-24 object-contain" />
        </div>
        <div className="absolute bottom-5 left-5 -rotate-12">
          <img src="/mlg/faze.png" alt="faze" className="w-32 object-contain" />
        </div>
        <div className="absolute bottom-5 right-5">
          <Cannabis className="w-16 h-16 text-green-500 animate-spin" />
        </div>
        {/* Memecoin price chart */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-black/50 p-4 rounded-lg backdrop-blur-sm">
          <div className="flex items-center gap-2 text-green-400">
            <TrendingUp className="w-6 h-6" />
            <span className="font-bold">DOGE TO THE MOON 🚀</span>
          </div>
          <div className="w-64 h-32 mt-2 border border-green-500/30 rounded relative overflow-hidden">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute bottom-0 bg-green-500/20"
                style={{
                  left: `${i * 5}%`,
                  height: `${Math.random() * 100}%`,
                  width: '4px'
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
