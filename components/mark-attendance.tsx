"use client";

import { CheckCircle2, XCircle, CalendarDays } from "lucide-react";

interface MarkAttendanceProps {
  currentStatus?: "Present" | "Absent";
  isPending: boolean;
  onMarkAttendance: (status: "Present" | "Absent") => void;
}

export function MarkAttendance({
  currentStatus,
  isPending,
  onMarkAttendance,
}: MarkAttendanceProps) {
  return (
    <div className="glass-card rounded-3xl p-8 border border-primary/20 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <CalendarDays className="w-6 h-6 text-primary" />
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Mark Today's Attendance
          </h2>

          <p className="text-muted-foreground text-sm">
            You can update today's attendance anytime.
          </p>
        </div>
      </div>

      {currentStatus && (
        <div className="mb-6 rounded-xl bg-secondary/30 border border-border px-4 py-3">
          <span className="text-sm text-muted-foreground">
            Today's status:
          </span>

          <span
            className={`ml-2 font-semibold ${
              currentStatus === "Present"
                ? "text-primary"
                : "text-destructive"
            }`}
          >
            {currentStatus}
          </span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <button
          disabled={isPending}
          onClick={() => onMarkAttendance("Present")}
          className="flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground py-4 font-semibold transition-all hover:scale-[1.02] disabled:opacity-50"
        >
          <CheckCircle2 className="w-5 h-5" />
          Present
        </button>

        <button
          disabled={isPending}
          onClick={() => onMarkAttendance("Absent")}
          className="flex items-center justify-center gap-2 rounded-xl bg-destructive text-white py-4 font-semibold transition-all hover:scale-[1.02] disabled:opacity-50"
        >
          <XCircle className="w-5 h-5" />
          Absent
        </button>
      </div>
    </div>
  );
}