import type { GradientColor } from './types'

/**
 * 城市路线的默认样式
 */
export const ROAD_STYLE = {
  width: 0.5,
  color: 'rgba(26, 26, 26, 0.8)',
  opacity: 1,
}

export const ZOOM_LIMITS = {
  MIN: 0.5,
  MAX: 4,
}

export const HEATMAP_COLORS: GradientColor[] = [
  { stop: 0, color: 'rgb(255, 183, 111)' }, // 更深的基础橙色
  { stop: 0.3, color: 'rgb(255, 149, 64)' }, // 深橙色
  { stop: 0.5, color: 'rgb(255, 115, 17)' }, // 更深的橙色
  { stop: 0.7, color: 'rgb(255, 81, 0)' }, // 红橙色
  { stop: 1, color: 'rgb(255, 0, 0)' }, // 纯红色
]

export const GLOW_SETTINGS = {
  blur: 2,
  alpha: 0.3,
}
