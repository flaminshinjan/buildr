import { NextRequest, NextResponse } from "next/server";
import { callPerplexity } from "@/lib/wrapped-apis";

export async function POST(request: NextRequest) {
  const { text } = (await request.json().catch(() => ({}))) as { text?: string };

  if (!text || typeof text !== "string") {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }

  try {
    const result = await callPerplexity(text);
    return NextResponse.json({ result, agent: "perplexity-specialist", api: "perplexity" });
  } catch (err) {
    console.error("[wrapped-perplexity] execute failed:", err);
    return NextResponse.json({
      result: `**Perplexity web-grounded lookup failed** for "${text.slice(0, 160)}".`,
      agent: "perplexity-specialist",
      api: "perplexity",
    });
  }
}
