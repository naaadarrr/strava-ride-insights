import type { Bounds, Transform } from '../types'

export function getBounds(points: [number, number][]): Bounds {
  return points.reduce(
    (bounds, [lat, lng]) => ({
      minLat: Math.min(bounds.minLat, lat),
      maxLat: Math.max(bounds.maxLat, lat),
      minLng: Math.min(bounds.minLng, lng),
      maxLng: Math.max(bounds.maxLng, lng),
    }),
    {
      minLat: Infinity,
      maxLat: -Infinity,
      minLng: Infinity,
      maxLng: -Infinity,
    }
  )
}

export function getExpandedBounds(bounds: Bounds, padding: number = 0.02): Bounds {
  return {
    minLat: bounds.minLat - padding,
    maxLat: bounds.maxLat + padding,
    minLng: bounds.minLng - padding,
    maxLng: bounds.maxLng + padding,
  }
}

export function calculateScale(bounds: Bounds, width: number, height: number) {
  return (
    Math.min(width / (bounds.maxLng - bounds.minLng), height / (bounds.maxLat - bounds.minLat)) *
    0.9
  )
}

export function projectPoint(
  lat: number,
  lng: number,
  bounds: Bounds,
  scale: number,
  width: number,
  height: number
) {
  const x = (lng - bounds.minLng) * scale + (width - (bounds.maxLng - bounds.minLng) * scale) / 2
  const y = (bounds.maxLat - lat) * scale + (height - (bounds.maxLat - bounds.minLat) * scale) / 2
  return { x, y }
}

export function getVisibleBounds(
  originalBounds: Bounds,
  transform: Transform,
  width: number,
  height: number,
  scale: number
): Bounds {
  // 计算变换后的可视区域范围
  const topLeft = inverseProjectPoint(
    -transform.translateX / transform.scale,
    -transform.translateY / transform.scale,
    originalBounds,
    scale,
    width,
    height
  )

  const bottomRight = inverseProjectPoint(
    (width - transform.translateX) / transform.scale,
    (height - transform.translateY) / transform.scale,
    originalBounds,
    scale,
    width,
    height
  )

  return {
    minLat: Math.min(topLeft.lat, bottomRight.lat),
    maxLat: Math.max(topLeft.lat, bottomRight.lat),
    minLng: Math.min(topLeft.lng, bottomRight.lng),
    maxLng: Math.max(topLeft.lng, bottomRight.lng),
  }
}

function inverseProjectPoint(
  x: number,
  y: number,
  bounds: Bounds,
  scale: number,
  width: number,
  height: number
) {
  const centerOffsetX = (width - (bounds.maxLng - bounds.minLng) * scale) / 2
  const centerOffsetY = (height - (bounds.maxLat - bounds.minLat) * scale) / 2

  const lng = (x - centerOffsetX) / scale + bounds.minLng
  const lat = bounds.maxLat - (y - centerOffsetY) / scale

  return { lat, lng }
}
