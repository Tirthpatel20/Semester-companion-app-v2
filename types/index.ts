export type AttendanceRecord = {
  id: number;
  subjectId: number;
  status: "Present" | "Absent" | "Cancelled" | string;
  attendanceDate: string;
  createdAt: Date;
};
export type AttendanceStatus = "Present" | "Absent" | "Cancelled";

