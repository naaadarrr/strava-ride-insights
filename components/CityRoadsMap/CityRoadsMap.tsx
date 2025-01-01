import { useEffect, useRef, useState, useCallback } from 'react'
import { fetchRoadNetwork } from './utils/overpass'
import { ROAD_STYLE, GLOW_SETTINGS, ROUTE_STYLE, MAP_BACKGROUND } from './constants'
import { setupCanvas, clearCanvas } from './utils/canvas'
import {
  getExpandedBounds,
  calculateScale,
  projectPoint,
  getVisibleBounds,
} from './utils/projection'
import { MapInteractions } from './utils/interactions'
import { decodeRoutes, getBoundsForRoutes } from './utils/routes'
import { getColorForIntensity } from './utils/color'
import type { CityRoadsMapProps, Transform, Bounds, DecodedRoute } from './types'

export function CityRoadsMap({
  summaryPolyline,
  summaryPolylines,
  startLatlng,
  disableZoom = true,
}: CityRoadsMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [roadNetwork, setRoadNetwork] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [transform, setTransform] = useState<Transform>({ scale: 1, translateX: 0, translateY: 0 })

  // 处理单条或多条路线
  const routes = useRef<DecodedRoute[]>(
    decodeRoutes(summaryPolylines || (summaryPolyline ? [summaryPolyline] : []))
  )

  const boundsRef = useRef<Bounds>(getBoundsForRoutes(routes.current))

  const fetchRoads = useCallback(async (bounds: Bounds) => {
    try {
      setIsLoading(true)
      const expandedBounds = getExpandedBounds(bounds)
      const roads = await fetchRoadNetwork(expandedBounds)
      setRoadNetwork(prevRoads => [...prevRoads, ...roads])
    } catch (error) {
      console.error('Failed to fetch road network:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    routes.current = decodeRoutes(summaryPolylines || (summaryPolyline ? [summaryPolyline] : []))
    boundsRef.current = getBoundsForRoutes(routes.current)
    setRoadNetwork([]) // Clear existing roads
    fetchRoads(boundsRef.current)
  }, [summaryPolyline, summaryPolylines, fetchRoads])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || disableZoom) return

    const interactions = new MapInteractions(canvas, async newTransform => {
      setTransform(newTransform)

      const rect = canvas.getBoundingClientRect()
      const scale = calculateScale(boundsRef.current, rect.width, rect.height)
      const visibleBounds = getVisibleBounds(
        boundsRef.current,
        newTransform,
        rect.width,
        rect.height,
        scale
      )

      fetchRoads(visibleBounds)
    })

    return () => {
      interactions.dispose()
    }
  }, [fetchRoads, disableZoom])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = setupCanvas(canvas)
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const bounds = boundsRef.current
    const scale = calculateScale(bounds, rect.width, rect.height)

    clearCanvas(ctx)

    // Apply transform
    ctx.save()
    ctx.translate(transform.translateX, transform.translateY)
    ctx.scale(transform.scale, transform.scale)

    // Draw roads
    ctx.beginPath()
    ctx.strokeStyle = ROAD_STYLE.color
    ctx.globalAlpha = ROAD_STYLE.opacity
    ctx.lineWidth = ROAD_STYLE.width
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    roadNetwork.forEach(way => {
      way.coordinates.forEach(([lat, lng]: [number, number], index: number) => {
        const point = projectPoint(lat, lng, bounds, scale, rect.width, rect.height)
        if (index === 0) ctx.moveTo(point.x, point.y)
        else ctx.lineTo(point.x, point.y)
      })
    })
    ctx.stroke()

    // Draw routes with heat effect
    routes.current.forEach(route => {
      const color = getColorForIntensity(route.intensity)
      const baseWidth = Math.min(ROUTE_STYLE.maxWidth, ROUTE_STYLE.baseWidth + route.intensity * ROUTE_STYLE.intensityMultiplier)

      // Draw glow effect
      ctx.beginPath()
      ctx.strokeStyle = color
      ctx.lineWidth = baseWidth + GLOW_SETTINGS.blur
      ctx.globalAlpha = GLOW_SETTINGS.alpha
      ctx.filter = `blur(${GLOW_SETTINGS.blur}px)`

      route.points.forEach(([lat, lng], index) => {
        const point = projectPoint(lat, lng, bounds, scale, rect.width, rect.height)
        if (index === 0) ctx.moveTo(point.x, point.y)
        else ctx.lineTo(point.x, point.y)
      })
      ctx.stroke()

      // Draw main line
      ctx.beginPath()
      ctx.strokeStyle = color
      ctx.lineWidth = baseWidth
      ctx.globalAlpha = ROUTE_STYLE.opacity
      ctx.filter = 'none'

      route.points.forEach(([lat, lng], index) => {
        const point = projectPoint(lat, lng, bounds, scale, rect.width, rect.height)
        if (index === 0) ctx.moveTo(point.x, point.y)
        else ctx.lineTo(point.x, point.y)
      })
      ctx.stroke()
    })

    ctx.restore()
  }, [summaryPolyline, summaryPolylines, startLatlng, roadNetwork, transform])

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
      {isLoading && (
        <div className={`absolute inset-0 flex items-center justify-center`} style={{ backgroundColor: MAP_BACKGROUND }}>
          <div className="w-8 h-8 border-4 border-[#FF7311] border-t-transparent rounded-full animate-spin dark:border-[#FF9540] dark:border-t-transparent" />
        </div>
      )}
    </div>
  )
}
