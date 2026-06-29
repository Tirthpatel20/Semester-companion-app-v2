import { AttendanceRecord } from "@/types";

export function calculateAttendanceStats(records: AttendanceRecord[]) {
  const present = records.filter((r) => r.status === "Present").length;
  const requiredAttendance = 75;

  const absent = records.filter((r) => r.status === "Absent").length;
  const completedClasses = present + absent;

  let classesCanSkip = 0;
  let classesNeeded = 0;

  let p = present;
  let t = completedClasses;

  if (p === 0 && t === 0)
    return {
      present: 0,
      absent: 0,
      completedClasses: 0,
      attendancePercentage: 0,
      classesNeeded: null,
      classesCanSkip: null,
    };

  while ((p / t) * 100 < requiredAttendance) {
    p++;
    t++;
    classesNeeded++;
  }

  p = present;
  t = completedClasses;

  while ((p / (t + 1)) * 100 >= requiredAttendance) {
    t++;
    classesCanSkip++;
  }

  const attendancePercentage =
    completedClasses === 0
      ? 0
      : Number(((present / completedClasses) * 100).toFixed(2));

  return {
    present,
    absent,
    completedClasses,
    attendancePercentage,
    classesNeeded,
    classesCanSkip,
  };
}
