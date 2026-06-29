'use client'

import { TrendingUp, TrendingDown } from 'lucide-react'

interface AttendanceSectionProps {
  attendance: number
  presentClasses: number
  absentClasses: number
  totalClasses: number
  canSkip: number
  needFor75: number
  trend: 'up' | 'down' | 'stable'
}

export function AttendanceSection({
  attendance,
  presentClasses,
  absentClasses,
  totalClasses,
  canSkip,
  needFor75,
  trend,
}: AttendanceSectionProps) {
  const circumference = 2 * Math.PI * 55
  const strokeDashoffset = circumference - (attendance / 100) * circumference

  return (
    <div className="glass-card rounded-3xl p-8 border border-primary/20">
      <h2 className="text-2xl font-bold text-foreground mb-8">Attendance Analytics</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Circular Progress Ring */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-48 h-48">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              {/* Background circle */}
              <circle
                cx="60"
                cy="60"
                r="55"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className="text-border"
              />
              {/* Progress circle */}
              <circle
                cx="60"
                cy="60"
                r="55"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="text-primary transition-all duration-700"
                strokeLinecap="round"
              />
            </svg>
            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-foreground">{attendance}%</span>
              <span className="text-sm text-muted-foreground mt-2">Current</span>
            </div>
          </div>

          {/* Trend */}
          <div className="mt-6 flex items-center gap-2">
            {trend === 'up' && (
              <>
                <TrendingUp className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-primary">Improving</span>
              </>
            )}
            {trend === 'down' && (
              <>
                <TrendingDown className="w-5 h-5 text-destructive" />
                <span className="text-sm font-medium text-destructive">Declining</span>
              </>
            )}
            {trend === 'stable' && (
              <>
                <div className="w-5 h-5 bg-primary/50 rounded" />
                <span className="text-sm font-medium text-muted-foreground">Stable</span>
              </>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="space-y-6">
          {/* Main Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-secondary/20 rounded-2xl p-4 text-center border border-primary/10">
              <div className="text-sm text-muted-foreground mb-2">Present</div>
              <div className="text-3xl font-bold text-primary">{presentClasses}</div>
            </div>
            <div className="bg-destructive/10 rounded-2xl p-4 text-center border border-destructive/20">
              <div className="text-sm text-muted-foreground mb-2">Absent</div>
              <div className="text-3xl font-bold text-destructive">{absentClasses}</div>
            </div>
            <div className="bg-accent/10 rounded-2xl p-4 text-center border border-primary/10">
              <div className="text-sm text-muted-foreground mb-2">Total</div>
              <div className="text-3xl font-bold text-accent">{totalClasses}</div>
            </div>
          </div>

          {/* Analytics */}
          <div className="space-y-4 pt-4 border-t border-border/50">
            <div className="flex items-center justify-between">
              <span className="text-foreground font-medium">Classes Can Skip</span>
              <div className="bg-primary/20 text-primary px-4 py-2 rounded-xl font-semibold">
                {canSkip} classes
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-foreground font-medium">Needed for 75%</span>
              <div className="bg-accent/20 text-accent px-4 py-2 rounded-xl font-semibold">
                {needFor75} classes
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
