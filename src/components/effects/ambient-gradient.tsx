'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils/cn'

interface AmbientGradientProps {
  className?: string
}

export function AmbientGradient({ className }: AmbientGradientProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReducedMotion) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let time = 0

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2)
      canvas.width = canvas.offsetWidth * dpr
      canvas.height = canvas.offsetHeight * dpr
      ctx.scale(dpr, dpr)
    }

    const draw = () => {
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight

      ctx.clearRect(0, 0, w, h)

      const x1 = w * 0.3 + Math.sin(time * 0.0003) * w * 0.15
      const y1 = h * 0.4 + Math.cos(time * 0.0004) * h * 0.1
      const r1 = Math.min(w, h) * 0.4

      const gradient1 = ctx.createRadialGradient(x1, y1, 0, x1, y1, r1)
      gradient1.addColorStop(0, 'rgba(200, 190, 180, 0.15)')
      gradient1.addColorStop(0.5, 'rgba(180, 170, 160, 0.08)')
      gradient1.addColorStop(1, 'rgba(160, 150, 140, 0)')

      ctx.fillStyle = gradient1
      ctx.fillRect(0, 0, w, h)

      const x2 = w * 0.7 + Math.cos(time * 0.0002) * w * 0.1
      const y2 = h * 0.6 + Math.sin(time * 0.0003) * h * 0.15
      const r2 = Math.min(w, h) * 0.35

      const gradient2 = ctx.createRadialGradient(x2, y2, 0, x2, y2, r2)
      gradient2.addColorStop(0, 'rgba(220, 215, 210, 0.12)')
      gradient2.addColorStop(0.6, 'rgba(200, 195, 190, 0.05)')
      gradient2.addColorStop(1, 'rgba(180, 175, 170, 0)')

      ctx.fillStyle = gradient2
      ctx.fillRect(0, 0, w, h)

      time += 16
      animationId = requestAnimationFrame(draw)
    }

    resize()
    draw()

    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={cn('absolute inset-0 w-full h-full pointer-events-none', className)}
      aria-hidden="true"
    />
  )
}
