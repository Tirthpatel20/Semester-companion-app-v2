'use client'

import { TrendingUp, TrendingDown, Trash2, Pencil } from 'lucide-react'

interface SubjectCardProps {
  name: string
  credits: number
  attendance: number
  canSkip: number
  needFor75: number
  trend: 'up' | 'down' | 'stable'
  onEdit?: () => void
  onDelete?: () => void
}

export function SubjectCard({
  name,
  credits,
  attendance,
  canSkip,
  needFor75,
  trend,
  onEdit,
  onDelete,
}: SubjectCardProps) {
  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (attendance / 100) * circumference

  const trendIcon =
    trend === 'up' ? (
      <TrendingUp className="w-4 h-4 text-primary" />
    ) : trend === 'down' ? (
      <TrendingDown className="w-4 h-4 text-destructive" />
    ) : (
      <div className="w-4 h-4" />
    )

  return (
    <div className="relative group glass-card rounded-2xl p-6 border border-primary/20 hover:border-primary/40 smooth-hover flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 relative">
        <div className="flex-1 pr-12">
          <h3 className="text-lg font-semibold text-foreground">{name}</h3>
          <p className="text-xs text-muted-foreground mt-1">{credits} Credits</p>
        </div>
        <div className="flex items-center min-h-[24px]">
          <div className="text-muted-foreground group-hover:opacity-0 group-focus-within:opacity-0 transition-opacity duration-200">
            {trendIcon}
          </div>
          {onEdit && onDelete && (
            <div className="absolute top-0 right-0 flex gap-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 z-10">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onEdit();
                }}
                className="p-1 rounded-lg bg-background/50 hover:bg-background border border-border text-muted-foreground hover:text-foreground transition-all duration-200 shadow-sm flex items-center justify-center focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                title={`Edit ${name}`}
                aria-label={`Edit ${name}`}
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete();
                }}
                className="p-1 rounded-lg bg-background/50 hover:bg-destructive/15 border border-border text-muted-foreground hover:text-destructive transition-all duration-200 shadow-sm flex items-center justify-center focus-visible:ring-2 focus-visible:ring-destructive focus-visible:outline-none"
                title={`Delete ${name}`}
                aria-label={`Delete ${name}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Circular Progress */}
      <div className="flex justify-center mb-8">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="text-border"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="text-primary transition-all duration-500"
              strokeLinecap="round"
            />
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-foreground">{attendance}%</span>
            <span className="text-xs text-muted-foreground">Attendance</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Classes Can Skip</span>
          <span className="font-semibold text-foreground bg-primary/10 px-3 py-1 rounded-full">
            {canSkip}
          </span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Needed for 75%</span>
          <span className="font-semibold text-foreground bg-accent/10 px-3 py-1 rounded-full">
            {needFor75}
          </span>
        </div>
      </div>
    </div>
  )
}
