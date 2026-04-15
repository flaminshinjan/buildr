export const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "summarization", label: "Summarization" },
  { value: "translation", label: "Translation" },
  { value: "code-review", label: "Code Review" },
  { value: "research", label: "Research" },
  { value: "content", label: "Content" },
] as const;

export const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  summarization: { bg: "var(--accent-blue-light)", text: "var(--accent-blue)" },
  translation: { bg: "var(--accent-green-light)", text: "var(--accent-green)" },
  "code-review": { bg: "var(--accent-amber-light)", text: "var(--accent-amber)" },
  research: { bg: "var(--accent-red-light)", text: "var(--accent-red)" },
  content: { bg: "#F0E8F5", text: "#7A4AA5" },
};

export const ORCHESTRATOR_WALLET = "locus_wallet_orchestrator";
export const ORCHESTRATOR_AGENT_ID = "orchestrator-main";

export const NEGOTIATION_CONFIG = {
  initialOfferPercent: 0.7,
  counterOfferPercent: 0.9,
  maxRounds: 3,
};
