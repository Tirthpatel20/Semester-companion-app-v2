'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, AlertCircle, Zap } from 'lucide-react'

interface GradePlannerProps {
  obtainedMarks: number
  totalMarks: number
  remainingMarks: number
}

export function GradePlanner({ obtainedMarks, totalMarks, remainingMarks }: GradePlannerProps) {
  const [desiredGrade, setDesiredGrade] = useState<number>(80)
  const [result, setResult] = useState<{
    isAchievable: boolean
    requiredMarks: number
    difficulty: string
  } | null>(null)

  useEffect(() => {
    const requiredMarks = Math.ceil((desiredGrade / 100) * totalMarks)
    const marksNeeded = Math.max(0, requiredMarks - obtainedMarks)
    const isAchievable = marksNeeded <= remainingMarks

    let difficulty = 'Moderate'
    if (marksNeeded <= remainingMarks * 0.3) difficulty = 'Very Easy'
    else if (marksNeeded <= remainingMarks * 0.6) difficulty = 'Easy'
    else if (marksNeeded <= remainingMarks * 0.85) difficulty = 'Moderate'
    else if (marksNeeded <= remainingMarks) difficulty = 'Hard'
    else difficulty = 'Impossible'

    setResult({
      isAchievable,
      requiredMarks: marksNeeded,
      difficulty,
    })
  }, [desiredGrade, obtainedMarks, totalMarks, remainingMarks])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Very Easy':
        return { bg: 'bg-primary/10', text: 'text-primary', icon: CheckCircle }
      case 'Easy':
        return { bg: 'bg-accent/10', text: 'text-accent', icon: CheckCircle }
      case 'Moderate':
        return { bg: 'bg-yellow-500/10', text: 'text-yellow-500', icon: Zap }
      case 'Hard':
        return { bg: 'bg-orange-500/10', text: 'text-orange-500', icon: AlertCircle }
      default:
        return { bg: 'bg-destructive/10', text: 'text-destructive', icon: AlertCircle }
    }
  }

  const difficultyInfo = getDifficultyColor(result?.difficulty || 'Moderate')
  const DiffIcon = difficultyInfo.icon

  return (
    <div className="glass-card rounded-3xl p-8 border border-primary/20">
      <h2 className="text-2xl font-bold text-foreground mb-8">Grade Planner</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Input Section */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-4">
              Desired Grade: <span className="text-primary">{desiredGrade}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={desiredGrade}
              onChange={(e) => setDesiredGrade(Number(e.target.value))}
              className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Current Progress */}
          <div className="bg-secondary/30 rounded-2xl p-6 border border-primary/10">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Current Score</span>
                <span className="font-semibold text-foreground">{obtainedMarks} / {totalMarks}</span>
              </div>
              <div className="w-full bg-border/50 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-primary h-full transition-all duration-500 rounded-full"
                  style={{ width: `${(obtainedMarks / totalMarks) * 100}%` }}
                />
              </div>
              <div className="text-xs text-muted-foreground">
                {Math.round((obtainedMarks / totalMarks) * 100)}% complete
              </div>
            </div>
          </div>

          {/* Remaining Marks */}
          <div className="bg-accent/20 rounded-2xl p-6 border border-accent/30">
            <div className="text-sm text-muted-foreground mb-2">Remaining Marks Available</div>
            <div className="text-3xl font-bold text-accent">{remainingMarks}</div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          <div className="h-full">
            {result && (
              <div className="space-y-6">
                {/* Achievability */}
                <div
                  className={`rounded-2xl p-6 border ${
                    result.isAchievable
                      ? 'bg-primary/10 border-primary/30'
                      : 'bg-destructive/10 border-destructive/30'
                  }`}
                >
                  <div className="text-sm text-muted-foreground mb-2">Target Grade Achievability</div>
                  <div className="text-2xl font-bold text-foreground mb-3">
                    {result.isAchievable ? '✓ Achievable' : '✗ Not Achievable'}
                  </div>
                  <div className="text-sm text-foreground">
                    {result.isAchievable ? (
                      <span className="text-primary">You can reach {desiredGrade}% with focused effort</span>
                    ) : (
                      <span className="text-destructive">
                        You need {Math.abs(remainingMarks - result.requiredMarks)} more marks than available
                      </span>
                    )}
                  </div>
                </div>

                {/* Required Marks */}
                <div className="bg-secondary/30 rounded-2xl p-6 border border-primary/10">
                  <div className="text-sm text-muted-foreground mb-2">Required Marks</div>
                  <div className="text-3xl font-bold text-accent mb-2">{result.requiredMarks}</div>
                  <div className="text-xs text-muted-foreground">
                    out of {remainingMarks} remaining marks
                  </div>
                  <div className="w-full bg-border/50 rounded-full h-2 overflow-hidden mt-3">
                    <div
                      className="bg-accent h-full transition-all duration-500 rounded-full"
                      style={{ width: `${(result.requiredMarks / remainingMarks) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Difficulty */}
                <div
                  className={`${difficultyInfo.bg} rounded-2xl p-6 border ${
                    result.difficulty === 'Impossible'
                      ? 'border-destructive/30'
                      : 'border-primary/20'
                  } flex items-start gap-4`}
                >
                  <DiffIcon className={`w-6 h-6 ${difficultyInfo.text} flex-shrink-0 mt-1`} />
                  <div>
                    <div className={`font-bold ${difficultyInfo.text}`}>
                      {result.difficulty} Difficulty
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {result.difficulty === 'Very Easy' && 'You can reach this easily'}
                      {result.difficulty === 'Easy' && 'Well within your grasp'}
                      {result.difficulty === 'Moderate' && 'Requires consistent effort'}
                      {result.difficulty === 'Hard' && 'Will require maximum effort'}
                      {result.difficulty === 'Impossible' && 'Not possible with remaining assessments'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
