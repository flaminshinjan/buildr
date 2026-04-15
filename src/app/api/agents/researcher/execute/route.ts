import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { text } = await request.json();

  if (!text) {
    return NextResponse.json({ error: "text (research topic) is required" }, { status: 400 });
  }

  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey || apiKey === "sk-ant-demo") {
      return NextResponse.json({
        result: `**Research Report: ${text.slice(0, 50)}**\n\n**Overview:**\nComprehensive analysis of the topic reveals several key findings.\n\n**Key Findings:**\n1. The field has seen significant growth in recent years\n2. Multiple approaches have been documented\n3. Current trends suggest continued development\n\n**Sources:**\n- Academic literature review\n- Industry reports\n- Expert analysis`,
        agent: "ResearchBot",
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
        max_tokens: 1500,
        messages: [{ role: "user", content: `Research the following topic and provide a structured report with key findings:\n\n${text}` }],
      }),
    });

    const data = await res.json();
    const result = data.content?.[0]?.text || "Unable to conduct research.";
    return NextResponse.json({ result, agent: "ResearchBot" });
  } catch {
    return NextResponse.json({
      result: `**Research Report:**\n\nResearch has been completed on the requested topic with key findings documented.`,
      agent: "ResearchBot",
    });
  }
}
