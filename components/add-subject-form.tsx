"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, X, Calendar, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateSubjectFormValues,
  createSubjectSchema,
  type CreateSubjectInput,
} from "@/lib/validations/create-subject";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSubject } from "@/services/subjects";
import { toast } from "sonner";

interface AddSubjectFormProps {
  onClose?: () => void;
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
}

export function AddSubjectForm({
  onClose,
  isOpen: controlledIsOpen,
  setIsOpen: controlledSetIsOpen,
}: AddSubjectFormProps) {
  const [localIsOpen, setLocalIsOpen] = useState(false);
  const isOpen =
    controlledIsOpen !== undefined ? controlledIsOpen : localIsOpen;
  const setIsOpen =
    controlledSetIsOpen !== undefined ? controlledSetIsOpen : setLocalIsOpen;

  const queryClient = useQueryClient();

  const createSubjectMutation = useMutation({
    mutationFn: createSubject,

    onSuccess: () => {
      toast.success("Subject added successfully.");

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });

      form.reset();

      setIsOpen(false);
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  const form = useForm<CreateSubjectFormValues>({
    resolver: zodResolver(createSubjectSchema) as any,
    defaultValues: {
      name: "",
      credits: undefined,
      setupMethod: "automatic",
      totalClasses: undefined,
      semesterStartDate: "",
      semesterEndDate: "",
      presentClasses: undefined,
      conductedClasses: undefined,
    },
  });

  const onSubmit = (data: CreateSubjectFormValues) => {
    try {
      const parsed = createSubjectSchema.parse(data);
      createSubjectMutation.mutate(parsed);
    } catch (e: any) {
      toast.error("Form validation failed. Please check your inputs.");
    }
  };

  const watchSetupMethod = form.watch("setupMethod");
  const watchCredits = form.watch("credits");
  const watchStartDate = form.watch("semesterStartDate");
  const watchEndDate = form.watch("semesterEndDate");

  // Determine if we should show the attendance import section
  let showAttendanceImport = false;
  if (watchSetupMethod === "manual") {
    showAttendanceImport = true;
  } else if (watchSetupMethod === "automatic" && watchStartDate) {
    const start = new Date(watchStartDate);
    if (!isNaN(start.getTime())) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      start.setHours(0, 0, 0, 0);
      if (today >= start) {
        showAttendanceImport = true;
      }
    }
  }

  // Clear attendance fields if the import section becomes hidden
  useEffect(() => {
    if (!showAttendanceImport) {
      form.setValue("presentClasses", undefined);
      form.setValue("conductedClasses", undefined);
    }
  }, [showAttendanceImport, form]);

  // Calculate live estimation
  let estimatedClasses = 0;
  let weeksCount = 0;
  if (
    watchSetupMethod === "automatic" &&
    typeof watchCredits === "number" &&
    watchStartDate &&
    watchEndDate
  ) {
    const start = new Date(watchStartDate);
    const end = new Date(watchEndDate);
    if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end > start) {
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      weeksCount = Number((diffDays / 7).toFixed(1));
      estimatedClasses = Math.round(watchCredits * (diffDays / 7));
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="glass-card rounded-xl p-6 border border-primary/20 w-full hover:scale-105 smooth-hover transition-all duration-300 flex items-center justify-center gap-3 text-foreground font-medium focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
        title="Add New Subject"
        aria-label="Add New Subject"
      >
        <Plus className="w-5 h-5 text-primary" />
        Add New Subject
      </button>
    );
  }

  const handleClose = () => {
    form.reset();
    setIsOpen(false);
    onClose?.();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/40 backdrop-blur-md overflow-hidden"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div className="glass-card rounded-2xl p-8 border border-primary/20 w-full max-w-lg max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl relative my-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">
            Add New Subject
          </h2>
          <button
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-lg p-1"
            title="Close form"
            aria-label="Close add subject form"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
          noValidate
        >
          {/* Subject Name */}
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
            <p className="text-red-500 text-sm mt-1">
              {form.formState.errors.name?.message}
            </p>
          </div>

          {/* Credits */}
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
            <p className="text-red-500 text-sm mt-1">
              {form.formState.errors.credits?.message}
            </p>
          </div>

          {/* Setup Method Selector */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Planned Classes Setup
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => form.setValue("setupMethod", "automatic")}
                className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary ${
                  watchSetupMethod === "automatic"
                    ? "bg-primary text-primary-foreground border-primary shadow-md hover:bg-primary/95 scale-[1.02]"
                    : "bg-input border-border text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                }`}
              >
                Estimate Automatically
              </button>
              <button
                type="button"
                onClick={() => form.setValue("setupMethod", "manual")}
                className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary ${
                  watchSetupMethod === "manual"
                    ? "bg-primary text-primary-foreground border-primary shadow-md hover:bg-primary/95 scale-[1.02]"
                    : "bg-input border-border text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                }`}
              >
                Enter Manually
              </button>
            </div>
            <p className="text-red-500 text-sm mt-1">
              {form.formState.errors.setupMethod?.message}
            </p>
          </div>

          {/* Conditional Layout based on Setup Method */}
          {watchSetupMethod === "automatic" ? (
            <div className="space-y-6 transition-all duration-300">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Semester Start Date
                  </label>
                  <input
                    type="date"
                    {...form.register("semesterStartDate")}
                    className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none transition-all"
                  />
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.semesterStartDate?.message}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Semester End Date
                  </label>
                  <input
                    type="date"
                    {...form.register("semesterEndDate")}
                    className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none transition-all"
                  />
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.semesterEndDate?.message}
                  </p>
                </div>
              </div>

              {/* Dynamic preview banner */}
              {estimatedClasses > 0 && (
                <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 text-sm text-foreground flex items-start gap-3 transition-all duration-300">
                  <Calendar className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-primary">
                      Estimation Preview
                    </span>
                    <p className="text-muted-foreground">
                      Based on a semester length of{" "}
                      <span className="text-foreground font-semibold">
                        {weeksCount} weeks
                      </span>{" "}
                      and{" "}
                      <span className="text-foreground font-semibold">
                        {watchCredits} credits
                      </span>
                      , we estimate{" "}
                      <span className="text-primary font-bold">
                        {estimatedClasses}
                      </span>{" "}
                      total planned classes.
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="transition-all duration-300">
              <label className="block text-sm font-medium text-foreground mb-2">
                Total Classes
              </label>
              <input
                type="number"
                step="any"
                {...form.register("totalClasses", {
                  valueAsNumber: true,
                })}
                placeholder="e.g., 60"
                className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none transition-all"
              />
              <p className="text-red-500 text-sm mt-1">
                {form.formState.errors.totalClasses?.message}
              </p>
            </div>
          )}

          {/* Optional Attendance Import Section */}
          {showAttendanceImport && (
            <div className="border-t border-border/50 pt-6 space-y-4 transition-all duration-300">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Import Current Attendance (Optional)
                </h3>
                <p className="text-xs text-muted-foreground">
                  Initialize this subject with your current class counts if the semester has already started.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Conducted Classes
                  </label>
                  <input
                    type="number"
                    step="any"
                    {...form.register("conductedClasses", {
                      valueAsNumber: true,
                    })}
                    placeholder="e.g., 12"
                    className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none transition-all"
                  />
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.conductedClasses?.message}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Present Classes
                  </label>
                  <input
                    type="number"
                    step="any"
                    {...form.register("presentClasses", {
                      valueAsNumber: true,
                    })}
                    placeholder="e.g., 10"
                    className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none transition-all"
                  />
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.presentClasses?.message}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex gap-4 pt-4 border-t border-border/30">
            <button
              type="submit"
              disabled={createSubjectMutation.isPending}
              className="flex-1 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium transition-all hover:shadow-lg hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
              aria-label={
                createSubjectMutation.isPending ? "Adding..." : "Add Subject"
              }
            >
              {createSubjectMutation.isPending ? "Adding..." : "Add Subject"}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-medium transition-all hover:shadow-lg focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
              aria-label="Cancel adding subject"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
