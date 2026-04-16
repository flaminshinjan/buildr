import { NextRequest, NextResponse } from "next/server";
import { callDeepLTranslate, detectTargetLang, stripLangPrefix } from "@/lib/wrapped-apis";

export async function POST(request: NextRequest) {
  const { text } = (await request.json().catch(() => ({}))) as { text?: string };

  if (!text || typeof text !== "string") {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }

  const targetLang = detectTargetLang(text);
  const payload = stripLangPrefix(text) || text;

  try {
    const result = await callDeepLTranslate(payload, targetLang);
    return NextResponse.json({ result, agent: "deepl-specialist", api: "deepl" });
  } catch (err) {
    console.error("[wrapped-deepl] execute failed:", err);
    return NextResponse.json({
      result: `**DeepL translation failed.** Target language was ${targetLang}.`,
      agent: "deepl-specialist",
      api: "deepl",
    });
  }
}
