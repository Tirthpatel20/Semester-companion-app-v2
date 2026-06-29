import { db } from "@/db";
import { assessments, subjects } from "@/db/schema";
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
        assessments: {
          orderBy: (assessment, { asc }) => [
            asc(assessment.createdAt),
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

    return Response.json(
      {
        success: true,
        assessments: subject.assessments,
      },
      {
        status: 200,
      },
    );
  } catch {
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
      !body.name ||
      body.maxMarks <= 0 ||
      body.weightage < 0 ||
      body.weightage > 100
    ) {
      return Response.json(
        {
          error: "Invalid fields",
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

    const [assessment] = await db
      .insert(assessments)
      .values({
        subjectId: subject.id,
        name: body.name,
        maxMarks: body.maxMarks,
        weightage: body.weightage,
        obtainedMarks: body.obtainedMarks ?? null,
      })
      .returning();

    return Response.json(
      {
        success: true,
        assessment,
      },
      {
        status: 201,
      },
    );
  } catch (error: any) {
    if (error.code === "23505") {
      return Response.json(
        {
          error: "Assessment already exists",
        },
        {
          status: 409,
        },
      );
    }

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