export type AttendanceRecord = {
  id: number;
  subjectId: number;
  status: "Present" | "Absent" | string;
  attendanceDate: string;
  createdAt: Date;
};
export type AttendanceStatus = {
  status: "Present" | "Absent" | string;
};
