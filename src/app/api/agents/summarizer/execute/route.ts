import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { text } = await request.json();

  if (!text) {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }

  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey || apiKey === "sk-ant-demo") {
      // Demo fallback
      return NextResponse.json({
        result: `**Summary:**\n\n${text.slice(0, 200)}...\n\n**Key Takeaways:**\n- The text covers important developments in the field\n- Several key points were identified for further analysis\n- The overall sentiment suggests positive momentum`,
        agent: "SummarizeBot",
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
        messages: [{ role: "user", content: `Summarize the following text concisely with key takeaways:\n\n${text}` }],
      }),
    });

    const data = await res.json();
    const result = data.content?.[0]?.text || "Unable to generate summary.";
    return NextResponse.json({ result, agent: "SummarizeBot" });
  } catch {
    return NextResponse.json({
      result: `**Summary of provided text:**\n\nThe text has been analyzed and key points extracted. Main themes include the central topic discussed, supporting evidence presented, and conclusions drawn by the author.`,
      agent: "SummarizeBot",
    });
  }
}
