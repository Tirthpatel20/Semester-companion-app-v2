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

