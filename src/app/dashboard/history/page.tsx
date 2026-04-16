"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { PriceTag } from "@/components/ui/price-tag";
import { Skeleton } from "@/components/ui/skeleton";

interface SubTask {
  id: string;
  description: string;
  assigned_agent?: string;
  agent_name?: string;
  status?: string;
  result?: string;
  cost?: number;
}

interface Transaction {
  id: string;
  seller_name: string;
  amount: number;
  status: string;
  task_description: string;
  result: string;
  created_at: string;
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
  transactions?: Transaction[];
}

const STATUS_BADGE: Record<string, "green" | "red" | "blue" | "amber" | "default"> = {
  completed: "green",
  failed: "red",
  executing: "blue",
  decomposing: "amber",
  negotiating: "amber",
  assembling: "blue",
};

function formatDuration(start: string, end: string | null): string {
  if (!end) return "In progress";
  const ms = new Date(end).getTime() - new Date(start).getTime();
  if (ms < 1000) return "<1s";
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
}

function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function parseSubTasks(raw: string | null): SubTask[] {
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export default function HistoryPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [detailCache, setDetailCache] = useState<Record<string, Task>>({});
  const [loadingDetail, setLoadingDetail] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/tasks?limit=50")
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function toggleExpand(taskId: string) {
    if (expandedId === taskId) {
      setExpandedId(null);
      return;
    }

    setExpandedId(taskId);

    if (!detailCache[taskId]) {
      setLoadingDetail(taskId);
      try {
        const res = await fetch(`/api/tasks/${taskId}`);
        const data = await res.json();
        setDetailCache((prev) => ({ ...prev, [taskId]: data }));
      } catch {
        // Silently fail — the row just won't have transaction data
      } finally {
        setLoadingDetail(null);
      }
    }
  }

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} height="72px" />
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "48px 24px",
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border-light)",
          borderRadius: 12,
          color: "var(--text-tertiary)",
        }}
      >
        <div style={{ fontSize: 32, marginBottom: 12 }}>&#x29D6;</div>
        <div
          style={{
            fontSize: 16,
            fontWeight: 700,
            marginBottom: 4,
            color: "var(--text-primary)",
          }}
        >
          No tasks yet
        </div>
        <div style={{ fontSize: 14 }}>
          Orchestrated tasks will appear here once you run them.
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {/* Header row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 100px 90px 100px 90px 150px",
          gap: 16,
          padding: "12px 20px",
          fontSize: 11,
          fontWeight: 600,
          color: "var(--text-muted)",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          backgroundColor: "var(--bg-elevated)",
          border: "1px solid var(--border-light)",
          borderRadius: 8,
        }}
      >
        <span>Task</span>
        <span>Status</span>
        <span>Sub-tasks</span>
        <span>Cost</span>
        <span>Duration</span>
        <span>Created</span>
      </div>

      {tasks.map((task) => {
        const subTasks = parseSubTasks(task.sub_tasks);
        const isExpanded = expandedId === task.id;
        const detail = detailCache[task.id];
        const isLoadingThis = loadingDetail === task.id;

        return (
          <div key={task.id}>
            {/* Task row */}
            <div
              onClick={() => toggleExpand(task.id)}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 100px 90px 100px 90px 150px",
                gap: 16,
                alignItems: "center",
                padding: "14px 20px",
                borderRadius: isExpanded ? "8px 8px 0 0" : 8,
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-light)",
                borderBottom: isExpanded ? "none" : "1px solid var(--border-light)",
                cursor: "pointer",
                transition: "background-color 0.15s, border-color 0.15s",
                fontSize: 14,
              }}
              onMouseEnter={(e) => {
                if (!isExpanded) {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "var(--border-medium)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isExpanded) {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "var(--border-light)";
                }
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  minWidth: 0,
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    color: "var(--text-muted)",
                    transition: "transform 0.2s",
                    transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                  }}
                >
                  &#9654;
                </span>
                <span
                  style={{
                    color: "var(--text-primary)",
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {truncate(task.user_input, 60)}
                </span>
              </div>

              <Badge variant={STATUS_BADGE[task.status] || "default"}>
                {task.status}
              </Badge>

              <span
                style={{
                  color: "var(--text-secondary)",
                  fontFamily: "var(--font-mono, monospace)",
                }}
              >
                {subTasks.length}
              </span>

              <PriceTag amount={task.total_cost} size="sm" />

              <span
                style={{
                  color: "var(--text-secondary)",
                  fontSize: 13,
                  fontFamily: "var(--font-mono, monospace)",
                }}
              >
                {formatDuration(task.created_at, task.completed_at)}
              </span>

              <span
                style={{
                  color: "var(--text-muted)",
                  fontSize: 13,
                  fontFamily: "var(--font-mono, monospace)",
                }}
              >
                {formatTimestamp(task.created_at)}
              </span>
            </div>

            {/* Expanded detail */}
            {isExpanded && (
              <div
                style={{
                  border: "1px solid var(--border-light)",
                  borderTop: "none",
                  borderRadius: "0 0 8px 8px",
                  backgroundColor: "var(--bg-elevated)",
                  padding: "20px 24px",
                }}
              >
                {isLoadingThis ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <Skeleton height="16px" width="80%" />
                    <Skeleton height="16px" width="60%" />
                    <Skeleton height="16px" width="70%" />
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    {/* Full task description */}
                    <div>
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          color: "var(--text-muted)",
                          marginBottom: 6,
                        }}
                      >
                        Task Description
                      </div>
                      <div
                        style={{
                          fontSize: 14,
                          color: "var(--text-primary)",
                          lineHeight: 1.6,
                        }}
                      >
                        {task.user_input}
                      </div>
                    </div>

                    {/* Sub-tasks */}
                    {subTasks.length > 0 && (
                      <div>
                        <div
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            color: "var(--text-muted)",
                            marginBottom: 10,
                          }}
                        >
                          Sub-tasks ({subTasks.length})
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 8,
                          }}
                        >
                          {subTasks.map((st, i) => (
                            <div
                              key={st.id || i}
                              style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: 12,
                                padding: "12px 16px",
                                borderRadius: 8,
                                backgroundColor: "var(--bg-card)",
                                border: "1px solid var(--border-light)",
                              }}
                            >
                              <div
                                style={{
                                  minWidth: 24,
                                  height: 24,
                                  borderRadius: "50%",
                                  backgroundColor: "var(--bg-tertiary)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: 11,
                                  fontWeight: 600,
                                  color: "var(--text-secondary)",
                                  flexShrink: 0,
                                  fontFamily: "var(--font-mono, monospace)",
                                }}
                              >
                                {i + 1}
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div
                                  style={{
                                    fontSize: 13,
                                    fontWeight: 500,
                                    color: "var(--text-primary)",
                                    marginBottom: 4,
                                  }}
                                >
                                  {st.description}
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                    fontSize: 12,
                                  }}
                                >
                                  {st.agent_name && (
                                    <span style={{ color: "var(--accent-lime)" }}>
                                      {st.agent_name}
                                    </span>
                                  )}
                                  {st.status && (
                                    <Badge
                                      variant={
                                        STATUS_BADGE[st.status] || "default"
                                      }
                                    >
                                      {st.status}
                                    </Badge>
                                  )}
                                  {st.cost !== undefined && st.cost > 0 && (
                                    <PriceTag amount={st.cost} size="sm" />
                                  )}
                                </div>
                                {st.result && (
                                  <div
                                    style={{
                                      marginTop: 8,
                                      fontSize: 13,
                                      color: "var(--text-secondary)",
                                      lineHeight: 1.5,
                                      whiteSpace: "pre-wrap",
                                    }}
                                  >
                                    {st.result}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Transactions */}
                    {detail?.transactions && detail.transactions.length > 0 && (
                      <div>
                        <div
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            color: "var(--text-muted)",
                            marginBottom: 10,
                          }}
                        >
                          Transactions ({detail.transactions.length})
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 6,
                          }}
                        >
                          {detail.transactions.map((tx) => (
                            <div
                              key={tx.id}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: "10px 16px",
                                borderRadius: 8,
                                backgroundColor: "var(--bg-card)",
                                border: "1px solid var(--border-light)",
                                fontSize: 13,
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 8,
                                }}
                              >
                                <span
                                  style={{
                                    fontWeight: 500,
                                    color: "var(--text-primary)",
                                  }}
                                >
                                  {tx.seller_name}
                                </span>
                                <Badge
                                  variant={
                                    tx.status === "completed"
                                      ? "green"
                                      : tx.status === "failed"
                                        ? "red"
                                        : "amber"
                                  }
                                >
                                  {tx.status}
                                </Badge>
                              </div>
                              <PriceTag amount={tx.amount} size="sm" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Final result */}
                    {task.final_result && (
                      <div>
                        <div
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            color: "var(--text-muted)",
                            marginBottom: 6,
                          }}
                        >
                          Final Result
                        </div>
                        <div
                          style={{
                            padding: "14px 16px",
                            borderRadius: 8,
                            backgroundColor: "var(--bg-card)",
                            border: "1px solid var(--border-light)",
                            fontSize: 14,
                            color: "var(--text-primary)",
                            lineHeight: 1.6,
                            whiteSpace: "pre-wrap",
                          }}
                        >
                          {task.final_result}
                        </div>
                      </div>
                    )}

                    {/* Open in Playground */}
                    <div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/dashboard/playground/${task.id}`);
                        }}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "10px 20px",
                          borderRadius: 9999,
                          backgroundColor: "var(--accent-lime)",
                          color: "var(--text-inverse)",
                          fontSize: 13,
                          fontWeight: 700,
                          border: "none",
                          cursor: "pointer",
                          transition: "background-color 0.15s",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.backgroundColor =
                            "var(--accent-lime-bright)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.backgroundColor =
                            "var(--accent-lime)";
                        }}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                        Open in Playground
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
