import { SubTask } from "@/lib/schema";

/**
 * Safely extract and parse JSON from an LLM response that may be wrapped
 * in markdown code fences (```json ... ``` or ``` ... ```).
 *
 * @throws {Error} if no valid JSON object/array can be found
 */
export function extractJsonFromLlmResponse<T = unknown>(text: string): T {
  // 1. Try direct parse first (already clean JSON)
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed) as T;
  } catch {
    // fall through
  }

  // 2. Strip markdown code fences: ```json\n...\n``` or ```\n...\n```
  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenceMatch) {
    try {
      return JSON.parse(fenceMatch[1].trim()) as T;
    } catch {
      // fall through
    }
  }

  // 3. Last resort: find first { or [ and attempt to parse from there
  const firstBrace = trimmed.search(/[{\[]/);
  if (firstBrace !== -1) {
    const lastBrace = Math.max(
      trimmed.lastIndexOf("}"),
      trimmed.lastIndexOf("]")
    );
    if (lastBrace > firstBrace) {
      try {
        return JSON.parse(trimmed.slice(firstBrace, lastBrace + 1)) as T;
      } catch {
        // fall through
      }
    }
  }

  throw new Error(
    `Could not extract valid JSON from LLM response: ${trimmed.slice(0, 200)}`
  );
}

/**
 * Parse a list of SubTasks from LLM JSON, tolerating markdown fences.
 * Filters out any sub-tasks whose category is not in the allowed list.
 */
export function parseSubTasksFromLlm(
  text: string,
  availableCategories: string[]
): SubTask[] {
  const parsed = extractJsonFromLlmResponse<{ subTasks?: SubTask[] }>(text);
  if (!Array.isArray(parsed.subTasks)) {
    throw new Error("LLM response missing subTasks array");
  }
  return parsed.subTasks.filter((st: SubTask) =>
    Boolean(st.category) && availableCategories.includes(st.category)
  );
}
