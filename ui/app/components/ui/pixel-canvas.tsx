'use client'

import { useEffect, useRef } from 'react'

interface Pixel {
  x: number
  y: number
  size: number
  maxSize: number
  minSize: number
  color: string
  speed: number
  delay: number
  counter: number
  counterStep: number
  isIdle: boolean
  isReverse: boolean
  isShimmer: boolean
  sizeStep: number
}

interface PixelCanvasProps {
  className?: string
}

export function PixelCanvas({ className }: PixelCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let frame: number
    let width = canvas.offsetWidth
    let height = canvas.offsetHeight
    const pixelRatio = window.devicePixelRatio || 1
    const gap = 4 // Reduced gap for denser pixels
    
    class PixelInstance implements Pixel {
      public size: number
      public maxSize: number
      public minSize: number
      public counter: number
      public counterStep: number
      public isIdle: boolean
      public isReverse: boolean
      public isShimmer: boolean
      public sizeStep: number

      constructor(
        public x: number,
        public y: number,
        public color: string,
        public speed: number,
        public delay: number
      ) {
        this.size = 0
        this.sizeStep = Math.random() * 0.4
        this.minSize = 1
        this.maxSize = Math.random() * 2 + 1
        this.counter = 0
        this.counterStep = Math.random() * 4 + (width + height) * 0.01
        this.isIdle = false
        this.isReverse = false
        this.isShimmer = false
      }

      draw() {
        if (!ctx) return
        const centerOffset = 2 * 0.5 - this.size * 0.5
        ctx.fillStyle = this.color
        ctx.fillRect(this.x + centerOffset, this.y + centerOffset, this.size, this.size)
      }

      appear() {
        this.isIdle = false

        if (this.counter <= this.delay) {
          this.counter += this.counterStep
          return
        }

        if (this.size >= this.maxSize) {
          this.isShimmer = true
        }

        if (this.isShimmer) {
          this.shimmer()
        } else {
          this.size += this.sizeStep
        }

        this.draw()
      }

      disappear() {
        this.isShimmer = false
        this.counter = 0

        if (this.size <= 0) {
          this.isIdle = true
          return
        }
        this.size -= 0.1
        this.draw()
      }

      shimmer() {
        if (this.size >= this.maxSize) {
          this.isReverse = true
        } else if (this.size <= this.minSize) {
          this.isReverse = false
        }

        if (this.isReverse) {
          this.size -= this.speed
        } else {
          this.size += this.speed
        }
      }
    }

    let pixels: PixelInstance[] = []

    const getRandomColor = () => {
      return `hsla(var(--pixel-primary), var(--pixel-opacity))`
    }

    const resize = () => {
      width = canvas.offsetWidth
      height = canvas.offsetHeight
      canvas.width = width * pixelRatio
      canvas.height = height * pixelRatio
      ctx.scale(pixelRatio, pixelRatio)
      
      const cols = Math.floor(width / gap)
      const rows = Math.floor(height / gap)
      pixels = []
      
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * gap
          const y = j * gap
          const delay = Math.sqrt(
            Math.pow(x - width/2, 2) + 
            Math.pow(y - height/2, 2)
          ) * 0.3
          pixels.push(new PixelInstance(x, y, getRandomColor(), 0.1, delay))
        }
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height)
      
      pixels.forEach(pixel => {
        pixel.appear()
      })

      frame = requestAnimationFrame(animate)
    }

    const handlePointer = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      pixels.forEach(pixel => {
        const dx = x - pixel.x
        const dy = y - pixel.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < 40) { // Reduced interaction radius
          pixel.size = pixel.maxSize
          pixel.isShimmer = true
        }
      })
    }

    resize()
    animate()

    canvas.addEventListener('pointermove', handlePointer)
    window.addEventListener('resize', resize)

    return () => {
      canvas.removeEventListener('pointermove', handlePointer)
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-auto ${className}`}
      style={{
        touchAction: 'none',
      }}
    />
  )
} 