"use client";

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
    bg: "var(--bg-elevated)",
    text: "var(--text-secondary)",
  };

  return (
    <Link href={`/dashboard/agent/${agent.id}`} className="block">
      <div
        className="agent-card group overflow-hidden transition-colors duration-200"
        style={{
          borderRadius: 12,
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border-light)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--accent-lime)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--border-light)";
        }}
      >
        {/* Thin colored accent strip */}
        <div
          style={{
            height: 2,
            backgroundColor: categoryColor.text,
          }}
        />

        {/* Main content */}
        <div style={{ padding: 20 }}>
          {/* Header row: status */}
          <div className="mb-3 flex items-center gap-1.5">
            <StatusDot status={agent.status} size={7} />
            <span
              className="text-xs font-medium"
              style={{ color: "var(--text-tertiary)" }}
            >
              {STATUS_LABELS[agent.status] || agent.status}
            </span>
          </div>

          {/* Agent name */}
          <h3
            className="mb-2"
            style={{
              fontSize: 18,
              fontWeight: 700,
              lineHeight: 1.3,
              color: "var(--text-primary)",
            }}
          >
            {agent.name}
          </h3>

          {/* Category pill */}
          <span
            className="mb-3 inline-flex rounded-full px-3 py-1 text-xs font-medium"
            style={{
              backgroundColor: `${categoryColor.text}1A`,
              color: categoryColor.text,
              border: `1px solid ${categoryColor.text}33`,
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
                className="mb-1 block"
                style={{
                  fontSize: 11,
                  textTransform: "uppercase" as const,
                  letterSpacing: "0.1em",
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
                  letterSpacing: "0.1em",
                  color: "var(--text-muted)",
                }}
              >
                Rating
              </span>
              <span
                className="font-mono text-xs font-medium"
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
                  letterSpacing: "0.1em",
                  color: "var(--text-muted)",
                }}
              >
                Jobs
              </span>
              <span
                className="font-mono text-xs font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                {agent.total_jobs.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
