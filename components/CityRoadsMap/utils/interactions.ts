import type { Transform, Point } from '../types'
import { ZOOM_LIMITS } from '../constants'

export class MapInteractions {
  private canvas: HTMLCanvasElement
  private transform: Transform = { scale: 1, translateX: 0, translateY: 0 }
  private isDragging = false
  private lastPoint: Point | null = null
  private onTransform: (transform: Transform) => void

  constructor(canvas: HTMLCanvasElement, onTransform: (transform: Transform) => void) {
    this.canvas = canvas
    this.onTransform = onTransform
    this.setupEventListeners()
  }

  private setupEventListeners() {
    this.canvas.addEventListener('wheel', this.handleWheel, { passive: false })
    this.canvas.addEventListener('mousedown', this.handleMouseDown)
    window.addEventListener('mousemove', this.handleMouseMove)
    window.addEventListener('mouseup', this.handleMouseUp)
    window.addEventListener('mouseleave', this.handleMouseUp)
  }

  private handleWheel = (e: WheelEvent) => {
    e.preventDefault()
    const rect = this.canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const factor = e.deltaY < 0 ? 1.1 : 0.9

    // 计算新的缩放值
    const newScale = this.transform.scale * factor

    // 检查缩放限制
    if (newScale < ZOOM_LIMITS.MIN || newScale > ZOOM_LIMITS.MAX) {
      return
    }

    this.transform = {
      scale: newScale,
      translateX: x - (x - this.transform.translateX) * factor,
      translateY: y - (y - this.transform.translateY) * factor,
    }

    this.onTransform({ ...this.transform })
  }

  private handleMouseDown = (e: MouseEvent) => {
    e.preventDefault()
    this.isDragging = true
    const rect = this.canvas.getBoundingClientRect()
    this.lastPoint = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
    this.canvas.style.cursor = 'grabbing'
  }

  private handleMouseMove = (e: MouseEvent) => {
    if (!this.isDragging || !this.lastPoint) return

    const rect = this.canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    this.transform = {
      ...this.transform,
      translateX: this.transform.translateX + (x - this.lastPoint.x),
      translateY: this.transform.translateY + (y - this.lastPoint.y),
    }

    this.lastPoint = { x, y }
    this.onTransform({ ...this.transform })
  }

  private handleMouseUp = () => {
    this.isDragging = false
    this.lastPoint = null
    this.canvas.style.cursor = 'grab'
  }

  dispose() {
    this.canvas.removeEventListener('wheel', this.handleWheel)
    this.canvas.removeEventListener('mousedown', this.handleMouseDown)
    window.removeEventListener('mousemove', this.handleMouseMove)
    window.removeEventListener('mouseup', this.handleMouseUp)
    window.removeEventListener('mouseleave', this.handleMouseUp)
  }
}
