'use client'

import { ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: string | number
  unit?: string
  icon?: ReactNode
  variant?: 'default' | 'warning' | 'success'
}

export function StatCard({ label, value, unit, icon, variant = 'default' } : StatCardProps) {
  const variantStyles = {
    default: 'border-primary/20',
    warning: 'border-destructive/20',
    success: 'border-primary/30',
  }

  return (
    <div className={`glass-card rounded-2xl p-6 border ${variantStyles[variant]} hover:border-primary/40 smooth-hover`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-muted-foreground text-sm font-medium">{label}</p>
          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-3xl font-bold text-foreground">{value}</span>
            {unit && <span className="text-muted-foreground text-sm">{unit}</span>}
          </div>
        </div>
        {icon && (
          <div className="p-3 bg-primary/10 rounded-lg">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
