import { db } from "@/db";
import { assessments, subjects } from "@/db/schema";
import { requireSession } from "@/lib/require-session";

import { and, asc, eq, ilike } from "drizzle-orm";
import { createAssessmentSchema } from "@/lib/validations/create-assessment";

import { ZodError } from "zod";

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
          orderBy: (assessment, { asc }) => [asc(assessment.createdAt)],
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
  const { id } = await params;
  try {
    const session = await requireSession();

    let body;

    try {
      body = createAssessmentSchema.parse(await request.json());
    } catch (error) {
      if (error instanceof ZodError) {
        return Response.json(
          {
            error: error.flatten(),
          },
          {
            status: 400,
          },
        );
      }

      throw error;
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

    const existingAssessment = await db.query.assessments.findFirst({
      where: and(
        eq(assessments.subjectId, subject.id),
        ilike(assessments.name, body.name),
      ),
    });

    if (existingAssessment) {
  return Response.json(
    {
      error: "Assessment already exists",
    },
    {
      status: 409,
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
    const isDuplicate =
      error.cause.code === "23505" ||
      error.message?.includes("unique constraint") ||
      error.detail?.includes("already exists");

    if (isDuplicate) {
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
        object: error,
      },
      {
        status: 500,
      },
    );
  }
}
