import { MAP_BACKGROUND } from '../constants'

export function setupCanvas(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  const dpr = window.devicePixelRatio || 1
  const rect = canvas.getBoundingClientRect()
  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr
  ctx.scale(dpr, dpr)

  return ctx
}

export function clearCanvas(ctx: CanvasRenderingContext2D) {
  const { width, height } = ctx.canvas
  ctx.save()
  ctx.fillStyle = MAP_BACKGROUND
  ctx.fillRect(0, 0, width, height)
}
