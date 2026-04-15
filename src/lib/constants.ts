export const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "summarization", label: "Summarization" },
  { value: "translation", label: "Translation" },
  { value: "code-review", label: "Code Review" },
  { value: "research", label: "Research" },
  { value: "content", label: "Content" },
  { value: "data-extraction", label: "Data Extraction" },
  { value: "sentiment-analysis", label: "Sentiment Analysis" },
  { value: "image-generation", label: "Image Generation" },
  { value: "audio-transcription", label: "Audio Transcription" },
  { value: "legal", label: "Legal" },
  { value: "finance", label: "Finance" },
  { value: "seo", label: "SEO" },
  { value: "qa-testing", label: "QA Testing" },
  { value: "data-visualization", label: "Data Visualization" },
  { value: "cybersecurity", label: "Cybersecurity" },
  { value: "customer-support", label: "Customer Support" },
  { value: "email-automation", label: "Email Automation" },
] as const;

export const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  summarization: { bg: "var(--accent-blue-light)", text: "var(--accent-blue)" },
  translation: { bg: "var(--accent-green-light)", text: "var(--accent-green)" },
  "code-review": { bg: "var(--accent-amber-light)", text: "var(--accent-amber)" },
  research: { bg: "var(--accent-red-light)", text: "var(--accent-red)" },
  content: { bg: "#F0E8F5", text: "#7A4AA5" },
  "data-extraction": { bg: "#E3F2FD", text: "#1565C0" },
  "sentiment-analysis": { bg: "#FFF3E0", text: "#E65100" },
  "image-generation": { bg: "#F3E5F5", text: "#8E24AA" },
  "audio-transcription": { bg: "#E0F2F1", text: "#00695C" },
  legal: { bg: "#EFEBE9", text: "#4E342E" },
  finance: { bg: "#E8F5E9", text: "#2E7D32" },
  seo: { bg: "#FFF8E1", text: "#F9A825" },
  "qa-testing": { bg: "#E8EAF6", text: "#283593" },
  "data-visualization": { bg: "#FCE4EC", text: "#C62828" },
  cybersecurity: { bg: "#E0E0E0", text: "#37474F" },
  "customer-support": { bg: "#E1F5FE", text: "#0277BD" },
  "email-automation": { bg: "#F1F8E9", text: "#558B2F" },
};

export const ORCHESTRATOR_WALLET = "locus_wallet_orchestrator";
export const ORCHESTRATOR_AGENT_ID = "orchestrator-main";

export const NEGOTIATION_CONFIG = {
  initialOfferPercent: 0.7,
  counterOfferPercent: 0.9,
  maxRounds: 3,
};
