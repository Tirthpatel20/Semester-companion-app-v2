import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

export async function GET() {
  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: "Explain recursion in one simple sentence.",
  });

  return Response.json({
    response: response.text,
  });
}