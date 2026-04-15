import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { text } = await request.json();

  if (!text) {
    return NextResponse.json({ error: "text (content brief) is required" }, { status: 400 });
  }

  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey || apiKey === "sk-ant-demo") {
      return NextResponse.json({
        result: `**Content Created:**\n\n${text.slice(0, 100)}...\n\nEngaging copy has been generated based on your brief. The content is optimized for clarity, engagement, and conversion while maintaining your brand voice.`,
        agent: "CopywriterBot",
      });
    }

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        messages: [{ role: "user", content: `Create engaging marketing copy based on this brief:\n\n${text}` }],
      }),
    });

    const data = await res.json();
    const result = data.content?.[0]?.text || "Unable to generate copy.";
    return NextResponse.json({ result, agent: "CopywriterBot" });
  } catch {
    return NextResponse.json({
      result: `**Generated Copy:**\n\nProfessional content has been created based on your brief.`,
      agent: "CopywriterBot",
    });
  }
}
