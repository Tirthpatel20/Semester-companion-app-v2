import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "@/lib/ai/prompts";

import {
  allSubjectsAttendanceTool,
  attendanceTool,
  subjectAssessmentsTool,
  requiredMarksTool,
  subjectsTool,
  marksSimulationTool,
  allSubjectsPerformanceTool,
} from "@/lib/ai/tools";

import { executeTool } from "@/lib/ai/tool-executors";

import { requireSession } from "@/lib/require-session";
import { db } from "@/db";
import { and, eq } from "drizzle-orm";
import { aiConversations, aiMessages } from "@/db/schema";

const tools = [
  attendanceTool,
  allSubjectsAttendanceTool,
  subjectAssessmentsTool,
  requiredMarksTool,
  subjectsTool,
  marksSimulationTool,
  allSubjectsPerformanceTool,
];

const MAX_TOOL_ROUNDS = 5;

export async function POST(request: Request) {
  try {
    const session = await requireSession();

    const { message, previousInteractionId, conversationId } =
      await request.json();

    if (typeof message !== "string" || !message.trim()) {
      return Response.json(
        {
          error: "Message is required",
        },
        {
          status: 400,
        },
      );
    }

    if (typeof conversationId !== "number") {
      return Response.json(
        {
          error: "Conversation ID is required",
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

    await db.insert(aiMessages).values({
      conversationId,
      role: "user",
      content: message,
    });

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const encoder = new TextEncoder();

    const responseStream = new ReadableStream({
      async start(controller) {
        try {
          let currentInput: any = message;

          let currentPreviousInteractionId: string | null =
            previousInteractionId ?? null;

          let latestInteractionId: string | null = null;

          let assistantResponse = "";

          for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
            const stream = await ai.interactions.create({
              model: "gemini-3.1-flash-lite",

              input: currentInput,

              system_instruction: SYSTEM_INSTRUCTION,

              tools,

              ...(currentPreviousInteractionId && {
                previous_interaction_id: currentPreviousInteractionId,
              }),

              stream: true,
            });

            let interactionId: string | null = null;

            let functionCallId: string | null = null;

            let functionCallName: string | null = null;

            let argumentsText = "";

            for await (const event of stream) {
              if (event.event_type === "interaction.created") {
                interactionId = event.interaction.id;

                latestInteractionId = event.interaction.id;
              }

              if (
                event.event_type === "step.start" &&
                event.step.type === "function_call"
              ) {
                functionCallId = event.step.id;

                functionCallName = event.step.name;
              }

              if (event.event_type === "step.delta") {
                if (event.delta.type === "text") {
                  assistantResponse += event.delta.text;
                  controller.enqueue(encoder.encode(event.delta.text));
                }

                if (event.delta.type === "arguments_delta") {
                  argumentsText += event.delta.arguments;
                }
              }
            }

            if (!functionCallId || !functionCallName || !interactionId) {
              break;
            }

            const args = argumentsText ? JSON.parse(argumentsText) : {};

            const toolResult = await executeTool(
              functionCallName,
              args,
              session.user.id,
            );

            currentPreviousInteractionId = interactionId;

            currentInput = [
              {
                type: "function_result",

                name: functionCallName,

                call_id: functionCallId,

                result: {
                  content: [
                    {
                      type: "text",

                      text: JSON.stringify(toolResult),
                    },
                  ],
                },
              },
            ];
          }

          if (assistantResponse.trim()) {
            await db.insert(aiMessages).values({
              conversationId,
              role: "assistant",
              content: assistantResponse,
            });
          }

          await db
            .update(aiConversations)
            .set({
              latestInteractionId: latestInteractionId,
            })
            .where(eq(aiConversations.id, conversationId));

          const conversation = await db.query.aiConversations.findFirst({
            where: and(
              eq(aiConversations.id, conversationId),
              eq(aiConversations.userId, session.user.id),
            ),
          });

          if (conversation && conversation.title === "New Chat") {
            const titleResponse = await ai.models.generateContent({
              model: "gemini-3.1-flash-lite",

              contents: `
                Generate a very short title for this conversation.

                Rules:
                - Maximum 4 words.
                - Do not use quotation marks.
                - Do not end with punctuation.
                - Return ONLY the title.

                User:
                ${message}

                Assistant:
                  ${assistantResponse}
              `,
            });

            const generatedTitle = titleResponse.text
              ?.trim()
              .replace(/^["']|["']$/g, "")
              .replace(/\.$/, "")
              .slice(0, 60);

            if (generatedTitle) {
              await db
                .update(aiConversations)
                .set({
                  title: generatedTitle,
                })
                .where(eq(aiConversations.id, conversationId));
            }
          }
          controller.enqueue(
            encoder.encode(`\n__INTERACTION_ID__:${latestInteractionId}`),
          );

          controller.close();
        } catch (error) {
          console.error(error);
          controller.error(error);
        }
      },
    });

    return new Response(responseStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: "Failed to generate response",
      },
      {
        status: 500,
      },
    );
  }
}
