import { AttendanceStatus } from "@/types";

export async function getAttendance(subjectId: number) {
  const response = await fetch(`/api/subjects/${subjectId}/attendance`);

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error);
  }

  return result;
}

export async function markAttendance(
  subjectId: number,
  status: AttendanceStatus,
) {
  const response = await fetch(`/api/subjects/${subjectId}/attendance`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status,
      attendanceDate: new Date().toISOString().split("T")[0],
    }),
  });

  const result = await response.json();

  if (!response.ok) throw new Error(result.error);

  return result;
}
