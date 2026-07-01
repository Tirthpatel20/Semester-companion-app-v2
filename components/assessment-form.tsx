"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createAssessmentSchema,
  CreateAssessmentInput,
  CreateAssessmentFormValues,
} from "@/lib/validations/create-assessment";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAssessment, updateAssessment } from "@/services/assessments";
import { toast } from "sonner";

interface Assessment {
  id: number;
  name: string;
  maxMarks: number;
  obtainedMarks: number | null;
  weightage: number;
}
interface AssessmentFormProps {
  subjectId: number;

  assessment?: Assessment;

  onClose: () => void;
}

export function AssessmentForm({
  subjectId,
  assessment,
  onClose,
}: AssessmentFormProps) {
  const queryClient = useQueryClient();

  const form = useForm<CreateAssessmentFormValues>({
    resolver: zodResolver(createAssessmentSchema),

    defaultValues: {
      name: assessment?.name ?? "",
      maxMarks: assessment?.maxMarks ?? undefined,
      obtainedMarks: assessment?.obtainedMarks ?? undefined,
      weightage: assessment?.weightage ?? undefined,
    },
  });

  const obtainedMarks = form.watch("obtainedMarks");

  const maxMarks = form.watch("maxMarks");

  const assessmentMutation = useMutation({
    mutationFn: (data: CreateAssessmentInput) => {
      if (assessment) {
        return updateAssessment(assessment.id, data);
      }

      return createAssessment(subjectId, data);
    },

    onSuccess: () => {
      toast.success(
        assessment
          ? "Assessment updated successfully."
          : "Assessment added successfully.",
      );

      queryClient.invalidateQueries({
        queryKey: ["assessments", subjectId],
      });

      form.reset();

      onClose();
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data: CreateAssessmentInput) => {
    assessmentMutation.mutate(data);
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  
  const weightage = form.watch("weightage");
  console.log(weightage)
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/40 backdrop-blur-md overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div className="glass-card rounded-2xl p-8 border border-primary/20 w-full max-w-lg shadow-2xl relative">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">
            {assessment ? "Edit Assessment" : "Add Assessment"}
          </h2>
          <button
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-lg p-1"
            title="Close form"
            aria-label="Close form"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
          <>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Assessment Name
                </label>

                <input
                  type="text"
                  {...form.register("name")}
                  placeholder="e.g. Quiz 1"
                  className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                />

                <p className="text-red-500 text-sm">
                  {form.formState.errors.name?.message}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Obtained Marks
                </label>
                <input
                  type="number"
                  step="any"
                  {...form.register("obtainedMarks", {
                    valueAsNumber: true,
                  })}
                  placeholder="e.g. 18"
                  
                  className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                />

                <p className="text-red-500 text-sm">
                  {form.formState.errors.obtainedMarks?.message}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Maximum Marks
                </label>
                <input
                  type="number"
                  step="any"
                  {...form.register("maxMarks", {
                    valueAsNumber: true,
                  })}
                  placeholder="e.g., 20"
                  className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none transition-all"
                />
                <p className="text-red-500 text-sm">
                  {form.formState.errors.maxMarks?.message}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Weightage (%)
                </label>

                <input
                  type="number"
                  {...form.register("weightage", {
                    valueAsNumber: true,
                  })}
                  placeholder="e.g. 20"
                  step="any"
                  className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                />

                <p className="text-red-500 text-sm">
                  
                  {form.formState.errors.weightage?.message}
                </p>
              </div>
            </div>

            {/* Percentage Display */}
            {obtainedMarks != null && maxMarks > 0 && (
              <div className="bg-secondary/30 rounded-lg p-4 border border-primary/20">
                <p className="text-sm text-muted-foreground mb-1">Percentage</p>
                <p className="text-3xl font-bold text-primary">
                  {((obtainedMarks / maxMarks) * 100).toFixed(1)}%
                </p>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={assessmentMutation.isPending}
                className="flex-1 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium transition-all hover:shadow-lg hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                aria-label={
                  assessmentMutation.isPending
                    ? "Saving..."
                    : assessment
                      ? "Update Assessment"
                      : "Add Assessment"
                }
              >
                {assessmentMutation.isPending
                  ? "Saving..."
                  : assessment
                    ? "Update Assessment"
                    : "Add Assessment"}
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-medium transition-all hover:shadow-lg focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                aria-label="Cancel editing"
              >
                Cancel
              </button>
            </div>
          </>
        </form>
      </div>
    </div>
  );
}
