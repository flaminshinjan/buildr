"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PriceTag } from "@/components/ui/price-tag";
import { Badge } from "@/components/ui/badge";
import { useTaskStore } from "@/lib/task-store";

interface SubTask {
  id?: string;
  description?: string;
  status?: string;
}

interface Task {
  id: string;
  user_input: string;
  status: string;
  sub_tasks: string | null;
  final_result: string | null;
  total_cost: number;
  created_at: string;
  completed_at: string | null;
}

const STATUS_BADGE: Record<string, "green" | "red" | "amber" | "default"> = {
  completed: "green",
  failed: "red",
  executing: "amber",
  decomposing: "amber",
  negotiating: "amber",
  assembling: "amber",
  pending: "amber",
};

function parseSubTasks(raw: string | null): SubTask[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function formatRelativeTime(iso: string | null): string {
  if (!iso) return "—";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "—";
  const diff = Date.now() - then;
  if (diff < 0) return "just now";
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}w ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(days / 365);
  return `${years}y ago`;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: "var(--text-muted)",
      }}
    >
      {children}
    </div>
  );
}

function Spinner() {
  return (
    <span
      style={{
        display: "inline-block",
        width: 14,
        height: 14,
        borderRadius: "50%",
        border: "2px solid var(--border-medium)",
        borderTopColor: "var(--accent-lime)",
        animation: "playground-spin 0.8s linear infinite",
        flexShrink: 0,
      }}
    />
  );
}

function TaskCardSkeleton() {
  return (
    <div
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border-light)",
        borderRadius: 12,
        padding: 20,
        minHeight: 180,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <div
        style={{
          height: 14,
          width: "70%",
          borderRadius: 4,
          backgroundColor: "var(--bg-elevated)",
        }}
      />
      <div
        style={{
          height: 14,
          width: "45%",
          borderRadius: 4,
          backgroundColor: "var(--bg-elevated)",
        }}
      />
      <div style={{ flex: 1 }} />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            height: 20,
            width: 80,
            borderRadius: 9999,
            backgroundColor: "var(--bg-elevated)",
          }}
        />
        <div
          style={{
            height: 16,
            width: 60,
            borderRadius: 4,
            backgroundColor: "var(--bg-elevated)",
          }}
        />
      </div>
    </div>
  );
}

function TaskCard({ task }: { task: Task }) {
  const [hovered, setHovered] = useState(false);
  const subTasks = parseSubTasks(task.sub_tasks);
  const badgeVariant = STATUS_BADGE[task.status] || "default";

  return (
    <Link
      href={`/dashboard/playground/${task.id}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "var(--bg-card)",
        border: `1px solid ${hovered ? "var(--accent-lime)" : "var(--border-light)"}`,
        borderRadius: 12,
        padding: 20,
        textDecoration: "none",
        color: "var(--text-primary)",
        transition: "border-color 160ms ease, box-shadow 160ms ease",
        boxShadow: hovered ? "0 0 0 1px var(--accent-lime-glow), 0 0 24px var(--accent-lime-glow)" : "none",
        minHeight: 180,
        gap: 12,
      }}
    >
      {/* Description (truncated to 2 lines) */}
      <div
        style={{
          fontSize: 14,
          fontWeight: 500,
          color: "var(--text-primary)",
          lineHeight: 1.5,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          wordBreak: "break-word",
        }}
      >
        {task.user_input}
      </div>

      {/* Status + sub-task count */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <Badge variant={badgeVariant}>{task.status}</Badge>
        <span
          style={{
            fontSize: 12,
            color: "var(--text-secondary)",
            fontFamily: "var(--font-mono, monospace)",
          }}
        >
          {subTasks.length} sub-{subTasks.length === 1 ? "task" : "tasks"}
        </span>
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Footer — cost + relative time */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: 12,
          borderTop: "1px solid var(--border-light)",
        }}
      >
        <PriceTag amount={task.total_cost || 0} size="sm" />
        <span
          style={{
            fontSize: 12,
            color: "var(--text-muted)",
            fontFamily: "var(--font-mono, monospace)",
          }}
        >
          {formatRelativeTime(task.completed_at || task.created_at)}
        </span>
      </div>
    </Link>
  );
}

function RunningTasksSection() {
  const router = useRouter();
  const runs = useTaskStore((s) => s.runs);
  const order = useTaskStore((s) => s.order);
  const setActiveRunId = useTaskStore((s) => s.setActiveRunId);

  const runningIds = order.filter((id) => runs[id]?.status === "running");
  if (runningIds.length === 0) return null;

  return (
    <section
      style={{ display: "flex", flexDirection: "column", gap: 12 }}
    >
      <SectionLabel>Running now</SectionLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {runningIds.map((id) => {
          const run = runs[id];
          if (!run) return null;
          return (
            <div
              key={id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 16px",
                borderRadius: 12,
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-light)",
              }}
            >
              <Spinner />
              <div
                style={{
                  flex: 1,
                  minWidth: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <span
                  style={{
                    fontSize: 14,
                    color: "var(--text-primary)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {run.userInput}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    color: "var(--text-muted)",
                    fontFamily: "var(--font-mono, monospace)",
                  }}
                >
                  {run.events.length} events · started{" "}
                  {formatRelativeTime(new Date(run.startedAt).toISOString())}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveRunId(id);
                  router.push("/dashboard/orchestrate");
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 14px",
                  borderRadius: 9999,
                  backgroundColor: "var(--accent-lime)",
                  color: "var(--text-inverse)",
                  fontSize: 12,
                  fontWeight: 700,
                  border: "none",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                View live
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default function PlaygroundIndexPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/tasks?limit=50")
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        setTasks(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 28,
      }}
    >
      {/* Keyframes for spinner */}
      <style>{`
        @keyframes playground-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Hero header */}
      <header
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: 28,
            fontWeight: 700,
            color: "var(--text-primary)",
            letterSpacing: "-0.02em",
            lineHeight: 1.15,
          }}
        >
          Agent Playground
        </h1>
        <p
          style={{
            margin: 0,
            fontSize: 14,
            color: "var(--text-secondary)",
            lineHeight: 1.5,
          }}
        >
          Select a completed task to view agent outputs and on-chain payments
        </p>
      </header>

      {/* Running tasks */}
      <RunningTasksSection />

      {/* Completed tasks grid */}
      <section
        style={{ display: "flex", flexDirection: "column", gap: 12 }}
      >
        <SectionLabel>All tasks</SectionLabel>

        {loading ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 16,
            }}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <TaskCardSkeleton key={i} />
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "64px 24px",
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-light)",
              borderRadius: 12,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                fontSize: 22,
                fontWeight: 600,
                color: "var(--text-muted)",
                letterSpacing: "-0.01em",
                lineHeight: 1.3,
              }}
            >
              No tasks yet. Run your first orchestration.
            </div>
            <Link
              href="/dashboard/orchestrate"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "10px 22px",
                borderRadius: 9999,
                backgroundColor: "var(--accent-lime)",
                color: "var(--text-inverse)",
                fontSize: 14,
                fontWeight: 700,
                textDecoration: "none",
                letterSpacing: "-0.01em",
              }}
            >
              Go to Orchestrate
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 16,
            }}
          >
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
