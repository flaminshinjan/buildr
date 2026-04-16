import { NextRequest, NextResponse } from "next/server";
import { callFirecrawl, extractFirstUrl } from "@/lib/wrapped-apis";

export async function POST(request: NextRequest) {
  const { text } = (await request.json().catch(() => ({}))) as { text?: string };

  if (!text || typeof text !== "string") {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }

  const url = extractFirstUrl(text);

  if (!url) {
    return NextResponse.json({
      result: `**No URL detected in input.** Firecrawl needs a URL to scrape (e.g. "scrape https://example.com"). Received: "${text.slice(0, 200)}".`,
      agent: "firecrawl-specialist",
      api: "firecrawl",
    });
  }

  try {
    const result = await callFirecrawl(url);
    return NextResponse.json({ result, agent: "firecrawl-specialist", api: "firecrawl" });
  } catch (err) {
    console.error("[wrapped-firecrawl] execute failed:", err);
    return NextResponse.json({
      result: `**Firecrawl failed for ${url}.** Please verify the URL is publicly reachable.`,
      agent: "firecrawl-specialist",
      api: "firecrawl",
    });
  }
}
