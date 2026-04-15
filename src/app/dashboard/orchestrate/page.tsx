"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [taskInput, setTaskInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<OrchestrationEvent[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [completedTaskId, setCompletedTaskId] = useState<string | null>(null);

  const handleTemplateClick = useCallback(
    (template: TaskTemplate) => {
      if (loading) return;
      setTaskInput(template.prompt);
      setSelectedTemplate(template.title);
      setTimeout(() => setSelectedTemplate(null), 600);
    },
    [loading]
  );

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
      // Check for completion event and extract task_id
      setEvents((prev) => {
        const completionEvent = prev.find((e) => e.type === "completion");
        if (completionEvent?.data?.task_id) {
          setCompletedTaskId(completionEvent.data.task_id as string);
        }
        return prev;
      });
    }
  }

  return (
    <section>
      {/* Task Templates — 3-column grid */}
      <div className="mb-6">
        <h3
          className="mb-3 text-xs font-semibold uppercase tracking-wide"
          style={{ color: "var(--text-tertiary)" }}
        >
          Quick Templates
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3">
          {TASK_TEMPLATES.map((template) => {
            const isSelected = selectedTemplate === template.title;
            return (
              <button
                key={template.title}
                type="button"
                onClick={() => handleTemplateClick(template)}
                disabled={loading}
                className="group relative overflow-hidden rounded-xl p-3 text-left transition-all duration-200"
                style={{
                  backgroundColor: isSelected
                    ? "var(--accent-blue-light)"
                    : "var(--bg-primary)",
                  border: `1px solid ${isSelected ? "var(--accent-blue)" : "var(--border-light)"}`,
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.6 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.borderColor = "var(--accent-blue)";
                    e.currentTarget.style.boxShadow =
                      "0 1px 3px rgba(0,0,0,0.08)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = "var(--border-light)";
                  }
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Left accent bar */}
                <div
                  className="absolute left-0 top-0 h-full"
                  style={{
                    width: 3,
                    backgroundColor: "var(--accent-blue)",
                    borderRadius: "3px 0 0 3px",
                  }}
                />
                <div className="pl-2">
                  <div className="mb-1 flex items-center gap-2">
                    <span
                      className="text-sm font-bold leading-tight"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {template.title}
                    </span>
                    <span
                      className="shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none"
                      style={{
                        backgroundColor: "var(--accent-blue-light)",
                        color: "var(--accent-blue)",
                      }}
                    >
                      {template.agentCount}
                    </span>
                  </div>
                  <span
                    className="line-clamp-1 text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {template.subtitle}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main area — 9-col grid */}
      <div className="grid gap-8 lg:grid-cols-9">
        {/* Left panel: Task input + cost estimator */}
        <div className="lg:col-span-4">
          <TaskInput
            value={taskInput}
            onChange={setTaskInput}
            onSubmit={handleSubmit}
            loading={loading}
          />
          <CostEstimator taskInput={taskInput} />
        </div>

        {/* Right panel: Execution timeline */}
        <div className="lg:col-span-5">
          <div
            className="rounded-xl p-6"
            style={{
              backgroundColor: "var(--bg-secondary)",
              border: "1px solid var(--border-light)",
              minHeight: 400,
            }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3
                className="text-card-title"
                style={{ color: "var(--text-primary)" }}
              >
                Execution Timeline
              </h3>
              {loading && (
                <span
                  className="animate-pulse-skeleton rounded-full px-3 py-1 text-xs"
                  style={{ backgroundColor: "var(--bg-tertiary)" }}
                >
                  Live
                </span>
              )}
            </div>
            <ExecutionTimeline events={events} />

            {completedTaskId && (
              <button
                type="button"
                onClick={() =>
                  router.push(`/dashboard/playground/${completedTaskId}`)
                }
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition-all duration-200"
                style={{
                  backgroundColor: "var(--accent-green)",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                View in Playground
              </button>
            )}
          </div>

          <div className="mt-4 text-center">
            <span
              className="text-caption"
              style={{ color: "var(--text-muted)" }}
            >
              Powered by Locus · All payments in USDC on Base
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
