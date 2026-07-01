import { db } from "@/db";
import { attendanceRecords, subjects } from "@/db/schema";
import { calculateAttendanceStats } from "@/lib/attendance";
import { requireSession } from "@/lib/require-session";

import { and, asc, eq } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireSession();

    const { id } = await params;

    const subject = await db.query.subjects.findFirst({
      where: and(
        eq(subjects.id, Number(id)),
        eq(subjects.userId, session.user.id),
      ),
      with: {
        attendanceRecords: {
          orderBy: (attendance, { asc }) => [
            asc(attendance.attendanceDate),
          ],
        },
      },
    });

    if (!subject) {
      return Response.json(
        {
          error: "Subject not found",
        },
        {
          status: 404,
        },
      );
    }

    const stats = calculateAttendanceStats(
      subject.attendanceRecords,
    );

    return Response.json(
      {
        success: true,
        records: subject.attendanceRecords,
        stats,
      },
      {
        status: 200,
      },
    );
  } catch(error) {
    console.log(error)
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

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireSession();

    const body = await request.json();

    const { id } = await params;

    if (
      !body.status ||
      !["Present", "Absent"].includes(body.status)
    ) {
      return Response.json(
        {
          error: "Invalid attendance status",
        },
        {
          status: 400,
        },
      );
    }

    const subject = await db.query.subjects.findFirst({
      where: and(
        eq(subjects.id, Number(id)),
        eq(subjects.userId, session.user.id),
      ),
    });

    if (!subject) {
      return Response.json(
        {
          error: "Subject not found",
        },
        {
          status: 404,
        },
      );
    }

    const attendanceDate =
      body.attendanceDate ??
      new Date().toISOString().split("T")[0];

    const [attendance] = await db
      .insert(attendanceRecords)
      .values({
        subjectId: subject.id,
        status: body.status,
        attendanceDate,
      })
      .onConflictDoUpdate({
        target: [
          attendanceRecords.subjectId,
          attendanceRecords.attendanceDate,
        ],
        set: {
          status: body.status,
        },
      })
      .returning();

    return Response.json(
      {
        success: true,
        attendance,
      },
      {
        status: 201,
      },
    );
  } catch(error) {
    console.log(error)
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