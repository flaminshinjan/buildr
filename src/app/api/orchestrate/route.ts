import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { orchestrateTask } from "@/agents/orchestrator";
import { OrchestrationEvent } from "@/lib/schema";

export async function POST(request: NextRequest) {
  const { user_input } = await request.json();

  if (!user_input) {
    return new Response(JSON.stringify({ error: "user_input is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const db = getDb();
  const taskId = crypto.randomUUID();

  db.prepare("INSERT INTO tasks (id, user_input) VALUES (?, ?)").run(taskId, user_input);

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (event: OrchestrationEvent) => {
        const data = JSON.stringify({ ...event, task_id: taskId });
        controller.enqueue(encoder.encode(`data: ${data}\n\n`));
      };

      try {
        await orchestrateTask(taskId, user_input, sendEvent);
      } catch (error) {
        sendEvent({
          type: "error",
          timestamp: new Date().toISOString(),
          data: { message: error instanceof Error ? error.message : "Orchestration failed" },
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const taskId = searchParams.get("task_id");

  if (!taskId) {
    return new Response(JSON.stringify({ error: "task_id required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const db = getDb();
  const task = db.prepare("SELECT * FROM tasks WHERE id = ?").get(taskId);

  if (!task) {
    return new Response(JSON.stringify({ error: "Task not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify(task), {
    headers: { "Content-Type": "application/json" },
  });
}
