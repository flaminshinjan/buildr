"use client";

import { useState } from "react";
import { TaskInput } from "@/components/orchestration/task-input";
import { ExecutionTimeline } from "@/components/orchestration/execution-timeline";
import { CostEstimator } from "@/components/orchestration/cost-estimator";
import { OrchestrationEvent } from "@/lib/schema";

interface TaskTemplate {
  title: string;
  subtitle: string;
  agentCount: number;
  prompt: string;
}

const TASK_TEMPLATES: TaskTemplate[] = [
  {
    title: "Research & Summarize",
    subtitle: "research + summarization + content",
    agentCount: 3,
    prompt:
      "Research the latest trends in AI agent frameworks, summarize the key findings, and create a blog post about it",
  },
  {
    title: "Translate & Localize",
    subtitle: "translation + content",
    agentCount: 2,
    prompt:
      "Translate this product description to Japanese, French, and Spanish while adapting cultural references for each market",
  },
  {
    title: "Security Audit",
    subtitle: "cybersecurity + code-review",
    agentCount: 2,
    prompt:
      "Review this codebase for security vulnerabilities, check for common OWASP issues, and generate a detailed threat assessment report",
  },
  {
    title: "Content Pipeline",
    subtitle: "content + seo + content",
    agentCount: 3,
    prompt:
      "Write a blog post about autonomous AI payments, optimize it for SEO with keyword research, and generate social media posts for Twitter and LinkedIn",
  },
  {
    title: "Data Analysis",
    subtitle: "data-extraction + sentiment + visualization",
    agentCount: 3,
    prompt:
      "Extract key metrics from this quarterly report, analyze sentiment of customer feedback, and create data visualizations for the executive dashboard",
  },
  {
    title: "Full Stack Review",
    subtitle: "code-review + qa-testing + cybersecurity",
    agentCount: 3,
    prompt:
      "Review this pull request for code quality, run regression test scenarios, check for security vulnerabilities, and summarize findings",
  },
];

export default function OrchestratePage() {
  const [taskInput, setTaskInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<OrchestrationEvent[]>([]);

  async function handleSubmit() {
    if (!taskInput.trim()) return;
    setLoading(true);
    setEvents([]);

    try {
      const res = await fetch("/api/orchestrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_input: taskInput }),
      });

      if (!res.body) {
        setLoading(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const event = JSON.parse(line.slice(6)) as OrchestrationEvent;
              setEvents((prev) => [...prev, event]);
            } catch {
              // Skip malformed events
            }
          }
        }
      }
    } catch (err) {
      setEvents((prev) => [
        ...prev,
        {
          type: "error",
          timestamp: new Date().toISOString(),
          data: { message: err instanceof Error ? err.message : "Failed to connect" },
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      {/* Task Templates */}
      <div className="mb-6">
        <h3
          className="mb-3 text-xs font-semibold uppercase tracking-wide"
          style={{ color: "var(--text-tertiary)" }}
        >
          Quick Templates
        </h3>
        <div
          className="flex gap-3 overflow-x-auto pb-2"
          style={{ scrollbarWidth: "thin" }}
        >
          {TASK_TEMPLATES.map((template) => (
            <button
              key={template.title}
              type="button"
              onClick={() => setTaskInput(template.prompt)}
              disabled={loading}
              className="group shrink-0 rounded-xl p-3 text-left transition-all"
              style={{
                backgroundColor: "var(--bg-secondary)",
                border: "1px solid var(--border-light)",
                width: 220,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1,
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.borderColor = "var(--accent-blue)";
                  e.currentTarget.style.boxShadow = "var(--shadow-md)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border-light)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div className="mb-1.5 flex items-center justify-between">
                <span
                  className="text-sm font-bold leading-tight"
                  style={{ color: "var(--text-primary)" }}
                >
                  {template.title}
                </span>
                <span
                  className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                  style={{
                    backgroundColor: "var(--accent-blue-light)",
                    color: "var(--accent-blue)",
                  }}
                >
                  {template.agentCount} agents
                </span>
              </div>
              <span
                className="line-clamp-1 text-xs"
                style={{ color: "var(--text-tertiary)" }}
              >
                {template.subtitle}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <TaskInput
            value={taskInput}
            onChange={setTaskInput}
            onSubmit={handleSubmit}
            loading={loading}
          />
          <CostEstimator taskInput={taskInput} />
        </div>

        <div className="lg:col-span-3">
          <div
            className="rounded-xl p-6"
            style={{
              backgroundColor: "var(--bg-secondary)",
              border: "1px solid var(--border-light)",
              minHeight: 400,
            }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-card-title" style={{ color: "var(--text-primary)" }}>
                Execution Timeline
              </h3>
              {loading && (
                <span className="animate-pulse-skeleton rounded-full px-3 py-1 text-xs" style={{ backgroundColor: "var(--bg-tertiary)" }}>
                  Live
                </span>
              )}
            </div>
            <ExecutionTimeline events={events} />
          </div>

          <div className="mt-4 text-center">
            <span className="text-caption" style={{ color: "var(--text-muted)" }}>
              Powered by Locus · All payments in USDC on Base
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
