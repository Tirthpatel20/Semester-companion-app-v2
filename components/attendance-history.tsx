"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export type AttendanceStatus = "present" | "absent" | "cancelled";

export interface AttendanceRecord {
  id: string;
  date: Date;
  status: AttendanceStatus;
}

interface AttendanceHistoryProps {
  records: AttendanceRecord[];
  selectedRecord?: AttendanceRecord | null;
  isLoading?: boolean;
  onRecordChange?: (
    record: AttendanceRecord,
    newStatus: AttendanceStatus,
  ) => void;
  minDate?: Date;
  maxDate?: Date;
}

export function AttendanceHistory({
  records,
  selectedRecord = null,
  isLoading = false,
  onRecordChange,
  minDate: propMinDate,
  maxDate: propMaxDate,
}: AttendanceHistoryProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(
    null,
  );

  const recordDates = records.map((r) => new Date(r.date));
  const defaultMin = new Date();
  defaultMin.setMonth(defaultMin.getMonth() - 6);
  const defaultMax = new Date();
  defaultMax.setMonth(defaultMax.getMonth() + 6);

  const minDate = propMinDate ?? (recordDates.length > 0
    ? new Date(Math.min(...recordDates.map((d) => d.getTime()), defaultMin.getTime()))
    : defaultMin);
  const maxDate = propMaxDate ?? (recordDates.length > 0
    ? new Date(Math.max(...recordDates.map((d) => d.getTime()), defaultMax.getTime()))
    : defaultMax);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());
  const endDate = new Date(lastDay);
  endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));

  const calendarDays: (Date | null)[] = [];
  const current = new Date(startDate);
  while (current <= endDate) {
    calendarDays.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  
  const getRecordForDate = (date: Date): AttendanceRecord | undefined => {
    return records.find(
      (r) => new Date(r.date).toDateString() === date.toDateString(),
    );
  };

  
  const getStatusColor = (status: AttendanceStatus): string => {
    switch (status) {
      case "present":
        return "bg-primary/90 hover:bg-primary border-primary text-foreground";
      case "absent":
        return "bg-destructive/90 hover:bg-destructive border-destructive text-foreground";
      case "cancelled":
        return "bg-amber-500/20 text-amber-600 hover:bg-amber-500/35 border-amber-500/30 dark:text-amber-400";
      default:
        return "";
    }
  };

  const getStatusLabel = (status: AttendanceStatus): string => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  
  const canGoPrevious = !minDate || new Date(year, month, 1) > minDate;
  const canGoNext = !maxDate || new Date(year, month + 1, 1) < maxDate;

  const goToPreviousMonth = () => {
    if (canGoPrevious) {
      setCurrentDate(new Date(year, month - 1));
    }
  };

  const goToNextMonth = () => {
    if (canGoNext) {
      setCurrentDate(new Date(year, month + 1));
    }
  };

  
  const handleRecordClick = (record: AttendanceRecord) => {
    setEditingRecord(record);
  };

  
  const handleStatusChange = (newStatus: AttendanceStatus) => {
    if (editingRecord && onRecordChange) {
      onRecordChange(editingRecord, newStatus);
      setEditingRecord(null);
    }
  };

  return (
    <div className="glass-card rounded-3xl p-8 border border-primary/20">
      <h2 className="text-2xl font-bold text-foreground mb-8">
        Attendance History
      </h2>

      
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={goToPreviousMonth}
          disabled={!canGoPrevious}
          className="p-2 rounded-lg hover:bg-secondary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>

        <h3 className="text-lg font-semibold text-foreground">
          {new Date(year, month).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </h3>

        <button
          onClick={goToNextMonth}
          disabled={!canGoNext}
          className="p-2 rounded-lg hover:bg-secondary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5 text-foreground" />
        </button>
      </div>

      
      <div className="grid grid-cols-7 gap-2 mb-4">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center text-xs font-semibold text-muted-foreground py-3 uppercase tracking-wider"
          >
            {day}
          </div>
        ))}
      </div>

      
      <div className="grid grid-cols-7 gap-2 mb-8">
        {calendarDays.map((date, idx) => {
          if (!date)
            return <div key={`empty-${idx}`} className="aspect-square" />;

          const record = getRecordForDate(date);
          const isCurrentMonth = date.getMonth() === month;
          const isToday = date.toDateString() === new Date().toDateString();
          const isSelected =
            selectedRecord &&
            new Date(selectedRecord.date).toDateString() ===
              date.toDateString();

          return (
            <div
              key={date.toISOString()}
              className="aspect-square flex items-center justify-center"
            >
              {record ? (
                <button
                  onClick={() => handleRecordClick(record)}
                  disabled={isLoading}
                  className={`
                    w-full h-full rounded-xl border-2 transition-all duration-200
                    flex items-center justify-center font-semibold text-sm
                    hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
                    ${getStatusColor(record.status)}
                    ${isToday ? "ring-2 ring-offset-2 ring-primary" : ""}
                    ${isSelected ? "ring-2 ring-offset-2 ring-accent" : ""}
                  `}
                  title={`${date.toDateString()}: ${getStatusLabel(record.status)}`}
                >
                  {date.getDate()}
                </button>
              ) : (
                <div
                  className={`
                    w-full h-full rounded-xl border-2 border-dashed border-border/30
                    flex items-center justify-center text-sm
                    ${!isCurrentMonth ? "text-muted-foreground/30" : "text-muted-foreground"}
                  `}
                >
                  {date.getDate()}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-6 pt-6 border-t border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded bg-primary/90 border border-primary" />
          <span className="text-sm text-foreground">Present</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded bg-destructive/90 border border-destructive" />
          <span className="text-sm text-foreground">Absent</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded bg-amber-500/20 border border-amber-500/30" />
          <span className="text-sm text-foreground">Cancelled</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded border-2 border-dashed border-border/30" />
          <span className="text-sm text-foreground">No Record</span>
        </div>
      </div>

      {/* Edit Dialog */}
      {editingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setEditingRecord(null)}
          />

          {/* Dialog */}
          <div className="relative glass-card rounded-3xl p-8 max-w-sm w-full border border-primary/20 shadow-2xl">
            <button
              onClick={() => setEditingRecord(null)}
              className="absolute top-6 right-6 p-2 rounded-lg hover:bg-secondary/50 transition-all"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-foreground" />
            </button>

            <h3 className="text-2xl font-bold text-foreground mb-2">
              Edit Attendance
            </h3>
            <p className="text-muted-foreground mb-6">
              {new Date(editingRecord.date).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>

            <div className="space-y-3">
              {(["present", "absent", "cancelled"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  disabled={isLoading}
                  className={`
                    w-full px-6 py-4 rounded-xl font-semibold transition-all duration-200
                    text-center border-2 disabled:opacity-50 disabled:cursor-not-allowed
                    ${
                      editingRecord.status === status
                        ? `${getStatusColor(status)} ring-2 ring-offset-2 ring-primary`
                        : "border-border/50 text-foreground hover:bg-secondary/50"
                    }
                  `}
                >
                  {getStatusLabel(status)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
