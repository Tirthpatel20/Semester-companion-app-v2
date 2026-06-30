import { db } from "@/db";
import { assessments } from "@/db/schema";
import { requireSession } from "@/lib/require-session";
import { and, eq, ilike, ne } from "drizzle-orm";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireSession();

    const body = await request.json();

    const { id } = await params;

    if (body.obtainedMarks === undefined || body.obtainedMarks < 0) {
      return Response.json(
        {
          error: "Invalid marks",
        },
        {
          status: 400,
        },
      );
    }

    const assessment = await db.query.assessments.findFirst({
      where: eq(assessments.id, Number(id)),
      with: {
        subject: true,
      },
    });

    if (!assessment || assessment.subject.userId !== session.user.id) {
      return Response.json(
        {
          error: "Assessment not found",
        },
        {
          status: 404,
        },
      );
    }

    const existingAssessment = await db.query.assessments.findFirst({
      where: and(
        eq(assessments.id, Number(id)),
        ilike(assessments.name, body.name),
        ne(assessments.id, assessment.id),
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

    if (body.obtainedMarks > assessment.maxMarks) {
      return Response.json(
        {
          error: "Obtained marks cannot exceed maximum marks",
        },
        {
          status: 400,
        },
      );
    }

    const [updatedAssessment] = await db
      .update(assessments)
      .set({
        obtainedMarks: body.obtainedMarks,
        maxMarks: body.maxMarks,
        weightage: body.weightage,
        name: body.name,
      })
      .where(eq(assessments.id, assessment.id))
      .returning();

    return Response.json(
      {
        success: true,
        assessment: updatedAssessment,
      },
      {
        status: 200,
      },
    );
  } catch (error: any) {
    if (error.cause.code === "23505") {
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

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireSession();

    const { id } = await params;

    const assessment = await db.query.assessments.findFirst({
      where: eq(assessments.id, Number(id)),
      with: {
        subject: true,
      },
    });

    if (!assessment || assessment.subject.userId !== session.user.id) {
      return Response.json(
        {
          error: "Assessment not found",
        },
        {
          status: 404,
        },
      );
    }

    await db.delete(assessments).where(eq(assessments.id, assessment.id));

    return Response.json(
      {
        success: true,
        message: "Assessment deleted successfully",
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
