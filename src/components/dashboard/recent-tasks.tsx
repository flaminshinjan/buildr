import { Badge } from "@/components/ui/badge";
import { PriceTag } from "@/components/ui/price-tag";

interface TaskRow {
  id: string;
  user_input: string;
  status: string;
  sub_task_count: number;
  total_cost: number;
  created_at: string;
  completed_at: string | null;
}

function statusVariant(status: string): "green" | "blue" | "amber" | "red" | "default" {
  switch (status) {
    case "completed":
      return "green";
    case "executing":
    case "hiring":
    case "assembling":
      return "blue";
    case "decomposing":
      return "amber";
    case "failed":
      return "red";
    default:
      return "default";
  }
}

function formatDuration(start: string, end: string | null): string {
  if (!end) return "in progress";
  const ms = new Date(end).getTime() - new Date(start).getTime();
  if (ms < 1000) return `${ms}ms`;
  const sec = Math.floor(ms / 1000);
  if (sec < 60) return `${sec}s`;
  const min = Math.floor(sec / 60);
  const remSec = sec % 60;
  return `${min}m ${remSec}s`;
}

export function RecentTasks({ tasks }: { tasks: TaskRow[] }) {
  if (tasks.length === 0) {
    return (
      <div
        style={{
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border-light)",
          borderRadius: 12,
          padding: 24,
        }}
      >
        <h3
          className="text-card-title mb-4"
          style={{ color: "var(--text-primary)", fontWeight: 700 }}
        >
          Recent Tasks
        </h3>
        <p
          className="py-8 text-center text-body"
          style={{ color: "var(--text-tertiary)" }}
        >
          No tasks have been orchestrated yet.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border-light)",
        borderRadius: 12,
        padding: 24,
      }}
    >
      <div className="mb-6 flex items-center justify-between">
        <h3
          className="text-card-title"
          style={{ color: "var(--text-primary)", fontWeight: 700 }}
        >
          Recent Tasks
        </h3>
        <span className="text-caption" style={{ color: "var(--text-muted)" }}>
          Orchestration history
        </span>
      </div>

      <div className="overflow-x-auto">
        <div
          className="mb-2 grid min-w-[760px] gap-4 rounded-lg px-4 py-2"
          style={{
            gridTemplateColumns: "2fr 110px 90px 110px 110px",
            backgroundColor: "var(--bg-elevated)",
            border: "1px solid var(--border-light)",
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
            }}
          >
            Task
          </span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
            }}
          >
            Status
          </span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              textAlign: "center",
            }}
          >
            Sub-tasks
          </span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              textAlign: "right",
            }}
          >
            Cost
          </span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              textAlign: "right",
            }}
          >
            Duration
          </span>
        </div>

        <div className="min-w-[760px] space-y-1">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="grid items-center gap-4 px-4 py-3 transition-colors duration-200"
              style={{
                gridTemplateColumns: "2fr 110px 90px 110px 110px",
                backgroundColor: "var(--bg-elevated)",
                border: "1px solid var(--border-light)",
                borderRadius: 8,
              }}
            >
              <p
                className="truncate text-sm font-medium"
                style={{ color: "var(--text-primary)" }}
                title={task.user_input}
              >
                {task.user_input}
              </p>
              <div>
                <Badge variant={statusVariant(task.status)}>{task.status}</Badge>
              </div>
              <span
                className="text-center font-mono text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                {task.sub_task_count}
              </span>
              <div className="text-right">
                <PriceTag amount={task.total_cost} size="sm" />
              </div>
              <span
                className="text-right font-mono"
                style={{ fontSize: 12, color: "var(--text-muted)" }}
              >
                {formatDuration(task.created_at, task.completed_at)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
