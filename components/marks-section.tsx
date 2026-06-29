'use client'

interface Assessment {
  name: string
  obtained: number
  maximum: number
}

interface MarksSectionProps {
  assessments: Assessment[]
}

export function MarksSection({ assessments }: MarksSectionProps) {
  const calculatePercentage = (obtained: number, maximum: number) => {
    return Math.round((obtained / maximum) * 100)
  }

  const getAssessmentColor = (percentage: number) => {
    if (percentage >= 85) return { bg: 'bg-primary/10', border: 'border-primary/30', bar: 'bg-primary' }
    if (percentage >= 70) return { bg: 'bg-accent/10', border: 'border-accent/30', bar: 'bg-accent' }
    if (percentage >= 50) return { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', bar: 'bg-yellow-500' }
    return { bg: 'bg-destructive/10', border: 'border-destructive/30', bar: 'bg-destructive' }
  }

  return (
    <div className="glass-card rounded-3xl p-8 border border-primary/20">
      <h2 className="text-2xl font-bold text-foreground mb-8">Assessment Marks</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {assessments.map((assessment) => {
          const percentage = calculatePercentage(assessment.obtained, assessment.maximum)
          const colors = getAssessmentColor(percentage)

          return (
            <div
              key={assessment.name}
              className={`${colors.bg} ${colors.border} rounded-2xl p-6 border backdrop-blur-sm hover:scale-105 transition-transform duration-300`}
            >
              {/* Header */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-foreground">{assessment.name}</h3>
              </div>

              {/* Marks */}
              <div className="mb-4">
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-2xl font-bold text-foreground">{assessment.obtained}</span>
                  <span className="text-xs text-muted-foreground">/ {assessment.maximum}</span>
                </div>
                <div className="text-xs text-muted-foreground">{percentage}%</div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-border/50 rounded-full h-2 overflow-hidden">
                <div
                  className={`${colors.bar} h-full transition-all duration-500 rounded-full`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
