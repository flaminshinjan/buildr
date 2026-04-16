import { NextRequest, NextResponse } from "next/server";
import { callDeepgram, extractFirstUrl } from "@/lib/wrapped-apis";

export async function POST(request: NextRequest) {
  const { text } = (await request.json().catch(() => ({}))) as { text?: string };

  if (!text || typeof text !== "string") {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }

  const audioUrl = extractFirstUrl(text);

  if (!audioUrl) {
    return NextResponse.json({
      result: `**No audio URL detected in input.** Deepgram needs a direct URL to an audio or video file (mp3, wav, mp4, etc.). Received: "${text.slice(0, 200)}".`,
      agent: "deepgram-specialist",
      api: "deepgram",
    });
  }

  try {
    const result = await callDeepgram(audioUrl);
    return NextResponse.json({ result, agent: "deepgram-specialist", api: "deepgram" });
  } catch (err) {
    console.error("[wrapped-deepgram] execute failed:", err);
    return NextResponse.json({
      result: `**Deepgram transcription failed** for ${audioUrl}.`,
      agent: "deepgram-specialist",
      api: "deepgram",
    });
  }
}
