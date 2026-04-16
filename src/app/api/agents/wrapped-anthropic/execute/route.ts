import { NextRequest, NextResponse } from "next/server";
import { callAnthropicChat } from "@/lib/wrapped-apis";

const SYSTEM_PROMPT =
  "You are an expert analyst. When given a task — summarization, sentiment analysis, code review, or reasoning — respond in clean markdown with clear section headers and bullet points. Be concise and direct.";

export async function POST(request: NextRequest) {
  const { text } = (await request.json().catch(() => ({}))) as { text?: string };

  if (!text || typeof text !== "string") {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }

  try {
    const result = await callAnthropicChat(text, SYSTEM_PROMPT);
    return NextResponse.json({ result, agent: "anthropic-specialist", api: "anthropic" });
  } catch (err) {
    console.error("[wrapped-anthropic] execute failed:", err);
    return NextResponse.json({
      result: `**Claude specialist unavailable.** Request was: "${text.slice(0, 200)}".`,
      agent: "anthropic-specialist",
      api: "anthropic",
    });
  }
}
