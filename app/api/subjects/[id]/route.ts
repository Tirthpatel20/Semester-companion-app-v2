import { db } from "@/db";
import { subjects } from "@/db/schema";
import { requireSession } from "@/lib/require-session";

import { and, eq } from "drizzle-orm";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireSession();

    const body = await request.json();

    const { id } = await params;

    if (!body.name || body.credits <= 0 || body.totalClasses <= 0) {
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

    const [updatedSubject] = await db
      .update(subjects)
      .set({
        name: body.name,
        credits: body.credits,
        totalClasses: body.totalClasses,
      })
      .where(eq(subjects.id, subject.id))
      .returning();

    return Response.json(
      {
        success: true,
        subject: updatedSubject,
      },
      {
        status: 200,
      },
    );
  } catch (error: any) {
    if (error.code === "23505") {
      return Response.json(
        {
          error: "Subject already exists",
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

    await db.delete(subjects).where(eq(subjects.id, subject.id));

    return Response.json(
      {
        success: true,
        message: "Subject deleted successfully",
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
        subject,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    return Response.json(
      {
        error: error,
      },
      {
        status: 500,
      },
    );
  }
}
