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
