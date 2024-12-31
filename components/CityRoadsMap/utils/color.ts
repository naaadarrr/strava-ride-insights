import type { GradientColor } from '../types'
import { HEATMAP_COLORS } from '../constants'

export function getColorForIntensity(intensity: number): string {
  if (intensity <= HEATMAP_COLORS[0].stop) return HEATMAP_COLORS[0].color
  if (intensity >= HEATMAP_COLORS[HEATMAP_COLORS.length - 1].stop) {
    return HEATMAP_COLORS[HEATMAP_COLORS.length - 1].color
  }

  let startColor: GradientColor = HEATMAP_COLORS[0]
  let endColor: GradientColor = HEATMAP_COLORS[1]

  // Find the two colors to interpolate between
  for (let i = 1; i < HEATMAP_COLORS.length; i++) {
    if (intensity <= HEATMAP_COLORS[i].stop) {
      startColor = HEATMAP_COLORS[i - 1]
      endColor = HEATMAP_COLORS[i]
      break
    }
  }

  // Calculate the position between the two colors
  const ratio = (intensity - startColor.stop) / (endColor.stop - startColor.stop)

  // Parse the RGB values
  const startRGB = parseRGB(startColor.color)
  const endRGB = parseRGB(endColor.color)

  // Interpolate between the colors
  const r = Math.round(startRGB.r + (endRGB.r - startRGB.r) * ratio)
  const g = Math.round(startRGB.g + (endRGB.g - startRGB.g) * ratio)
  const b = Math.round(startRGB.b + (endRGB.b - startRGB.b) * ratio)

  return `rgb(${r}, ${g}, ${b})`
}

function parseRGB(color: string) {
  const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
  if (!match) throw new Error('Invalid RGB color format')
  return {
    r: parseInt(match[1]),
    g: parseInt(match[2]),
    b: parseInt(match[3]),
  }
}
