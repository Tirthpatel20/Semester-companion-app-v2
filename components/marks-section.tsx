"use client";

import { Pencil, Trash2, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Assessment {
  id: number;
  name: string;
  maxMarks: number;
  obtainedMarks: number | null;
  weightage: number;
}

interface MarksSectionProps {
  assessments: Assessment[];

  onEdit: (assessment: Assessment) => void;

  onDelete: (id: number) => void;

  onAddAssessment?: () => void;
}

export function MarksSection({
  assessments,
  onEdit,
  onDelete,
  onAddAssessment,
}: MarksSectionProps) {
  const calculatePercentage = (obtainedMarks: number, maxMarks: number) => {
    if (maxMarks === 0) return 0;

    return Number(((obtainedMarks / maxMarks) * 100).toFixed(1));
  };

  const getAssessmentColor = (percentage: number) => {
    if (percentage >= 85)
      return {
        bg: "bg-primary/10",
        border: "border-primary/30",
        bar: "bg-primary",
      };
    if (percentage >= 70)
      return {
        bg: "bg-accent/10",
        border: "border-accent/30",
        bar: "bg-accent",
      };
    if (percentage >= 50)
      return {
        bg: "bg-yellow-500/10",
        border: "border-yellow-500/30",
        bar: "bg-yellow-500",
      };
    return {
      bg: "bg-destructive/10",
      border: "border-destructive/30",
      bar: "bg-destructive",
    };
  };

  if (assessments.length === 0) {
    return (
      <div className="glass-card rounded-3xl p-8 border border-primary/20 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-8 text-left">
          Assessment Marks
        </h2>
        <div className="flex flex-col items-center justify-center py-12 px-4 max-w-md mx-auto">
          <div className="p-4 bg-primary/10 rounded-full mb-4 text-primary">
            <ClipboardList className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No assessments added
          </h3>
          <p className="text-muted-foreground text-sm mb-6 text-center">
            Add your first assessment to start tracking marks and weightage for
            this subject.
          </p>
          {onAddAssessment && (
            <Button
              variant="default"
              onClick={onAddAssessment}
              className="rounded-xl px-6 py-2.5 font-medium transition-all hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none flex items-center gap-2"
              title="Add Assessment"
              aria-label="Add Assessment"
            >
              Add Assessment
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-3xl p-8 border border-primary/20">
      <h2 className="text-2xl font-bold text-foreground mb-8">
        Assessment Marks
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {assessments.map((assessment) => {
          const percentage = calculatePercentage(
            assessment.obtainedMarks ?? 0,
            assessment.maxMarks,
          );
          const colors = getAssessmentColor(percentage);

          return (
            <div
              key={assessment.id}
              className={`${colors.bg} ${colors.border} relative group rounded-2xl p-4 md:p-6 border backdrop-blur-sm hover:scale-[1.03] transition-all duration-300`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3 md:mb-4 relative">
                <div className="pr-12">
                  <h3 className="font-semibold text-foreground text-sm md:text-base">
                    {assessment.name}
                  </h3>

                  <p className="text-[11px] md:text-xs text-muted-foreground mt-0.5 md:mt-1">
                    Weightage: {assessment.weightage}%
                  </p>
                </div>

                <div className="flex items-center gap-1.5 min-h-[24px]">
                  <div className="hidden md:block text-[10px] md:text-xs bg-secondary/85 px-1.5 py-0.5 md:px-2 md:py-1 rounded-lg text-muted-foreground md:group-hover:opacity-0 md:group-focus-within:opacity-0 transition-opacity duration-200">
                    {assessment.maxMarks} Marks
                  </div>
                  <div className="absolute right-0 flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onEdit(assessment);
                      }}
                      className="p-1 rounded-lg bg-background/60 hover:bg-background border border-border text-muted-foreground hover:text-foreground transition-all duration-200 shadow-sm flex items-center justify-center focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                      title="Edit Assessment"
                      aria-label={`Edit ${assessment.name}`}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onDelete(assessment.id);
                      }}
                      className="p-1 rounded-lg bg-background/60 hover:bg-destructive/15 border border-border text-muted-foreground hover:text-destructive transition-all duration-200 shadow-sm flex items-center justify-center focus-visible:ring-2 focus-visible:ring-destructive focus-visible:outline-none"
                      title="Delete Assessment"
                      aria-label={`Delete ${assessment.name}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Marks */}
              <div className="mb-3 md:mb-4">
                {assessment.obtainedMarks == null ? (
                  <>
                    <p className="text-xl md:text-2xl font-bold text-muted-foreground">
                      —
                    </p>

                    <p className="text-sm text-muted-foreground">
                      Not Attempted
                    </p>
                  </>
                ) : (
                  <>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl md:text-3xl font-bold text-foreground">
                        {assessment.obtainedMarks}
                      </span>

                      <span className="text-xs md:text-sm text-muted-foreground">
                        / {assessment.maxMarks}
                      </span>
                    </div>

                    <p className="text-xs md:text-sm text-primary font-medium mt-0.5 md:mt-1">
                      {percentage}%
                    </p>
                  </>
                )}
              </div>

              {/* Progress */}
              <div className="w-full h-2 bg-border rounded-full overflow-hidden mb-4">
                <div
                  className={`${colors.bar} h-full rounded-full transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>

              {/* Status */}
              <div className="mb-2">
                {assessment.obtainedMarks == null ? (
                  <span className="text-xs bg-yellow-500/15 text-yellow-500 px-3 py-1 rounded-full">
                    Pending
                  </span>
                ) : (
                  <span className="text-xs bg-primary/15 text-primary px-3 py-1 rounded-full">
                    Completed
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
