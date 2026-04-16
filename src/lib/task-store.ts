"use client";

import { create } from "zustand";
import { OrchestrationEvent } from "@/lib/schema";

export type RunStatus = "running" | "completed" | "error";

export interface RunningTask {
  localId: string;
  taskId?: string; // DB task id (arrives via events from server)
  userInput: string;
  events: OrchestrationEvent[];
  status: RunStatus;
  startedAt: number;
  endedAt?: number;
}

interface TaskStoreState {
  runs: Record<string, RunningTask>;
  order: string[]; // newest first
  activeRunId: string | null; // currently viewed / just-started
  startRun: (userInput: string) => string;
  getActiveRun: () => RunningTask | null;
  setActiveRunId: (id: string | null) => void;
  clearRun: (localId: string) => void;
  clearCompleted: () => void;
}

export const useTaskStore = create<TaskStoreState>((set, get) => ({
  runs: {},
  order: [],
  activeRunId: null,

  setActiveRunId(id) {
    set({ activeRunId: id });
  },

  getActiveRun() {
    const { activeRunId, runs } = get();
    return activeRunId ? runs[activeRunId] ?? null : null;
  },

  clearRun(localId) {
    set((state) => {
      const newRuns = { ...state.runs };
      delete newRuns[localId];
      return {
        runs: newRuns,
        order: state.order.filter((id) => id !== localId),
        activeRunId: state.activeRunId === localId ? null : state.activeRunId,
      };
    });
  },

  clearCompleted() {
    set((state) => {
      const kept: Record<string, RunningTask> = {};
      const newOrder: string[] = [];
      for (const id of state.order) {
        if (state.runs[id].status === "running") {
          kept[id] = state.runs[id];
          newOrder.push(id);
        }
      }
      return { runs: kept, order: newOrder };
    });
  },

  startRun(userInput) {
    const localId = `run_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const initial: RunningTask = {
      localId,
      userInput,
      events: [],
      status: "running",
      startedAt: Date.now(),
    };

    set((state) => ({
      runs: { ...state.runs, [localId]: initial },
      order: [localId, ...state.order],
      activeRunId: localId,
    }));

    // Kick off the SSE stream asynchronously. It lives outside of any React component,
    // so navigating away from the orchestrate page does NOT abort the run.
    void runOrchestration(localId, userInput, set, get);

    return localId;
  },
}));

/* ────────────────────────────────────────────────────────────────────
   Background runner — not tied to any React lifecycle
   ──────────────────────────────────────────────────────────────────── */
async function runOrchestration(
  localId: string,
  userInput: string,
  set: (partial: Partial<TaskStoreState> | ((state: TaskStoreState) => Partial<TaskStoreState>)) => void,
  get: () => TaskStoreState
) {
  function appendEvent(event: OrchestrationEvent) {
    set((state) => {
      const existing = state.runs[localId];
      if (!existing) return {};
      const taskId =
        existing.taskId ||
        (typeof (event.data as Record<string, unknown>)?.task_id === "string"
          ? ((event.data as Record<string, unknown>).task_id as string)
          : undefined);
      return {
        runs: {
          ...state.runs,
          [localId]: {
            ...existing,
            events: [...existing.events, event],
            taskId,
          },
        },
      };
    });
  }

  function markCompleted(status: RunStatus) {
    set((state) => {
      const existing = state.runs[localId];
      if (!existing) return {};
      return {
        runs: {
          ...state.runs,
          [localId]: {
            ...existing,
            status,
            endedAt: Date.now(),
          },
        },
      };
    });
  }

  try {
    const res = await fetch("/api/orchestrate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_input: userInput }),
    });

    if (!res.body) {
      markCompleted("error");
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
            appendEvent(event);
          } catch {
            // skip malformed
          }
        }
      }
    }

    // Determine final status from events
    const run = get().runs[localId];
    const hasError = run?.events.some((e) => e.type === "error");
    markCompleted(hasError ? "error" : "completed");
  } catch (err) {
    appendEvent({
      type: "error",
      timestamp: new Date().toISOString(),
      data: {
        message: err instanceof Error ? err.message : "Failed to connect",
      },
    });
    markCompleted("error");
  }
}
