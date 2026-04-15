"use client";

import { useState } from "react";
import { TaskInput } from "@/components/orchestration/task-input";
import { ExecutionTimeline } from "@/components/orchestration/execution-timeline";
import { OrchestrationEvent } from "@/lib/schema";

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
      <div className="mb-12">
        <h1 className="text-page-title mb-3" style={{ color: "var(--text-primary)" }}>
          Orchestrate
        </h1>
        <p className="text-body" style={{ color: "var(--text-secondary)" }}>
          Submit a task and watch agents get hired, negotiate, and deliver — autonomously.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <TaskInput
            value={taskInput}
            onChange={setTaskInput}
            onSubmit={handleSubmit}
            loading={loading}
          />
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
