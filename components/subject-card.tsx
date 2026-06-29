'use client'

import { TrendingUp, TrendingDown } from 'lucide-react'

interface SubjectCardProps {
  name: string
  credits: number
  attendance: number
  canSkip: number
  needFor75: number
  trend: 'up' | 'down' | 'stable'
}

export function SubjectCard({
  name,
  credits,
  attendance,
  canSkip,
  needFor75,
  trend,
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
    <div className="glass-card rounded-2xl p-6 border border-primary/20 hover:border-primary/40 smooth-hover flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground">{name}</h3>
          <p className="text-xs text-muted-foreground mt-1">{credits} Credits</p>
        </div>
        <div className="text-muted-foreground">{trendIcon}</div>
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
