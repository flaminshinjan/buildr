import { Agent } from "@/lib/schema";
import { PriceTag } from "@/components/ui/price-tag";
import { Badge } from "@/components/ui/badge";

const rankStyles: Record<number, { bg: string; text: string; border: string }> = {
  1: { bg: "#FFF8E1", text: "#B8860B", border: "#E6C547" },
  2: { bg: "#F5F5F5", text: "#6B6B6B", border: "#C0C0C0" },
  3: { bg: "#FFF0E6", text: "#A0522D", border: "#CD7F32" },
};

export function AgentLeaderboard({ agents }: { agents: Agent[] }) {
  if (agents.length === 0) {
    return (
      <div
        className="rounded-xl p-6"
        style={{
          backgroundColor: "var(--bg-primary)",
          border: "1px solid var(--border-light)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <h3 className="text-card-title mb-4" style={{ color: "var(--text-primary)" }}>
          Top Earners
        </h3>
        <p className="py-8 text-center text-body" style={{ color: "var(--text-tertiary)" }}>
          No agents registered yet.
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl p-6"
      style={{
        backgroundColor: "var(--bg-primary)",
        border: "1px solid var(--border-light)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-card-title" style={{ color: "var(--text-primary)" }}>
          Top Earners
        </h3>
        <span className="text-caption" style={{ color: "var(--text-tertiary)" }}>
          {agents.length} agents
        </span>
      </div>

      <div className="space-y-2">
        {agents.map((agent, i) => {
          const rank = i + 1;
          const isTopThree = rank <= 3;
          const style = rankStyles[rank];

          return (
            <div
              key={agent.id}
              className="flex items-center gap-4 rounded-lg px-4 py-3"
              style={{
                backgroundColor: isTopThree ? style.bg : "var(--bg-secondary)",
                border: isTopThree
                  ? `1px solid ${style.border}`
                  : "1px solid transparent",
              }}
            >
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                style={{
                  backgroundColor: isTopThree ? style.border : "var(--bg-tertiary)",
                  color: isTopThree ? "#FFFFFF" : "var(--text-tertiary)",
                }}
              >
                {rank}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p
                    className="truncate text-sm font-medium"
                    style={{ color: isTopThree ? style.text : "var(--text-primary)" }}
                  >
                    {agent.name}
                  </p>
                  <Badge
                    variant={
                      agent.status === "online"
                        ? "green"
                        : agent.status === "busy"
                          ? "amber"
                          : "red"
                    }
                  >
                    {agent.status}
                  </Badge>
                </div>
                <p className="text-caption" style={{ color: "var(--text-tertiary)" }}>
                  {agent.total_jobs} jobs &middot; {agent.rating.toFixed(1)} rating &middot; {agent.category}
                </p>
              </div>
              <PriceTag amount={agent.total_earned} size="sm" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
