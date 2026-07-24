import { db } from "@/db";
import { aiConversations } from "@/db/schema";
import { requireSession } from "@/lib/require-session";
import { and, eq } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = await requireSession();

  const conversation = await db.query.aiConversations.findFirst({
    where: and(
      eq(aiConversations.id, Number(id)),
      eq(aiConversations.userId, session.user.id),
    ),

    with: {
      messages: {
        orderBy: (message, { asc }) => [asc(message.createdAt)],
      },
    },
  });

  return Response.json({
    conversation,
  });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const session = await requireSession();

    const conversationId = Number(id);

    if (Number.isNaN(conversationId)) {
      return Response.json(
        {
          error: "Invalid conversation id",
        },
        {
          status: 400,
        },
      );
    }

    const conversation = await db.query.aiConversations.findFirst({
      where: and(
        eq(aiConversations.id, conversationId),
        eq(aiConversations.userId, session.user.id),
      ),
    });

    if (!conversation) {
      return Response.json(
        {
          error: "Conversation not found",
        },
        {
          status: 404,
        },
      );
    }

    await db
      .delete(aiConversations)
      .where(eq(aiConversations.id, conversationId));

    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      {
        error: "Failed to delete conversation",
      },
      {
        status: 500,
      },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const session = await requireSession();
    const conversationId = Number(id);

    if (Number.isNaN(conversationId)) {
      return Response.json(
        {
          error: "Invalid conversation id",
        },
        {
          status: 400,
        },
      );
    }

    const { title } = await request.json();
    if (!title || typeof title !== "string" || !title.trim()) {
      return Response.json(
        {
          error: "Title is required",
        },
        {
          status: 400,
        },
      );
    }

    const conversation = await db.query.aiConversations.findFirst({
      where: and(
        eq(aiConversations.id, conversationId),
        eq(aiConversations.userId, session.user.id),
      ),
    });

    if (!conversation) {
      return Response.json(
        {
          error: "Conversation not found",
        },
        {
          status: 404,
        },
      );
    }

    const [updated] = await db
      .update(aiConversations)
      .set({
        title: title.trim(),
        updatedAt: new Date(),
      })
      .where(eq(aiConversations.id, conversationId))
      .returning();

    return Response.json({ success: true, conversation: updated });
  } catch (error) {
    return Response.json(
      {
        error: "Failed to rename conversation",
      },
      {
        status: 500,
      },
    );
  }
}
