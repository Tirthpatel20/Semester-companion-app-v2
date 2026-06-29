"use client";

import { Navigation } from "@/components/navigation";
import { SubjectHeader } from "@/components/subject-header";
import { AttendanceSection } from "@/components/attendance-section";
import { MarksSection } from "@/components/marks-section";
import { GradePlanner } from "@/components/grade-planner";
import { MarksEntryForm } from "@/components/marks-entry-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSubject } from "@/services/subjects";
import { useParams } from "next/navigation";
import { getAttendance, markAttendance } from "@/services/attendance";
import { AttendanceStatus } from "@/types";
import { toast } from "sonner";
import { MarkAttendance } from "@/components/mark-attendance";

interface Record {
  attendanceDate: string;
  createdAt: string;
  id: number;
  status: string;
  subjectId: number;
}

export default function SubjectAnalytics() {
  const params = useParams();

  const id = Number(params.id);

  const queryClient = useQueryClient();

  const getSubjectQuery = useQuery({
    queryKey: ["subject", id],
    queryFn: () => getSubject(id),
  });

  const markAttendanceMutation = useMutation({
    mutationFn: (status: AttendanceStatus) => markAttendance(id, status),
    onSuccess: () => {
      toast.success("Attendance updated");

      queryClient.invalidateQueries({
        queryKey: ["attendance", id],
      });
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });

  if (getSubjectQuery.isError) {
    return <div>{getSubjectQuery.error.message}</div>;
  }

  const getAttendanceQuery = useQuery({
    queryKey: ["attendance", id],
    queryFn: () => getAttendance(id),
  });

  if (getSubjectQuery.isPending || getAttendanceQuery.isPending) {
    return <div>Loading...</div>;
  }

  if (getAttendanceQuery.isError) {
    return <div>{getAttendanceQuery.error.message}</div>;
  }

  const subject = getSubjectQuery.data.subject;
  const status: "excellent" | "good" | "poor" | "excellent" = "excellent";

  const { records, stats } = getAttendanceQuery.data;

  const trend = "up";

  const assessments = [
    { name: "Quiz 1", obtained: 18, maximum: 20 },
    { name: "Quiz 2", obtained: 19, maximum: 20 },
    { name: "Midsem", obtained: 38, maximum: 40 },
    { name: "Assignment", obtained: 9, maximum: 10 },
    { name: "Endsem", obtained: 0, maximum: 50 },
  ];

  const calculateTotalObtained = () =>
    assessments.reduce((sum, a) => sum + a.obtained, 0);
  const calculateTotalMarks = () =>
    assessments.reduce((sum, a) => sum + a.maximum, 0);

  const obtainedMarks = calculateTotalObtained();
  const totalMarks = calculateTotalMarks();
  const remainingMarks = assessments
    .filter((a) => a.obtained === 0)
    .reduce((sum, a) => sum + a.maximum, 0);

  const today = new Date().toISOString().split("T")[0];
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Subject Header */}
        <SubjectHeader
          name={subject.name}
          credits={subject.credits}
          attendance={ subject.attendance || 0 }
          status={status}
        />

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
            trend="stable"
          />
        </div>

        {/* Marks Entry Form */}
        <div className="mb-8">
          <MarksEntryForm />
        </div>

        {/* Marks Section */}
        <div className="mb-8">
          <MarksSection assessments={assessments} />
        </div>

        {/* Grade Planner */}
        <div className="mb-16">
          <GradePlanner
            obtainedMarks={obtainedMarks}
            totalMarks={totalMarks}
            remainingMarks={remainingMarks}
          />
        </div>

        {/* Footer */}
        <div className="border-t border-border/50 pt-8 pb-8 text-center text-muted-foreground text-sm">
          <p>Subject Analytics • {subject.name} • Semester Companion</p>
        </div>
      </main>
    </div>
  );
}
