import { NextRequest, NextResponse } from "next/server";
import { callStabilityGenerate } from "@/lib/wrapped-apis";

export async function POST(request: NextRequest) {
  const { text } = (await request.json().catch(() => ({}))) as { text?: string };

  if (!text || typeof text !== "string") {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }

  try {
    const result = await callStabilityGenerate(text);
    return NextResponse.json({ result, agent: "stability-specialist", api: "stability-ai" });
  } catch (err) {
    console.error("[wrapped-stability] execute failed:", err);
    return NextResponse.json({
      result: `**Stability image generation failed.** Prompt was: "${text.slice(0, 200)}".`,
      agent: "stability-specialist",
      api: "stability-ai",
    });
  }
}
