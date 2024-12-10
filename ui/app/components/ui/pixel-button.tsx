'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '../../lib/utils'
import { PixelCanvas } from './pixel-canvas'

interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'gradient'
}

export const PixelButton = forwardRef<HTMLButtonElement, PixelButtonProps>(
  ({ className, children, variant = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'group relative overflow-hidden rounded-md px-4 py-2 transition-all duration-300',
          'hover:bg-background/50',
          variant === 'gradient' && 'text-gradient',
          className
        )}
        {...props}
      >
        <span className="relative z-10">
          {children}
        </span>
        <div className="absolute inset-0 opacity-50 group-hover:opacity-100 transition-opacity duration-300">
          <PixelCanvas />
        </div>
      </button>
    )
  }
)

PixelButton.displayName = 'PixelButton' 