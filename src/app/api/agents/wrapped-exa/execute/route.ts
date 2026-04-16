import { NextRequest, NextResponse } from "next/server";
import { callExaSearch } from "@/lib/wrapped-apis";

export async function POST(request: NextRequest) {
  const { text } = (await request.json().catch(() => ({}))) as { text?: string };

  if (!text || typeof text !== "string") {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }

  try {
    const result = await callExaSearch(text, 5);
    return NextResponse.json({ result, agent: "exa-specialist", api: "exa" });
  } catch (err) {
    console.error("[wrapped-exa] execute failed:", err);
    return NextResponse.json({
      result: `**Exa search failed** for "${text.slice(0, 160)}".`,
      agent: "exa-specialist",
      api: "exa",
    });
  }
}
