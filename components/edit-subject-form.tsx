"use client";

import { useCallback, useState } from "react";
import { Plus, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateSubjectFormValues,
  createSubjectSchema,
  type CreateSubjectInput,
} from "@/lib/validations/create-subject";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSubject } from "@/services/subjects";
import { toast } from "sonner";

interface EditSubjectFormProps {
  subjectId: number;

  defaultValues: CreateSubjectInput;

  onClose?: () => void;
}

export function EditSubjectForm({
  subjectId,
  defaultValues,
  onClose,
}: EditSubjectFormProps) {
  

  const queryClient = useQueryClient();

  const updateSubjectMutation = useMutation({
    mutationFn: (data: CreateSubjectInput) => updateSubject(subjectId, data),

    onSuccess: () => {
      toast.success("Subject updated successfully.");

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });

      queryClient.invalidateQueries({
        queryKey: ["subjects"],
      });

      queryClient.invalidateQueries({
        queryKey: ["subject", subjectId],
      });

      handleClose();
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data: CreateSubjectInput) => {
    updateSubjectMutation.mutate(data);
  };

  const form = useForm<CreateSubjectFormValues>({
    resolver: zodResolver(createSubjectSchema),
    defaultValues: defaultValues,
  });

  const handleClose = () => {
    form.reset();
    onClose?.();
  };

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
          <h2 className="text-2xl font-bold text-foreground">Edit Subject</h2>
          <button
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-lg p-1"
            title="Close form"
            aria-label="Close edit subject form"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Subject Name
            </label>
            <input
              type="text"
              {...form.register("name")}
              placeholder="e.g., Data Structures"
              
              className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none transition-all"
            />
            <p className="text-red-500 text-sm">
              {form.formState.errors.name?.message}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Credits
              </label>
              <input
                type="number"
                step="any"
                {...form.register("credits", {
                  valueAsNumber: true,
                })}
                placeholder="e.g., 4"
                className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none transition-all"
              />
              <p className="text-red-500 text-sm">
                {form.formState.errors.credits?.message}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Total Classes
              </label>
              <input
                type="number"

                {...form.register("totalClasses", {
                  valueAsNumber: true,
                })}
                placeholder="e.g., 60"
                step="any"
                className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none transition-all"
              />

              <p className="text-red-500 text-sm">
                {form.formState.errors.totalClasses?.message}
              </p>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={updateSubjectMutation.isPending}
              className="flex-1 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium transition-all hover:shadow-lg hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
              aria-label={updateSubjectMutation.isPending ? "Updating..." : "Update Subject"}
            >
              {updateSubjectMutation.isPending ? "Updating..." : "Update Subject"}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-medium transition-all hover:shadow-lg focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
              aria-label="Cancel editing subject"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
