'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'

type AssessmentType = 'Quiz1' | 'Quiz2' | 'Midsem' | 'Endsem' | 'Assignment'

interface MarksEntryFormProps {
  onClose?: () => void
}

const assessmentTypes: { label: string; value: AssessmentType }[] = [
  { label: 'Quiz 1', value: 'Quiz1' },
  { label: 'Quiz 2', value: 'Quiz2' },
  { label: 'Mid Semester', value: 'Midsem' },
  { label: 'End Semester', value: 'Endsem' },
  { label: 'Assignment', value: 'Assignment' },
]

export function MarksEntryForm({ onClose }: MarksEntryFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentType | null>(null)
  const [formData, setFormData] = useState({
    obtained: '',
    maximum: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedAssessment) return

    console.log('[v0] Marks submitted:', {
      assessment: selectedAssessment,
      ...formData,
    })

    // Reset form
    setFormData({
      obtained: '',
      maximum: '',
    })
    setSelectedAssessment(null)
    setIsOpen(false)
  }

  const handleClose = () => {
    setIsOpen(false)
    onClose?.()
    setSelectedAssessment(null)
    setFormData({
      obtained: '',
      maximum: '',
    })
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="glass-card rounded-xl p-4 border border-primary/20 hover:scale-105 smooth-hover transition-all duration-300 flex items-center justify-center gap-2 text-foreground font-medium"
      >
        <Plus className="w-4 h-4 text-primary" />
        Add Marks
      </button>
    )
  }

  return (
    <div className="glass-card rounded-2xl p-8 border border-primary/20 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">Enter Assessment Marks</h2>
        <button
          onClick={handleClose}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Assessment Type Selection */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Select Assessment Type
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {assessmentTypes.map(({ label, value }) => (
              <button
                key={value}
                type="button"
                onClick={() => setSelectedAssessment(value)}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  selectedAssessment === value
                    ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Marks Input */}
        {selectedAssessment && (
          <>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Obtained Marks
                </label>
                <input
                  type="number"
                  name="obtained"
                  value={formData.obtained}
                  onChange={handleInputChange}
                  placeholder="e.g., 18"
                  min="0"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Maximum Marks
                </label>
                <input
                  type="number"
                  name="maximum"
                  value={formData.maximum}
                  onChange={handleInputChange}
                  placeholder="e.g., 20"
                  min="1"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>
            </div>

            {/* Percentage Display */}
            {formData.obtained && formData.maximum && (
              <div className="bg-secondary/30 rounded-lg p-4 border border-primary/20">
                <p className="text-sm text-muted-foreground mb-1">Percentage</p>
                <p className="text-3xl font-bold text-primary">
                  {((parseFloat(formData.obtained) / parseFloat(formData.maximum)) * 100).toFixed(1)}
                  %
                </p>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium transition-all hover:shadow-lg hover:scale-105 active:scale-95"
              >
                Save Marks
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-medium transition-all hover:shadow-lg"
              >
                Cancel
              </button>
            </div>
          </>
        )}

        {!selectedAssessment && (
          <button
            type="button"
            onClick={handleClose}
            className="w-full bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-medium transition-all hover:shadow-lg"
          >
            Cancel
          </button>
        )}
      </form>
    </div>
  )
}
