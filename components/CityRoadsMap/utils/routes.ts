import polyline from '@mapbox/polyline'
import type { Bounds, DecodedRoute } from '../types'

export function decodeRoutes(polylines: string[]): DecodedRoute[] {
  // 创建一个 Map 来存储每个点的出现频率
  const pointFrequencyMap = new Map<string, number>()
  let maxFrequency = 1

  // 解码所有路线并记录点的频率
  polylines.forEach(line => {
    const points = polyline.decode(line)
    points.forEach(([lat, lng]) => {
      const key = `${lat.toFixed(5)},${lng.toFixed(5)}`
      const newFreq = (pointFrequencyMap.get(key) || 0) + 1
      pointFrequencyMap.set(key, newFreq)
      maxFrequency = Math.max(maxFrequency, newFreq)
    })
  })

  // 将路线转换为带频率和强度的点数组
  return polylines.map(line => {
    const points = polyline.decode(line)
    const frequency = Math.max(
      ...points.map(
        ([lat, lng]) => pointFrequencyMap.get(`${lat.toFixed(5)},${lng.toFixed(5)}`) || 1
      )
    )

    // 计算强度值 (0-1 范围)
    const intensity = (frequency - 1) / (maxFrequency - 1)

    return {
      points,
      frequency,
      intensity,
    }
  })
}

export function getBoundsForRoutes(routes: DecodedRoute[]): Bounds {
  const allPoints = routes.flatMap(route => route.points)
  return allPoints.reduce(
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
