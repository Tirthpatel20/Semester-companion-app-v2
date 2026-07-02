"use client";

import { Navigation } from "@/components/navigation";
import { SubjectHeader } from "@/components/subject-header";
import { AttendanceSection } from "@/components/attendance-section";
import { MarksSection } from "@/components/marks-section";
import { AssessmentForm } from "@/components/assessment-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSubject } from "@/services/subjects";
import { Button } from "@/components/ui/button";
import { Pencil, Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { getAttendance, markAttendance } from "@/services/attendance";
import { AttendanceStatus } from "@/types";
import { toast } from "sonner";
import { MarkAttendance } from "@/components/mark-attendance";
import { useEffect, useState } from "react";
import { EditSubjectForm } from "@/components/edit-subject-form";
import { getAssessments } from "@/services/assessments";
import { deleteAssessment } from "@/services/assessments";
import { authClient } from "@/auth-client";

interface Record {
  attendanceDate: string;
  createdAt: string;
  id: number;
  status: string;
  subjectId: number;
}

interface Assessment {
  id: number;
  name: string;
  maxMarks: number;
  obtainedMarks: number | null;
  weightage: number;
  subjectId: number;
  createdAt: string;
  updatedAt: string;
}

//

export default function SubjectAnalytics() {
  const params = useParams();

  const id = Number(params.id);

  const [isEditing, setIsEditing] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState<Assessment | null>(
    null,
  );

  const [isAssessmentFormOpen, setIsAssessmentFormOpen] = useState(false);
  const [assessmentToDelete, setAssessmentToDelete] =
    useState<Assessment | null>(null);

  const { data, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !data) {
      router.replace("/auth/login");
    }
  }, [data, isPending, router]);

  const queryClient = useQueryClient();

  const getSubjectQuery = useQuery({
    queryKey: ["subject", id],
    queryFn: () => getSubject(id),
  });

  const markAttendanceMutation = useMutation({
    mutationFn: (status: AttendanceStatus) => markAttendance(id, status),
    onSuccess: (_, status) => {
      toast.success(`Attendance marked as ${status}.`);

      queryClient.invalidateQueries({
        queryKey: ["attendance", id],
      });
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteAssessmentMutation = useMutation({
    mutationFn: deleteAssessment,

    onSuccess: () => {
      toast.success("Assessment deleted");

      queryClient.invalidateQueries({
        queryKey: ["assessments", id],
      });
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  const getAttendanceQuery = useQuery({
    queryKey: ["attendance", id],
    queryFn: () => getAttendance(id),
  });

  const assessmentsQuery = useQuery({
    queryKey: ["assessments", id],
    queryFn: () => getAssessments(id),
  });

  if (
    getSubjectQuery.isPending ||
    getAttendanceQuery.isPending ||
    assessmentsQuery.isPending
  ) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex justify-end gap-3 mb-6">
            <div className="h-10 w-32 bg-muted rounded-xl animate-pulse" />
            <div className="h-10 w-36 bg-muted rounded-xl animate-pulse" />
          </div>
          <SubjectHeaderSkeleton />
          <div className="mb-8">
            <AttendanceSectionSkeleton />
          </div>
          <MarksSectionSkeleton />
        </main>
      </div>
    );
  }

  if (getSubjectQuery.isError) {
    return <div>{getSubjectQuery.error.message}</div>;
  }
  if (assessmentsQuery.isError) {
    return <div>{assessmentsQuery.error.message}</div>;
  }
  if (getAttendanceQuery.isError) {
    return <div>{getAttendanceQuery.error.message}</div>;
  }

  const { records, stats } = getAttendanceQuery.data;
  const subject = getSubjectQuery.data.subject;
  const assessments = assessmentsQuery.data.assessments;

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 py-6 md:px-6 md:py-12">
        <div className="flex justify-end gap-2 md:gap-3 mb-4 md:mb-6">
          <Button
            variant="outline"
            onClick={() => setIsEditing((prev) => !prev)}
            title="Edit Subject"
            aria-label="Edit Subject"
            className="rounded-xl px-3 py-2 md:px-4 md:py-2.5 text-xs md:text-sm flex items-center gap-1.5 md:gap-2 hover:bg-secondary/80 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          >
            <Pencil className="w-3.5 h-3.5 md:w-4 md:h-4" />
            Edit Subject
          </Button>
          <Button
            variant="default"
            onClick={() => {
              setEditingAssessment(null);
              setIsAssessmentFormOpen(true);
            }}
            title="Add Assessment"
            aria-label="Add Assessment"
            className="rounded-xl px-3 py-2 md:px-4 md:py-2.5 text-xs md:text-sm flex items-center gap-1.5 md:gap-2 transition-all hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          >
            <Plus className="w-3.5 h-3.5 md:w-4 md:h-4" />
            Add Assessment
          </Button>
        </div>

        <SubjectHeader
          name={subject.name}
          credits={subject.credits}
          attendance={stats.attendancePercentage || 0}
        />

        {isEditing && (
          <EditSubjectForm
            subjectId={subject.id}
            defaultValues={{
              name: subject.name,
              credits: subject.credits,
              totalClasses: subject.totalClasses,
            }}
            onClose={() => setIsEditing(false)}
          />
        )}

        <MarkAttendance
          currentStatus={
            records.find((record: Record) => record.attendanceDate === today)
              ?.status
          }
          isPending={markAttendanceMutation.isPending}
          onMarkAttendance={(status) => markAttendanceMutation.mutate(status)}
        />

        {/* Attendance Section */}
        <div className="mb-8">
          <AttendanceSection
            attendance={stats.attendancePercentage}
            presentClasses={stats.present}
            absentClasses={stats.absent}
            totalClasses={subject.totalClasses}
            canSkip={stats.classesCanSkip ?? 0}
            needFor75={stats.classesNeeded ?? 0}
            
            hasRecords={records.length > 0}
          />
        </div>
        {isAssessmentFormOpen && (
          <AssessmentForm
            key={editingAssessment?.id ?? "new"}
            subjectId={id}
            assessment={editingAssessment ?? undefined}
            onClose={() => {
              setIsAssessmentFormOpen(false);
              setEditingAssessment(null);
            }}
          />
        )}

        {/* Marks Section */}
        <MarksSection
          assessments={assessments}
          onEdit={(assessment) => {
            setEditingAssessment(assessment);
            setIsAssessmentFormOpen(true);
          }}
          onDelete={(assessmentId) => {
            const assessment = assessments.find(
              (a: any) => a.id === assessmentId,
            );
            if (assessment) {
              setAssessmentToDelete(assessment);
            }
          }}
          onAddAssessment={() => {
            setEditingAssessment(null);
            setIsAssessmentFormOpen(true);
          }}
        />

        {assessmentToDelete && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/40 backdrop-blur-md"
            onClick={() => setAssessmentToDelete(null)}
          >
            <div
              className="glass-card rounded-2xl p-8 border border-primary/20 w-full max-w-md shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-foreground mb-3">
                Delete Assessment
              </h3>
              <p className="text-muted-foreground text-sm mb-6">
                Are you sure you want to delete the assessment{" "}
                <strong className="text-foreground">
                  "{assessmentToDelete.name}"
                </strong>
                ? This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <Button
                  variant="secondary"
                  onClick={() => setAssessmentToDelete(null)}
                  className="flex-1 rounded-xl py-3 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    deleteAssessmentMutation.mutate(assessmentToDelete.id);
                    setAssessmentToDelete(null);
                  }}
                  className="flex-1 bg-destructive text-white hover:bg-destructive/80 rounded-xl py-3 focus-visible:ring-2 focus-visible:ring-destructive focus-visible:outline-none"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-border/50 pt-8 pb-8 text-center text-muted-foreground text-sm">
          <p>Subject Analytics • {subject.name} • Semester Companion</p>
        </div>
      </main>
    </div>
  );
}

function SubjectHeaderSkeleton() {
  return (
    <div className="glass-card rounded-3xl p-8 border border-border/50 mb-8 animate-pulse">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="flex-1">
          <div className="h-10 bg-muted rounded w-1/3 mb-4" />
          <div className="flex items-center gap-4 flex-wrap">
            <div className="h-6 bg-muted rounded w-24" />
            <div className="h-6 bg-muted rounded w-32" />
          </div>
        </div>
        <div className="h-12 bg-muted rounded-2xl w-32" />
      </div>
    </div>
  );
}

function AttendanceSectionSkeleton() {
  return (
    <div className="glass-card rounded-3xl p-8 border border-border/50 mb-8 animate-pulse">
      <div className="h-8 bg-muted rounded w-48 mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="flex flex-col items-center justify-center">
          <div className="w-48 h-48 rounded-full border-4 border-muted flex items-center justify-center" />
          <div className="h-4 bg-muted rounded w-24 mt-6" />
        </div>
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="h-20 bg-muted rounded-2xl" />
            <div className="h-20 bg-muted rounded-2xl" />
            <div className="h-20 bg-muted rounded-2xl" />
          </div>
          <div className="space-y-4 pt-4 border-t border-border/50">
            <div className="h-8 bg-muted rounded-xl" />
            <div className="h-8 bg-muted rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

function MarksSectionSkeleton() {
  return (
    <div className="glass-card rounded-3xl p-8 border border-border/50 animate-pulse">
      <div className="h-8 bg-muted rounded w-48 mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="bg-muted/10 border border-muted rounded-2xl p-6 h-56 flex flex-col justify-between"
          >
            <div>
              <div className="h-5 bg-muted rounded w-3/4 mb-2" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
            <div className="space-y-2">
              <div className="h-8 bg-muted rounded w-1/3" />
              <div className="h-2 bg-muted rounded w-full" />
            </div>
            <div className="flex gap-2">
              <div className="h-8 bg-muted rounded-lg flex-1" />
              <div className="h-8 bg-muted rounded-lg flex-1" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
