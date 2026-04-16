import { NextRequest, NextResponse } from "next/server";
import { callOpenAIChat } from "@/lib/wrapped-apis";

const SYSTEM_PROMPT =
  "You are a versatile content specialist. Given a task or prompt, produce a clear, well-structured response in markdown. Favor concrete detail over filler; keep tone aligned with the request (marketing, technical, casual, etc.).";

export async function POST(request: NextRequest) {
  const { text } = (await request.json().catch(() => ({}))) as { text?: string };

  if (!text || typeof text !== "string") {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }

  try {
    const result = await callOpenAIChat(text, SYSTEM_PROMPT);
    return NextResponse.json({ result, agent: "openai-specialist", api: "openai" });
  } catch (err) {
    console.error("[wrapped-openai] execute failed:", err);
    return NextResponse.json({
      result: `**OpenAI specialist unavailable.** Request was: "${text.slice(0, 200)}".`,
      agent: "openai-specialist",
      api: "openai",
    });
  }
}
