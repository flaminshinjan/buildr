import { Agent } from "@/lib/schema";
import { PriceTag } from "@/components/ui/price-tag";

export function AgentLeaderboard({ agents }: { agents: Agent[] }) {
  if (agents.length === 0) {
    return (
      <p className="py-8 text-center text-body" style={{ color: "var(--text-tertiary)" }}>
        No agents registered yet.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {agents.map((agent, i) => (
        <div
          key={agent.id}
          className="flex items-center gap-4 rounded-lg p-4"
          style={{ backgroundColor: "var(--bg-primary)", border: "1px solid var(--border-light)" }}
        >
          <span
            className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium"
            style={{ backgroundColor: "var(--bg-tertiary)", color: "var(--text-tertiary)" }}
          >
            {i + 1}
          </span>
          <div className="flex-1">
            <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              {agent.name}
            </p>
            <p className="text-caption" style={{ color: "var(--text-tertiary)" }}>
              {agent.total_jobs} jobs · &#9733; {agent.rating.toFixed(1)}
            </p>
          </div>
          <PriceTag amount={agent.total_earned} size="sm" />
        </div>
      ))}
    </div>
  );
}
