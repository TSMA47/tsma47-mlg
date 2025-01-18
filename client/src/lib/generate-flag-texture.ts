export function createFlagTexture(): string {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 256
  const ctx = canvas.getContext('2d')!

  // Draw stripes
  const stripeHeight = canvas.height / 13
  for (let i = 0; i < 13; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#B22234' : '#FFFFFF'
    ctx.fillRect(0, i * stripeHeight, canvas.width, stripeHeight)
  }

  // Blue canton
  ctx.fillStyle = '#3C3B6E'
  ctx.fillRect(0, 0, canvas.width * 0.4, stripeHeight * 7)

  // Draw stars
  ctx.fillStyle = '#FFFFFF'
  const starRadius = stripeHeight / 3
  const startX = canvas.width * 0.04
  const startY = stripeHeight
  const cols = 6
  const rows = 5
  const spacingX = (canvas.width * 0.4 - startX * 2) / (cols - 1)
  const spacingY = (stripeHeight * 7 - startY * 2) / (rows - 1)

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = startX + col * spacingX
      const y = startY + row * spacingY
      drawStar(ctx, x, y, 5, starRadius, starRadius / 2)
    }
  }

  return canvas.toDataURL()
}

function drawStar(
  ctx: CanvasRenderingContext2D, 
  cx: number, 
  cy: number, 
  spikes: number, 
  outerRadius: number, 
  innerRadius: number
) {
  let rot = Math.PI / 2 * 3
  let x = cx
  let y = cy
  const step = Math.PI / spikes

  ctx.beginPath()
  ctx.moveTo(cx, cy - outerRadius)

  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius
    y = cy + Math.sin(rot) * outerRadius
    ctx.lineTo(x, y)
    rot += step

    x = cx + Math.cos(rot) * innerRadius
    y = cy + Math.sin(rot) * innerRadius
    ctx.lineTo(x, y)
    rot += step
  }

  ctx.lineTo(cx, cy - outerRadius)
  ctx.closePath()
  ctx.fill()
}
