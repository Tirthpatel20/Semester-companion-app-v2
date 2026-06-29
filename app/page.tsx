"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { Navigation } from "@/components/navigation";
import { StatCard } from "@/components/stat-card";
import { SubjectCard } from "@/components/subject-card";
import { AddSubjectForm } from "@/components/add-subject-form";

import { BookOpen, AlertCircle, Zap, Trash2 } from "lucide-react";

import { authClient } from "@/auth-client";
import { signOut } from "@/services/auth";
import { deleteSubject, getSubjects } from "@/services/subjects";

import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

interface Subject {
  createdAt: string;
  credits: number;
  id: number;
  name: string;
  totalClasses: number;
  userId: string;
}

export default function Dashboard() {
  const { data, isPending } = authClient.useSession();
  const router = useRouter();
  const queryClient = useQueryClient();

  const getSubjectsQuery = useQuery({
    queryKey: ["subjects"],
    queryFn: getSubjects,
  });

  const subjects = getSubjectsQuery.data?.subjects ?? [];

  const signOutMutation = useMutation({
    mutationFn: signOut,

    onSuccess: () => {
      toast.success("Logged out successfully");
      router.replace("/auth/login");
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteSubjectMutation = useMutation({
    mutationFn: deleteSubject,

    onSuccess: () => {
      toast.success("Subject deleted");

      queryClient.invalidateQueries({
        queryKey: ["subjects"],
      });
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    if (!isPending && !data) {
      router.replace("/auth/login");
    }
  }, [data, isPending, router]);

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return null;
  }

  if (getSubjectsQuery.isPending) {
    return (
      <div className="grid grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <SubjectCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (getSubjectsQuery.isError) {
    return (
      <div className="glass-card p-8 text-center">
        <h2 className="text-red-500 font-semibold">Failed to load subjects</h2>

        <button onClick={() => getSubjectsQuery.refetch()} className="mt-4">
          Try Again
        </button>
      </div>
    );
  }

  function SubjectCardSkeleton() {
    return (
      <div className="glass-card rounded-2xl p-6 animate-pulse">
        <div className="h-6 w-1/2 bg-secondary rounded mb-4" />
        <div className="h-4 w-full bg-secondary rounded mb-2" />
        <div className="h-4 w-3/4 bg-secondary rounded mb-2" />
        <div className="h-4 w-1/2 bg-secondary rounded" />
      </div>
    );
  }

  const stats = [
    {
      label: "Overall Attendance",
      value: 92,
      unit: "%",
      variant: "success" as const,
      icon: <BookOpen className="w-5 h-5 text-primary" />,
    },
    {
      label: "Total Subjects",
      value: subjects.length,
      variant: "default" as const,
      icon: <BookOpen className="w-5 h-5 text-primary" />,
    },
    {
      label: "Below 75%",
      value: 1,
      variant: "warning" as const,
      icon: <AlertCircle className="w-5 h-5 text-destructive" />,
    },
    {
      label: "Grade Health",
      value: "Excellent",
      variant: "success" as const,
      icon: <Zap className="w-5 h-5 text-primary" />,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-6 py-12">
        <section className="mb-12">
          <AddSubjectForm />
        </section>

        <section className="mt-12">
          <h2 className="text-xl font-semibold text-foreground mb-6">
            Performance Overview
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <StatCard key={idx} {...stat} />
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-xl font-semibold text-foreground mb-6">
            Your Subjects
          </h2>

          {subjects.length === 0 ? (
            <div className="glass-card rounded-2xl p-10 text-center">
              <h3 className="text-xl font-semibold mb-2">No Subjects Yet</h3>

              <p className="text-muted-foreground">
                Add your first subject to start tracking attendance.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjects.map((subject: Subject) => (
                <Link
                  key={subject.id}
                  href={`/subject/${subject.id}`}
                  className="block hover:no-underline"
                >
                  <SubjectCard
                    {...subject}
                    attendance={0}
                    canSkip={0}
                    needFor75={0}
                    trend="stable"
                  />
                  <Trash2
                    className="text-destructive"
                    onClick={(e) => {
                      e.preventDefault();
                      deleteSubjectMutation.mutate(subject.id);
                    }}
                  />
                </Link>
              ))}
            </div>
          )}
        </section>

        <div className="mt-16 pb-8 border-t border-border/50 pt-8 text-center text-muted-foreground text-sm">
          <p>Semester Companion • Academic Performance Dashboard</p>
        </div>
      </main>
    </div>
  );
}
