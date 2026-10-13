import OpenAI from "openai";
import type { AiRequest, AiResponse, Studymode } from "@/types/study";

const studyModes: Studymode[] = ["explain", "quiz", "hint"];

const modeInstructions: Record<Studymode, string> = {
  explain:
    "Explain the React concept clearly for a beginner. Include a short code example when helpful.",
  quiz:
    "Create three short React practice questions from the user's topic. Put answers at the end.",
  hint:
    "Give step-by-step hints without revealing the final answer immediately.",
};

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<AiRequest>;

  if (!body.message || !body.mode || !studyModes.includes(body.mode)) {
    return Response.json(
      { error: "message and mode are required." },
      { status: 400 },
    );
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return Response.json(
      { error: "OPENAI_API_KEY is not configured." },
      { status: 500 },
    );
  }

  try {
    const openai = new OpenAI({ apiKey });

    const response = await openai.responses.create({
      model: "gpt-5",
      instructions: modeInstructions[body.mode],
      input: body.message,
    });

    const data: AiResponse = {
      answer: response.output_text,
    };

    return Response.json(data);
  } catch {
    return Response.json(
      { error: "Failed to create an AI response." },
      { status: 500 },
    );
  }
}
