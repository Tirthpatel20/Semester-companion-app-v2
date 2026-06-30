'use client'

interface SubjectHeaderProps {
  name: string
  credits: number
  attendance: number
  
}

export function SubjectHeader({ name, credits, attendance }: SubjectHeaderProps) {
  const statusConfig = {
    excellent: { bg: 'bg-primary/10', text: 'text-primary', label: 'Excellent' },
    good: { bg: 'bg-accent/10', text: 'text-accent', label: 'Good' },
    warning: { bg: 'bg-yellow-500/10', text: 'text-yellow-500', label: 'At Risk' },
    critical: { bg: 'bg-destructive/10', text: 'text-destructive', label: 'Critical' },
  }

  

  return (
    <div className="glass-card rounded-3xl p-8 border border-primary/20 mb-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-foreground mb-2">{name}</h1>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Credits:</span>
              <span className="font-semibold text-foreground bg-secondary/50 px-3 py-1 rounded-lg">
                {credits}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Attendance:</span>
              <span className="font-semibold text-foreground bg-secondary/50 px-3 py-1 rounded-lg">
                {attendance}%
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
