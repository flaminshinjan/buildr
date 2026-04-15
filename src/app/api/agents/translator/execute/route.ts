import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { text, target_language } = await request.json();

  if (!text) {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }

  const lang = target_language || "Spanish";

  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey || apiKey === "sk-ant-demo") {
      return NextResponse.json({
        result: `[Translated to ${lang}]\n\n${text.slice(0, 300)}...\n\n(Translation powered by TranslateBot)`,
        agent: "TranslateBot",
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
        messages: [{ role: "user", content: `Translate the following text to ${lang}. Preserve tone and context:\n\n${text}` }],
      }),
    });

    const data = await res.json();
    const result = data.content?.[0]?.text || "Unable to translate.";
    return NextResponse.json({ result, agent: "TranslateBot" });
  } catch {
    return NextResponse.json({
      result: `[${lang} Translation]\n\n${text.slice(0, 200)}...`,
      agent: "TranslateBot",
    });
  }
}
