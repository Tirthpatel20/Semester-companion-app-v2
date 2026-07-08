import { SYSTEM_INSTRUCTION } from "@/lib/ai/prompts";
import { GoogleGenAI } from "@google/genai";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(request: Request) {
  const body = await request.json();

  const messages = body.messages;

  if (!Array.isArray(messages) || messages.length === 0) {
    return Response.json({ error: "Messages are required" }, { status: 400 });
  }

  const contents = messages.map((message: Message) => ({
    role: message.role === "assistant" ? "model" : "user",
    parts: [
      {
        text: message.content,
      },
    ],
  }));

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const response = await ai.models.generateContentStream({
    model: "gemini-3.1-flash-lite",
    contents,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
    },
  });

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of response) {
          if (chunk.text) {
            controller.enqueue(encoder.encode(chunk.text));
          }
        }

        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
