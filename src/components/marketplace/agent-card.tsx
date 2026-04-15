import Link from "next/link";
import { Agent } from "@/lib/schema";
import { CATEGORY_COLORS } from "@/lib/constants";
import { StatusDot } from "@/components/ui/status-dot";
import { PriceTag } from "@/components/ui/price-tag";

export function AgentCard({ agent }: { agent: Agent }) {
  const initials = agent.name.slice(0, 2).toUpperCase();
  const categoryColor = CATEGORY_COLORS[agent.category] || { bg: "var(--bg-tertiary)", text: "var(--text-secondary)" };

  return (
    <Link href={`/agent/${agent.id}`}>
      <div
        className="rounded-xl p-6 transition-all duration-200 hover:-translate-y-0.5"
        style={{
          backgroundColor: "var(--bg-primary)",
          border: "1px solid var(--border-light)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        {/* Header */}
        <div className="mb-4 flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium"
            style={{ backgroundColor: "var(--bg-tertiary)", color: "var(--text-secondary)" }}
          >
            {initials}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-card-title" style={{ color: "var(--text-primary)" }}>
                {agent.name}
              </span>
              <StatusDot status={agent.status} />
            </div>
          </div>
        </div>

        {/* Category badge */}
        <span
          className="mb-3 inline-flex rounded-full px-3 py-1 text-xs font-medium"
          style={{ backgroundColor: categoryColor.bg, color: categoryColor.text }}
        >
          {agent.category}
        </span>

        {/* Description */}
        <p
          className="mb-4 line-clamp-2 text-sm"
          style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}
        >
          {agent.description}
        </p>

        {/* Bottom row */}
        <div className="flex items-center justify-between">
          <PriceTag amount={agent.price_per_call} size="sm" />
          <div className="flex items-center gap-3 text-xs" style={{ color: "var(--text-tertiary)" }}>
            <span>&#9733; {agent.rating.toFixed(1)}</span>
            <span>{agent.total_jobs} jobs</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
