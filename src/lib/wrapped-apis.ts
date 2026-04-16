/**
 * Locus Wrapped APIs — helper module.
 *
 * Every call routes through Locus (https://paywithlocus.com) and automatically
 * settles in USDC on Base from our Locus wallet. Each helper targets a specific
 * provider endpoint, returns a display-formatted string, and falls back to a
 * graceful message on error (never throws).
 */

const LOCUS_BASE = "https://beta-api.paywithlocus.com/api";

type LocusEnvelope<T> = {
  success: boolean;
  data: T;
  error?: { message?: string } | string;
};

function authHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.LOCUS_API_KEY || ""}`,
  };
}

async function callLocus<T = unknown>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${LOCUS_BASE}${path}`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(body),
    // Locus calls can take a while for heavy providers like Stability.
    cache: "no-store",
  });

  const json = (await res.json().catch(() => null)) as LocusEnvelope<T> | null;

  if (!res.ok || !json || json.success === false) {
    const errMsg =
      (json && (typeof json.error === "string" ? json.error : json.error?.message)) ||
      `HTTP ${res.status}`;
    throw new Error(`Locus wrapped API error (${path}): ${errMsg}`);
  }

  return json.data;
}

function truncate(s: string, n = 4000): string {
  if (!s) return "";
  return s.length > n ? `${s.slice(0, n)}…` : s;
}

/* ------------------------------------------------------------------ *
 * Firecrawl — web scraping
 * ------------------------------------------------------------------ */
export async function callFirecrawl(url: string): Promise<string> {
  try {
    const data = await callLocus<{
      markdown?: string;
      content?: string;
      data?: { markdown?: string; content?: string };
      metadata?: { title?: string };
    }>("/wrapped/firecrawl/scrape", { url });

    const markdown =
      data.markdown ||
      data.content ||
      data.data?.markdown ||
      data.data?.content ||
      "";
    const title = data.metadata?.title;

    if (!markdown) {
      return `**Scraped ${url}**\n\n(No content extracted — the page may be JavaScript-rendered or gated.)`;
    }

    const header = title ? `**${title}** — ${url}` : `**Scraped:** ${url}`;
    return `${header}\n\n${truncate(markdown, 6000)}`;
  } catch (err) {
    console.error("[wrapped-apis] Firecrawl failed:", err);
    return `**Firecrawl (Locus) fallback**\n\nAttempted to scrape ${url} but the wrapped API call failed. Configure LOCUS_API_KEY to enable live scraping.`;
  }
}

/* ------------------------------------------------------------------ *
 * Exa — neural web search
 * ------------------------------------------------------------------ */
export async function callExaSearch(query: string, numResults = 5): Promise<string> {
  try {
    const data = await callLocus<{
      results?: Array<{
        title?: string;
        url?: string;
        text?: string;
        snippet?: string;
        publishedDate?: string;
      }>;
    }>("/wrapped/exa/search", { query, numResults });

    const results = data.results || [];
    if (results.length === 0) {
      return `**Exa search — "${query}"**\n\nNo results returned.`;
    }

    const lines = results.slice(0, numResults).map((r, i) => {
      const title = r.title || r.url || "Untitled";
      const snippet = truncate(r.text || r.snippet || "", 400);
      return `**${i + 1}. [${title}](${r.url})**${r.publishedDate ? ` _(${r.publishedDate})_` : ""}\n${snippet}`;
    });

    return `**Exa search — "${query}"**\n\n${lines.join("\n\n")}`;
  } catch (err) {
    console.error("[wrapped-apis] Exa failed:", err);
    return `**Exa (Locus) fallback**\n\nCould not complete search for "${query}" — wrapped API call failed.`;
  }
}

/* ------------------------------------------------------------------ *
 * OpenAI — chat completions (gpt-4o-mini)
 * ------------------------------------------------------------------ */
export async function callOpenAIChat(prompt: string, systemPrompt?: string): Promise<string> {
  try {
    const messages: Array<{ role: string; content: string }> = [];
    if (systemPrompt) messages.push({ role: "system", content: systemPrompt });
    messages.push({ role: "user", content: prompt });

    const data = await callLocus<{
      choices?: Array<{ message?: { content?: string } }>;
    }>("/wrapped/openai/chat/completions", {
      model: "gpt-4o-mini",
      messages,
    });

    const content = data.choices?.[0]?.message?.content?.trim();
    return content || "(OpenAI returned an empty response.)";
  } catch (err) {
    console.error("[wrapped-apis] OpenAI failed:", err);
    return `**OpenAI (Locus) fallback**\n\nThe wrapped OpenAI call failed. Draft response for "${truncate(prompt, 200)}" could not be generated.`;
  }
}

/* ------------------------------------------------------------------ *
 * Anthropic — Claude messages
 * ------------------------------------------------------------------ */
export async function callAnthropicChat(prompt: string, systemPrompt?: string): Promise<string> {
  try {
    const body: Record<string, unknown> = {
      model: "claude-3-5-sonnet-latest",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    };
    if (systemPrompt) body.system = systemPrompt;

    const data = await callLocus<{
      content?: Array<{ type?: string; text?: string }>;
    }>("/wrapped/anthropic/messages", body);

    const text = data.content
      ?.filter((c) => c.type === "text")
      .map((c) => c.text)
      .join("\n")
      .trim();
    return text || "(Anthropic returned an empty response.)";
  } catch (err) {
    console.error("[wrapped-apis] Anthropic failed:", err);
    return `**Claude (Locus) fallback**\n\nThe wrapped Anthropic call failed for the provided input.`;
  }
}

/* ------------------------------------------------------------------ *
 * DeepL — translation
 * ------------------------------------------------------------------ */
export async function callDeepLTranslate(text: string, targetLang: string): Promise<string> {
  try {
    const data = await callLocus<{
      translations?: Array<{ text?: string; detected_source_language?: string }>;
    }>("/wrapped/deepl/translate", {
      text: [text],
      target_lang: targetLang.toUpperCase(),
    });

    const translation = data.translations?.[0];
    if (!translation?.text) {
      return `**DeepL — ${targetLang.toUpperCase()}**\n\n(No translation returned.)`;
    }

    const source = translation.detected_source_language
      ? ` _(detected source: ${translation.detected_source_language})_`
      : "";
    return `**Translation → ${targetLang.toUpperCase()}**${source}\n\n${translation.text}`;
  } catch (err) {
    console.error("[wrapped-apis] DeepL failed:", err);
    return `**DeepL (Locus) fallback**\n\nCould not translate to ${targetLang.toUpperCase()} — wrapped API call failed.`;
  }
}

/* ------------------------------------------------------------------ *
 * Stability AI — image generation
 * ------------------------------------------------------------------ */
export async function callStabilityGenerate(prompt: string): Promise<string> {
  try {
    const data = await callLocus<{
      image?: string; // base64
      image_url?: string;
      url?: string;
      artifacts?: Array<{ base64?: string }>;
    }>("/wrapped/stability-ai/generate-core", {
      prompt,
      aspect_ratio: "1:1",
    });

    const url = data.image_url || data.url;
    const b64 = data.image || data.artifacts?.[0]?.base64;

    if (url) {
      return `**Generated image for:** "${truncate(prompt, 160)}"\n\n![generated](${url})`;
    }
    if (b64) {
      const dataUrl = `data:image/png;base64,${b64}`;
      // Data URLs can be massive — keep the output reasonable by noting size.
      return `**Generated image for:** "${truncate(prompt, 160)}"\n\n![generated](${dataUrl})`;
    }
    return `**Stability AI**\n\nImage generated for "${truncate(prompt, 160)}" but no URL was returned.`;
  } catch (err) {
    console.error("[wrapped-apis] Stability failed:", err);
    return `**Stability AI (Locus) fallback**\n\nCould not generate image for "${truncate(prompt, 160)}" — wrapped API call failed.`;
  }
}

/* ------------------------------------------------------------------ *
 * Perplexity — web-grounded chat (sonar)
 * ------------------------------------------------------------------ */
export async function callPerplexity(query: string): Promise<string> {
  try {
    const data = await callLocus<{
      choices?: Array<{ message?: { content?: string } }>;
      citations?: string[];
    }>("/wrapped/perplexity/chat/completions", {
      model: "sonar",
      messages: [{ role: "user", content: query }],
    });

    const answer = data.choices?.[0]?.message?.content?.trim() || "(No answer returned.)";
    const citations = data.citations || [];

    const citeBlock =
      citations.length > 0
        ? `\n\n**Sources:**\n${citations.map((c, i) => `${i + 1}. ${c}`).join("\n")}`
        : "";

    return `**Perplexity — "${truncate(query, 120)}"**\n\n${answer}${citeBlock}`;
  } catch (err) {
    console.error("[wrapped-apis] Perplexity failed:", err);
    return `**Perplexity (Locus) fallback**\n\nCould not fetch web-grounded answer for "${truncate(query, 120)}".`;
  }
}

/* ------------------------------------------------------------------ *
 * Brave Search — web search
 * ------------------------------------------------------------------ */
export async function callBraveSearch(query: string, count = 5): Promise<string> {
  try {
    const data = await callLocus<{
      web?: {
        results?: Array<{ title?: string; url?: string; description?: string }>;
      };
    }>("/wrapped/brave/web-search", { q: query, count });

    const results = data.web?.results || [];
    if (results.length === 0) {
      return `**Brave Search — "${query}"**\n\nNo results returned.`;
    }

    const lines = results.slice(0, count).map((r, i) => {
      const title = r.title || r.url || "Untitled";
      const desc = truncate(r.description || "", 300);
      return `**${i + 1}. [${title}](${r.url})**\n${desc}`;
    });

    return `**Brave Search — "${query}"**\n\n${lines.join("\n\n")}`;
  } catch (err) {
    console.error("[wrapped-apis] Brave failed:", err);
    return `**Brave Search (Locus) fallback**\n\nCould not complete search for "${query}".`;
  }
}

/* ------------------------------------------------------------------ *
 * Deepgram — audio transcription
 * ------------------------------------------------------------------ */
export async function callDeepgram(audioUrl: string): Promise<string> {
  try {
    const data = await callLocus<{
      results?: {
        channels?: Array<{
          alternatives?: Array<{ transcript?: string; confidence?: number }>;
        }>;
      };
    }>("/wrapped/deepgram/listen", { url: audioUrl });

    const alt = data.results?.channels?.[0]?.alternatives?.[0];
    const transcript = alt?.transcript?.trim();
    if (!transcript) {
      return `**Deepgram — ${audioUrl}**\n\n(No transcript returned.)`;
    }

    const conf = alt?.confidence ? ` _(confidence: ${(alt.confidence * 100).toFixed(1)}%)_` : "";
    return `**Transcript — ${audioUrl}**${conf}\n\n${truncate(transcript, 8000)}`;
  } catch (err) {
    console.error("[wrapped-apis] Deepgram failed:", err);
    return `**Deepgram (Locus) fallback**\n\nCould not transcribe ${audioUrl} — wrapped API call failed.`;
  }
}

/* ------------------------------------------------------------------ *
 * Small parsing utilities used by specialist endpoints.
 * ------------------------------------------------------------------ */

/** Extract the first URL found in a text blob. */
export function extractFirstUrl(text: string): string | null {
  const match = text.match(/\bhttps?:\/\/[^\s<>"')]+/i);
  return match ? match[0] : null;
}

/** Heuristic target language detection from "... to Japanese:", "in Spanish", etc. */
export function detectTargetLang(text: string): string {
  const map: Record<string, string> = {
    japanese: "JA",
    spanish: "ES",
    french: "FR",
    german: "DE",
    italian: "IT",
    portuguese: "PT",
    dutch: "NL",
    polish: "PL",
    russian: "RU",
    chinese: "ZH",
    mandarin: "ZH",
    korean: "KO",
    english: "EN",
    swedish: "SV",
    danish: "DA",
    norwegian: "NB",
    finnish: "FI",
    turkish: "TR",
    czech: "CS",
    greek: "EL",
    hungarian: "HU",
    romanian: "RO",
    ukrainian: "UK",
    indonesian: "ID",
    arabic: "AR",
  };

  const lower = text.toLowerCase();
  // Prefer explicit "to X" / "in X" hints.
  const patterns = [/\bto\s+([a-z]+)/g, /\bin\s+([a-z]+)/g, /\binto\s+([a-z]+)/g];
  for (const pat of patterns) {
    let m: RegExpExecArray | null;
    while ((m = pat.exec(lower)) !== null) {
      const code = map[m[1]];
      if (code) return code;
    }
  }
  // Fallback: any mention of a language.
  for (const [name, code] of Object.entries(map)) {
    if (lower.includes(name)) return code;
  }
  return "EN";
}

/** Strip a leading "to Japanese:" style prefix so only the payload remains. */
export function stripLangPrefix(text: string): string {
  return text.replace(/^\s*(?:translate\s+)?(?:to|into|in)\s+[a-zA-Z]+\s*[:\-,]?\s*/i, "").trim();
}
