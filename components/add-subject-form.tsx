"use client";

import { useCallback, useState } from "react";
import { Plus, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createSubjectSchema,
  type CreateSubjectInput,
} from "@/lib/validations/create-subject";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSubject } from "@/services/subjects";
import { toast } from "sonner";

interface AddSubjectFormProps {
  onClose?: () => void;
}

export function AddSubjectForm({ onClose }: AddSubjectFormProps) {
  const [isOpen, setIsOpen] = useState(false);

  const queryClient = useQueryClient();

  const createSubjectMutation = useMutation({
    mutationFn: createSubject,

    onSuccess: () => {
      toast.success("Subject created");

      queryClient.invalidateQueries({
        queryKey: ["subjects"],
      });

      form.reset();

      setIsOpen(false);
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data: CreateSubjectInput) => {
    createSubjectMutation.mutate(data);
  };

  const form = useForm<CreateSubjectInput>({
    resolver: zodResolver(createSubjectSchema),
    defaultValues: {
      name: "",
      credits: 0,
      totalClasses: 0,
    },
  });

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="glass-card rounded-xl p-6 border border-primary/20 w-full hover:scale-105 smooth-hover transition-all duration-300 flex items-center justify-center gap-3 text-foreground font-medium"
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
    <div className="glass-card rounded-2xl p-8 border border-primary/20 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">Add New Subject</h2>
        <button
          onClick={handleClose}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Subject Name
          </label>
          <input
            type="text"
            {...form.register("name")}
            placeholder="e.g., Data Structures"
            required
            className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
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
              {...form.register("credits", {
                valueAsNumber: true,
              })}
              placeholder="e.g., 4"
              min="1"
              max="6"
              required
              className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
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
              min="1"
              required
              className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />

            <p className="text-red-500 text-sm">
              {form.formState.errors.totalClasses?.message}
            </p>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={createSubjectMutation.isPending}
            className="flex-1 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium transition-all hover:shadow-lg hover:scale-105 active:scale-95"
          >
            {createSubjectMutation.isPending ? "Adding..." : "Add Subject"}
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-medium transition-all hover:shadow-lg"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
