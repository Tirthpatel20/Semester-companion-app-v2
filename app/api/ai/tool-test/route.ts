import { GoogleGenAI } from "@google/genai";
import { attendanceTool } from "@/lib/ai/tools";
import { getSubjectAttendanceByName } from "@/lib/ai/tool-services";
import { requireSession } from "@/lib/require-session";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function GET() {
  const session = await requireSession();

  const interaction = await ai.interactions.create({
    model: "gemini-3.1-flash-lite",
    input: "What is my DAA attendance?",
    tools: [attendanceTool],
  });

  const functionCall = interaction.steps.find(
    (step) => step.type === "function_call",
  );

  if (!functionCall) {
    return Response.json({
      text: interaction.output_text,
    });
  }

  if (functionCall.name !== "getSubjectAttendance") {
    return Response.json({ error: "Unknown tool requested" }, { status: 400 });
  }

  const subjectName = functionCall.arguments.subjectName;

  if (typeof subjectName !== "string") {
    return Response.json({ error: "Invalid subject name" }, { status: 400 });
  }

  const toolResult = await getSubjectAttendanceByName(
    session.user.id,
    subjectName,
  );

  const finalInteraction = await ai.interactions.create({
    model: "gemini-3.1-flash-lite",

    input: [
      {
        type: "function_result",
        name: functionCall.name,
        call_id: functionCall.id,
        result: [
          {
            type: "text",
            text: JSON.stringify(toolResult),
          },
        ],
      },
    ],

    tools: [attendanceTool],

    previous_interaction_id: interaction.id,
  });

  return Response.json({
    text: finalInteraction.output_text,
  });
}
