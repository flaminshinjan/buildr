import Link from "next/link";
import { Agent } from "@/lib/schema";
import { CATEGORY_COLORS } from "@/lib/constants";
import { StatusDot } from "@/components/ui/status-dot";
import { PriceTag } from "@/components/ui/price-tag";

const STATUS_LABELS: Record<string, string> = {
  online: "Online",
  offline: "Offline",
  busy: "Busy",
};

export function AgentCard({ agent }: { agent: Agent }) {
  const categoryColor = CATEGORY_COLORS[agent.category] || {
    bg: "var(--bg-tertiary)",
    text: "var(--text-secondary)",
  };

  return (
    <Link href={`/dashboard/agent/${agent.id}`} className="block">
      <div
        className="agent-card group overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
        style={{
          borderRadius: 16,
          backgroundColor: "var(--bg-primary)",
          border: "1px solid var(--border-light)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        {/* Colored banner strip */}
        <div
          className="flex items-center justify-end px-4"
          style={{
            height: 40,
            backgroundColor: categoryColor.bg,
          }}
        >
          <div className="flex items-center gap-1.5">
            <StatusDot status={agent.status} size={7} />
            <span
              className="text-xs font-medium"
              style={{ color: categoryColor.text }}
            >
              {STATUS_LABELS[agent.status] || agent.status}
            </span>
          </div>
        </div>

        {/* Main content */}
        <div style={{ padding: 20 }}>
          {/* Agent name */}
          <h3
            className="mb-2"
            style={{
              fontSize: 18,
              fontWeight: 600,
              lineHeight: 1.3,
              color: "var(--text-primary)",
            }}
          >
            {agent.name}
          </h3>

          {/* Category badge */}
          <span
            className="mb-3 inline-flex rounded-full px-3 py-1 text-xs font-medium"
            style={{
              backgroundColor: categoryColor.bg,
              color: categoryColor.text,
            }}
          >
            {agent.category}
          </span>

          {/* Description */}
          <p
            className="mb-5 line-clamp-2"
            style={{
              fontSize: 14,
              lineHeight: 1.6,
              color: "var(--text-secondary)",
            }}
          >
            {agent.description}
          </p>

          {/* Metrics row */}
          <div
            className="grid grid-cols-3 gap-2 pt-4"
            style={{ borderTop: "1px solid var(--border-light)" }}
          >
            <div className="text-center">
              <span
                className="mb-1 block text-caption"
                style={{
                  fontSize: 11,
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.05em",
                  color: "var(--text-muted)",
                }}
              >
                Price
              </span>
              <PriceTag amount={agent.price_per_call} size="sm" />
            </div>
            <div className="text-center">
              <span
                className="mb-1 block"
                style={{
                  fontSize: 11,
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.05em",
                  color: "var(--text-muted)",
                }}
              >
                Rating
              </span>
              <span
                className="text-xs font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                <span style={{ color: "var(--accent-amber)" }}>&#9733;</span>{" "}
                {agent.rating.toFixed(1)}
              </span>
            </div>
            <div className="text-center">
              <span
                className="mb-1 block"
                style={{
                  fontSize: 11,
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.05em",
                  color: "var(--text-muted)",
                }}
              >
                Jobs
              </span>
              <span
                className="text-xs font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                {agent.total_jobs.toLocaleString()}
                <span style={{ color: "var(--text-tertiary)" }}> jobs</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
