"use client";

import { useMemo, useEffect, useState } from "react";
import { CATEGORY_COLORS } from "@/lib/constants";

interface DetectedCategory {
  category: string;
  label: string;
  estimatedPrice: number;
}

// Approximate cheapest agent prices per category (USDC)
const CATEGORY_PRICES: Record<string, number> = {
  summarization: 0.003,
  translation: 0.004,
  "code-review": 0.005,
  research: 0.005,
  content: 0.004,
  "data-extraction": 0.004,
  "sentiment-analysis": 0.003,
  "image-generation": 0.008,
  "audio-transcription": 0.006,
  legal: 0.006,
  finance: 0.005,
  seo: 0.004,
  "qa-testing": 0.005,
  "data-visualization": 0.005,
  cybersecurity: 0.006,
  "customer-support": 0.003,
  "email-automation": 0.004,
};

const CATEGORY_LABELS: Record<string, string> = {
  summarization: "Summarization",
  translation: "Translation",
  "code-review": "Code Review",
  research: "Research",
  content: "Content",
  "data-extraction": "Data Extraction",
  "sentiment-analysis": "Sentiment Analysis",
  "image-generation": "Image Generation",
  "audio-transcription": "Audio Transcription",
  legal: "Legal",
  finance: "Finance",
  seo: "SEO",
  "qa-testing": "QA Testing",
  "data-visualization": "Data Visualization",
  cybersecurity: "Cybersecurity",
  "customer-support": "Customer Support",
  "email-automation": "Email Automation",
};

const NEGOTIATION_DISCOUNT = 0.8; // Negotiator settles at ~80%

/**
 * Client-side replica of the decomposeTask keyword detection from orchestrator.ts.
 * Returns detected category strings (no SubTask objects needed).
 */
function detectCategories(userInput: string): string[] {
  const input = userInput.toLowerCase();
  const categories: string[] = [];

  if (input.includes("summar") || input.includes("condense") || input.includes("brief")) {
    categories.push("summarization");
  }
  if (
    input.includes("translat") || input.includes("spanish") || input.includes("french") ||
    input.includes("japanese") || input.includes("chinese") || input.includes("german")
  ) {
    categories.push("translation");
  }
  if (input.includes("review") || input.includes("code") || input.includes("bug") || input.includes("debug")) {
    categories.push("code-review");
  }
  if (input.includes("research") || input.includes("investigate") || input.includes("analyze") || input.includes("study")) {
    categories.push("research");
  }
  if (
    input.includes("write") || input.includes("copy") || input.includes("blog") ||
    input.includes("market") || input.includes("content") || input.includes("email")
  ) {
    categories.push("content");
  }
  if (
    input.includes("extract") || input.includes("scrape") || input.includes("parse") ||
    input.includes("csv") || input.includes("json") || input.includes("pdf")
  ) {
    categories.push("data-extraction");
  }
  if (
    input.includes("sentiment") || input.includes("opinion") || input.includes("mood") ||
    input.includes("feeling") || input.includes("positive") || input.includes("negative")
  ) {
    categories.push("sentiment-analysis");
  }
  if (
    input.includes("image") || input.includes("picture") || input.includes("illustration") ||
    input.includes("visual") || input.includes("generate image") || input.includes("draw") ||
    input.includes("design")
  ) {
    categories.push("image-generation");
  }
  if (
    input.includes("transcri") || input.includes("audio") || input.includes("speech") ||
    input.includes("voice") || input.includes("podcast") || input.includes("recording")
  ) {
    categories.push("audio-transcription");
  }
  if (
    input.includes("legal") || input.includes("contract") || input.includes("compliance") ||
    input.includes("regulation") || input.includes("terms") || input.includes("privacy policy") ||
    input.includes("law")
  ) {
    categories.push("legal");
  }
  if (
    input.includes("financ") || input.includes("invest") || input.includes("stock") ||
    input.includes("budget") || input.includes("revenue") || input.includes("profit") ||
    input.includes("forecast")
  ) {
    categories.push("finance");
  }
  if (
    input.includes("seo") || input.includes("keyword") || input.includes("search engine") ||
    input.includes("ranking") || input.includes("backlink") || input.includes("meta tag")
  ) {
    categories.push("seo");
  }
  if (
    input.includes("qa") || input.includes("quality") || input.includes("regression") ||
    input.includes("automation test")
  ) {
    categories.push("qa-testing");
  }
  if (
    input.includes("chart") || input.includes("graph") || input.includes("dashboard") ||
    input.includes("visualiz") || input.includes("plot") || input.includes("diagram")
  ) {
    categories.push("data-visualization");
  }
  if (
    input.includes("security") || input.includes("vulnerab") || input.includes("penetration") ||
    input.includes("threat") || input.includes("firewall") || input.includes("encrypt")
  ) {
    categories.push("cybersecurity");
  }
  if (
    input.includes("support") || input.includes("customer") || input.includes("ticket") ||
    input.includes("help desk") || input.includes("faq") || input.includes("chatbot")
  ) {
    categories.push("customer-support");
  }
  if (
    input.includes("newsletter") || input.includes("drip") || input.includes("campaign") ||
    input.includes("autorespond") || input.includes("mail")
  ) {
    categories.push("email-automation");
  }

  return categories;
}

interface CostEstimatorProps {
  taskInput: string;
}

export function CostEstimator({ taskInput }: CostEstimatorProps) {
  const [agentPrices, setAgentPrices] = useState<Record<string, number> | null>(null);

  // Attempt to fetch real agent prices on mount
  useEffect(() => {
    fetch("/api/agents")
      .then((res) => res.json())
      .then((agents: { category: string; price_per_call: number }[]) => {
        const priceMap: Record<string, number> = {};
        for (const agent of agents) {
          const cat = agent.category;
          if (!priceMap[cat] || agent.price_per_call < priceMap[cat]) {
            priceMap[cat] = agent.price_per_call;
          }
        }
        setAgentPrices(priceMap);
      })
      .catch(() => {
        // Fall back to hardcoded prices
      });
  }, []);

  const detected = useMemo((): DetectedCategory[] => {
    if (!taskInput.trim()) return [];
    const categories = detectCategories(taskInput);
    const prices = agentPrices || CATEGORY_PRICES;
    return categories.map((cat) => ({
      category: cat,
      label: CATEGORY_LABELS[cat] || cat,
      estimatedPrice: (prices[cat] || 0.005) * NEGOTIATION_DISCOUNT,
    }));
  }, [taskInput, agentPrices]);

  if (detected.length === 0) return null;

  const totalEstimate = detected.reduce((sum, d) => sum + d.estimatedPrice, 0);
  const hasCategories = detected.length > 0;

  return (
    <div
      className="mt-4 rounded-xl p-3 transition-all duration-300"
      style={{
        backgroundColor: "var(--bg-secondary)",
        border: `1px solid ${hasCategories ? "var(--accent-blue)" : "var(--border-light)"}`,
        animation: hasCategories ? "pulse-border 2s ease-in-out 1" : "none",
      }}
    >
      <div className="mb-2 flex items-center justify-between">
        <span
          className="text-[10px] font-semibold uppercase tracking-wide"
          style={{ color: "var(--text-tertiary)" }}
        >
          Cost Estimate
        </span>
        <span
          className="rounded-full px-2 py-0.5 text-[10px] font-medium"
          style={{
            backgroundColor: "var(--accent-green-light)",
            color: "var(--accent-green)",
          }}
        >
          -20% negotiated
        </span>
      </div>

      <div className="mb-2 flex flex-wrap gap-1.5">
        {detected.map((d) => {
          const colors = CATEGORY_COLORS[d.category] || {
            bg: "var(--bg-tertiary)",
            text: "var(--text-secondary)",
          };
          return (
            <span
              key={d.category}
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium"
              style={{ backgroundColor: colors.bg, color: colors.text }}
            >
              {d.label}
              <span className="font-mono opacity-75">
                ~${d.estimatedPrice.toFixed(4)}
              </span>
            </span>
          );
        })}
      </div>

      <div
        className="flex items-center justify-between rounded-lg px-3 py-2"
        style={{
          background:
            "linear-gradient(135deg, var(--bg-tertiary) 0%, var(--bg-secondary) 100%)",
          border: "1px solid var(--border-light)",
        }}
      >
        <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
          {detected.length} agent{detected.length !== 1 ? "s" : ""} estimated
        </span>
        <span
          className="font-mono text-sm font-bold"
          style={{ color: "var(--accent-amber)" }}
        >
          ~${totalEstimate.toFixed(4)} USDC
        </span>
      </div>
    </div>
  );
}
