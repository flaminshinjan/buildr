"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { TaskInput } from "@/components/orchestration/task-input";
import { ExecutionTimeline } from "@/components/orchestration/execution-timeline";
import { CostEstimator } from "@/components/orchestration/cost-estimator";
import { useTaskStore } from "@/lib/task-store";

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
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  // Zustand store selectors — subscribe to the background task state
  const activeRunId = useTaskStore((s) => s.activeRunId);
  const runs = useTaskStore((s) => s.runs);
  const startRun = useTaskStore((s) => s.startRun);
  const setActiveRunId = useTaskStore((s) => s.setActiveRunId);

  const activeRun = activeRunId ? runs[activeRunId] : null;
  const loading = activeRun?.status === "running";
  const events = activeRun?.events ?? [];
  const completedTaskId =
    activeRun?.status === "completed" ? activeRun.taskId ?? null : null;

  // Detect any OTHER running tasks (not the one currently focused)
  const otherRunning = useMemo(() => {
    return Object.values(runs).filter(
      (r) => r.status === "running" && r.localId !== activeRunId
    );
  }, [runs, activeRunId]);

  const handleTemplateClick = useCallback(
    (template: TaskTemplate) => {
      if (loading) return;
      setTaskInput(template.prompt);
      setSelectedTemplate(template.title);
      setTimeout(() => setSelectedTemplate(null), 600);
    },
    [loading]
  );

  function handleSubmit() {
    if (!taskInput.trim()) return;
    startRun(taskInput);
  }

  return (
    <section
      style={{
        height: "calc(100vh - 64px - 64px)",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      {/* Background tasks notice — only shown when something else is running */}
      {otherRunning.length > 0 && (
        <div style={{ flexShrink: 0, display: "flex", gap: 8, flexWrap: "wrap" }}>
          {otherRunning.map((run) => (
            <button
              key={run.localId}
              type="button"
              onClick={() => setActiveRunId(run.localId)}
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium transition-colors"
              style={{
                backgroundColor: "var(--accent-lime-faded)",
                color: "var(--accent-lime)",
                border: "1px solid var(--accent-lime)",
                cursor: "pointer",
              }}
              title={run.userInput}
            >
              <span
                className="inline-block rounded-full"
                style={{
                  width: 6,
                  height: 6,
                  backgroundColor: "var(--accent-lime)",
                  boxShadow: "0 0 6px var(--accent-lime)",
                  animation: "pulse-dot 1.5s ease-in-out infinite",
                }}
              />
              Running in background:{" "}
              <span
                style={{
                  maxWidth: 200,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  display: "inline-block",
                  verticalAlign: "middle",
                }}
              >
                {run.userInput}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Templates row — compact, 6 cards in one row on large screens */}
      <div style={{ flexShrink: 0, maxHeight: 100 }}>
        <div className="mb-2 flex items-center gap-2">
          <span
            aria-hidden="true"
            style={{
              display: "inline-block",
              width: 4,
              height: 12,
              backgroundColor: "var(--accent-lime)",
              borderRadius: 2,
              boxShadow: "0 0 6px var(--accent-lime-glow)",
            }}
          />
          <h3
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
            }}
          >
            Quick Templates
          </h3>
        </div>
        <div
          style={{
            display: "flex",
            gap: 12,
            overflowX: "auto",
            paddingBottom: 2,
          }}
        >
          {TASK_TEMPLATES.map((template) => {
            const isSelected = selectedTemplate === template.title;
            return (
              <button
                key={template.title}
                type="button"
                onClick={() => handleTemplateClick(template)}
                disabled={loading}
                className="group relative overflow-hidden rounded-xl p-2.5 text-left transition-colors duration-200"
                style={{
                  backgroundColor: "var(--bg-card)",
                  border: `1px solid ${isSelected ? "var(--accent-lime)" : "var(--border-light)"}`,
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.6 : 1,
                  flex: "0 0 160px",
                  minWidth: 160,
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.borderColor = "var(--accent-lime)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = "var(--border-light)";
                  }
                }}
              >
                {/* Left accent bar */}
                <div
                  className="absolute left-0 top-0 h-full"
                  style={{
                    width: 3,
                    backgroundColor: "var(--accent-lime)",
                    borderRadius: "3px 0 0 3px",
                  }}
                />
                <div className="pl-2">
                  <div className="mb-1 flex items-center gap-2">
                    <span
                      className="line-clamp-1 text-xs font-bold leading-tight"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {template.title}
                    </span>
                    <span
                      className="shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none"
                      style={{
                        backgroundColor: "var(--accent-lime)",
                        color: "var(--text-inverse)",
                      }}
                    >
                      {template.agentCount}
                    </span>
                  </div>
                  <span
                    className="line-clamp-1 text-[11px]"
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

      {/* Main area — fills the remaining viewport height */}
      <div
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "4fr 5fr",
          gap: 24,
          minHeight: 0,
        }}
      >
        {/* Left panel: Task input + cost estimator */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
            overflow: "hidden",
          }}
        >
          <TaskInput
            value={taskInput}
            onChange={setTaskInput}
            onSubmit={handleSubmit}
            loading={loading}
            minHeight={120}
          />
          <CostEstimator taskInput={taskInput} />
        </div>

        {/* Right panel: Execution timeline — the only thing that scrolls */}
        <div
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-light)",
            borderRadius: 12,
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
            flex: 1,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid var(--border-light)",
              flexShrink: 0,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3
              style={{
                color: "var(--text-primary)",
                fontWeight: 700,
                fontSize: 16,
              }}
            >
              Execution Timeline
            </h3>
            {loading && (
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
                style={{
                  backgroundColor: "var(--accent-lime-faded)",
                  color: "var(--accent-lime)",
                  border: "1px solid var(--accent-lime)",
                }}
              >
                <span
                  className="inline-block rounded-full"
                  style={{
                    width: 6,
                    height: 6,
                    backgroundColor: "var(--accent-lime)",
                    boxShadow: "0 0 6px var(--accent-lime)",
                    animation: "pulse-dot 1.5s ease-in-out infinite",
                  }}
                />
                Live
              </span>
            )}
          </div>

          {/* Scrollable events list */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: 20,
              minHeight: 0,
            }}
          >
            <ExecutionTimeline events={events} />
          </div>

          {completedTaskId && (
            <div
              style={{
                padding: 16,
                borderTop: "1px solid var(--border-light)",
                flexShrink: 0,
              }}
            >
              <button
                type="button"
                onClick={() =>
                  router.push(`/dashboard/playground/${completedTaskId}`)
                }
                className="inline-flex w-full items-center justify-center gap-2 rounded-full text-sm font-bold transition-opacity"
                style={{
                  backgroundColor: "var(--accent-lime)",
                  color: "var(--text-inverse)",
                  border: "none",
                  cursor: "pointer",
                  height: 44,
                  padding: "0 20px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "var(--accent-lime-bright)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--accent-lime)";
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                View in Playground
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
