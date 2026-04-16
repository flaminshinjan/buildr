import { NextRequest, NextResponse } from "next/server";
import { callBraveSearch } from "@/lib/wrapped-apis";

export async function POST(request: NextRequest) {
  const { text } = (await request.json().catch(() => ({}))) as { text?: string };

  if (!text || typeof text !== "string") {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }

  try {
    const result = await callBraveSearch(text, 5);
    return NextResponse.json({ result, agent: "brave-specialist", api: "brave" });
  } catch (err) {
    console.error("[wrapped-brave] execute failed:", err);
    return NextResponse.json({
      result: `**Brave search failed** for "${text.slice(0, 160)}".`,
      agent: "brave-specialist",
      api: "brave",
    });
  }
}
