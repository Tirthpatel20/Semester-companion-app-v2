import { db } from "@/db";
import { subjects } from "@/db/schema";
import { calculateAttendanceStats } from "@/lib/attendance";
import { requireSession } from "@/lib/require-session";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const session = await requireSession();

    const userSubjects = await db.query.subjects.findMany({
      where: eq(subjects.userId, session.user.id),

      with: {
        attendanceRecords: true,
      },
    });

    const subjectsWithStats = userSubjects.map((subject) => {
      const stats = calculateAttendanceStats(subject.attendanceRecords);

      return {
        ...subject,
        stats,
      };
    });

    const totalSubjects = subjectsWithStats.length;

    const overallAttendance =
      totalSubjects === 0
        ? 0
        : subjectsWithStats.reduce(
            (sum, subject) => sum + subject.stats.attendancePercentage,
            0,
          ) / totalSubjects;

    const below75 = subjectsWithStats.filter(
      (subject) => subject.stats.attendancePercentage < 75,
    ).length;

    let gradeHealth = "Excellent";

    if (overallAttendance < 90) {
      gradeHealth = "Good";
    }

    if (overallAttendance < 80) {
      gradeHealth = "Warning";
    }

    if (overallAttendance < 75) {
      gradeHealth = "Critical";
    }

    return Response.json(
      {
        success: true,

        stats: {
          totalSubjects,
          overallAttendance: Number(overallAttendance.toFixed(1)),
          below75,
          gradeHealth,
        },

        subjects: subjectsWithStats,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: "Internal server error",
      },
      {
        status: 500,
      },
    );
  }
}