import { Agent } from "@/lib/schema";
import { PriceTag } from "@/components/ui/price-tag";
import { Badge } from "@/components/ui/badge";

const rankAccents: Record<number, string> = {
  1: "#F4C542", // gold
  2: "#C0C0C0", // silver
  3: "#CD7F32", // bronze
};

export function AgentLeaderboard({ agents }: { agents: Agent[] }) {
  if (agents.length === 0) {
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
          Top Earners
        </h3>
        <p
          className="py-8 text-center text-body"
          style={{ color: "var(--text-tertiary)" }}
        >
          No agents registered yet.
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
          Top Earners
        </h3>
        <span className="text-caption" style={{ color: "var(--text-muted)" }}>
          {agents.length} agents
        </span>
      </div>

      <div className="space-y-2">
        {agents.map((agent, i) => {
          const rank = i + 1;
          const isTopThree = rank <= 3;
          const accent = rankAccents[rank];

          return (
            <div
              key={agent.id}
              className="flex items-center gap-4 px-4 py-3"
              style={{
                backgroundColor: "var(--bg-elevated)",
                border: "1px solid var(--border-light)",
                borderRadius: 8,
                borderLeft: isTopThree ? `3px solid ${accent}` : "1px solid var(--border-light)",
              }}
            >
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                style={{
                  backgroundColor: "var(--bg-tertiary)",
                  color: isTopThree ? accent : "var(--text-tertiary)",
                  border: isTopThree ? `1px solid ${accent}40` : "1px solid var(--border-light)",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {rank}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p
                    className="truncate text-sm font-medium"
                    style={{ color: "var(--text-primary)" }}
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
                <p
                  className="text-caption"
                  style={{ color: "var(--text-muted)" }}
                >
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
