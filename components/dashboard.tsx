"use client";

import Link from "next/link";
import { useState } from "react";


import { Navigation } from "@/components/navigation";
import { StatCard } from "@/components/stat-card";
import { SubjectCard } from "@/components/subject-card";
import { AddSubjectForm } from "@/components/add-subject-form";
import { EditSubjectForm } from "@/components/edit-subject-form";
import { Button } from "@/components/ui/button";

import { BookOpen, AlertCircle, Zap, Trash2 } from "lucide-react";


import { deleteSubject } from "@/services/subjects";

import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { getDashboard } from "@/services/dashboard";

interface Subject {
  createdAt: string;
  credits: number;
  id: number;
  name: string;
  totalClasses: number;
  userId: string;
}

export default function Dashboard() {
  
  
  const queryClient = useQueryClient();

  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<any | null>(null);
  const [subjectToDelete, setSubjectToDelete] = useState<any | null>(null);

  const dashboardQuery = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
  });

  const deleteSubjectMutation = useMutation({
    mutationFn: deleteSubject,

    onSuccess: () => {
      toast.success("Subject deleted successfully.");

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

 
  if ( dashboardQuery.isPending) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />

        <main className="max-w-7xl mx-auto px-6 py-12">
          {/* Skeleton Add Subject Button */}
          <section className="mb-12">
            <div className="glass-card rounded-xl p-6 border border-border animate-pulse h-20 w-full flex items-center justify-center" />
          </section>

          {/* Skeleton Performance Overview */}
          <section className="mt-12">
            <div className="h-6 bg-muted rounded w-48 mb-6 animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <StatCardSkeleton key={i} />
              ))}
            </div>
          </section>

          {/* Skeleton Your Subjects */}
          <section className="mt-14">
            <div className="h-6 bg-muted rounded w-36 mb-6 animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {Array.from({ length: 6 }).map((_, i) => (
                <SubjectCardSkeleton key={i} />
              ))}
            </div>
          </section>
        </main>
      </div>
    );
  }

  if (dashboardQuery.isError) {
    return (
      <div className="glass-card p-8 text-center">
        <h2 className="text-red-500 font-semibold">Failed to load subjects</h2>

        <button onClick={() => dashboardQuery.refetch()} className="mt-4">
          Try Again
        </button>
      </div>
    );
  }

  function StatCardSkeleton() {
    return (
      <div className="glass-card rounded-2xl p-6 border border-border/20 animate-pulse flex flex-col justify-between h-[108px]">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="h-4 bg-muted rounded w-24 mb-3" />
            <div className="h-8 bg-muted rounded w-16" />
          </div>
          <div className="w-10 h-10 bg-muted rounded-lg" />
        </div>
      </div>
    );
  }

  function SubjectCardSkeleton() {
    return (
      <div className="glass-card rounded-2xl p-6 border border-border/20 animate-pulse flex flex-col h-[320px]">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="h-5 bg-muted rounded w-32 mb-2" />
            <div className="h-3 bg-muted rounded w-16" />
          </div>
          <div className="w-4 h-4 bg-muted rounded" />
        </div>
        <div className="flex justify-center mb-8">
          <div className="w-32 h-32 rounded-full border-4 border-muted flex items-center justify-center" />
        </div>
        <div className="space-y-3 mt-auto">
          <div className="flex justify-between items-center">
            <div className="h-4 bg-muted rounded w-28" />
            <div className="h-6 bg-muted rounded-full w-12" />
          </div>
          <div className="flex justify-between items-center">
            <div className="h-4 bg-muted rounded w-28" />
            <div className="h-6 bg-muted rounded-full w-12" />
          </div>
        </div>
      </div>
    );
  }

  const { stats, subjects } = dashboardQuery.data;

  const statsData = [
    {
      label: "Overall Attendance",
      value: stats.overallAttendance,
      unit: "%",
      variant: stats.overallAttendance >= 75 ? "success" : "warning",
      icon: <BookOpen className="w-5 h-5 text-primary" />,
    },
    {
      label: "Total Subjects",
      value: stats.totalSubjects,
      variant: "default",
      icon: <BookOpen className="w-5 h-5 text-primary" />,
    },
    {
      label: "Below 75%",
      value: stats.below75,
      variant: stats.below75 > 0 ? "warning" : "success",
      icon: <AlertCircle className="w-5 h-5 text-destructive" />,
    },
  ];

  function onDelete(subjectId: number) {
    deleteSubjectMutation.mutate(subjectId);
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 py-6 md:px-6 md:py-12">
        <section className="mb-8 md:mb-12">
          {editingSubject ? (
            <EditSubjectForm
              subjectId={editingSubject.id}
              defaultValues={{
                name: editingSubject.name,
                credits: editingSubject.credits,
                totalClasses: editingSubject.totalClasses,
              }}
              onClose={() => setEditingSubject(null)}
            />
          ) : (
            <AddSubjectForm
              isOpen={isAddFormOpen}
              setIsOpen={setIsAddFormOpen}
            />
          )}
        </section>

        <section className="mt-8 md:mt-12">
          <h2 className="text-lg md:text-xl font-semibold text-foreground mb-4 md:mb-6">
            Performance Overview
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {statsData.map((stat, idx) => (
              <StatCard key={idx} {...stat} />
            ))}
          </div>
        </section>

        <section className="mt-10 md:mt-14">
          <h2 className="text-lg md:text-xl font-semibold text-foreground mb-4 md:mb-6">
            Your Subjects
          </h2>

          {subjects.length === 0 ? (
            <div className="glass-card rounded-3xl p-12 text-center border border-primary/20 flex flex-col items-center justify-center max-w-xl mx-auto">
              <div className="p-4 bg-primary/10 rounded-full mb-4 text-primary">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                No subjects yet
              </h3>
              <p className="text-muted-foreground text-sm mb-6 max-w-sm">
                Create your first subject to start tracking attendance and
                marks.
              </p>
              <button
                onClick={() => {
                  setIsAddFormOpen(true);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-xl hover:shadow-lg hover:scale-105 active:scale-95 transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none flex items-center gap-2"
                title="Add Subject"
                aria-label="Create your first subject"
              >
                Add Subject
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {subjects.map((subject: any) => (
                <Link
                  key={subject.id}
                  href={`/subject/${subject.id}`}
                  className="block hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded-2xl"
                >
                  <SubjectCard
                    name={subject.name}
                    credits={subject.credits}
                    attendance={subject.stats.attendancePercentage}
                    canSkip={subject.stats.classesCanSkip ?? 0}
                    needFor75={subject.stats.classesNeeded ?? 0}
                    trend="stable"
                    onEdit={() => {
                      setEditingSubject(subject);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    onDelete={() => {
                      setSubjectToDelete(subject);
                    }}
                  />
                </Link>
              ))}
            </div>
          )}
        </section>

        {subjectToDelete && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/40 backdrop-blur-md"
            onClick={() => setSubjectToDelete(null)}
          >
            <div
              className="glass-card rounded-2xl p-8 border border-primary/20 w-full max-w-md shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-foreground mb-3">
                Delete Subject
              </h3>
              <p className="text-muted-foreground text-sm mb-6">
                Are you sure you want to delete the subject{" "}
                <strong className="text-foreground">
                  "{subjectToDelete.name}"
                </strong>
                ? This will permanently delete all attendance and assessment
                data.
              </p>
              <div className="flex gap-4">
                <Button
                  variant="secondary"
                  onClick={() => setSubjectToDelete(null)}
                  className="flex-1 rounded-xl py-3 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    onDelete(subjectToDelete.id);
                    setSubjectToDelete(null);
                  }}
                  className="flex-1 bg-destructive text-white hover:bg-destructive/80 rounded-xl py-3 focus-visible:ring-2 focus-visible:ring-destructive focus-visible:outline-none"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-16 pb-8 border-t border-border/50 pt-8 text-center text-muted-foreground text-sm">
          <p>Semester Companion • Academic Performance Dashboard</p>
        </div>
      </main>
    </div>
  );
}
