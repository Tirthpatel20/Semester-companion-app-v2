import { db } from "@/db";
import { aiConversations } from "@/db/schema";
import { requireSession } from "@/lib/require-session";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
  const session = await requireSession();

  const conversations = await db.query.aiConversations.findMany({
    where: eq(aiConversations.userId, session.user.id),

    orderBy: (conversation, { desc }) => [desc(conversation.updatedAt)],
  });

  return Response.json(conversations);
}

export async function POST(request: Request) {
  const session = await requireSession();

  const [conversation] = await db
    .insert(aiConversations)
    .values({
      userId: session.user.id,

      title: "New Chat",
    })
    .returning();

  return Response.json({
    success: true,
    conversation,
  });
}
