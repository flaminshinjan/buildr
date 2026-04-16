import { Suspense } from "react";
import { AgentGrid } from "@/components/marketplace/agent-grid";
import { FilterBar } from "@/components/marketplace/filter-bar";
import { getDb } from "@/lib/db";
import { Agent } from "@/lib/schema";

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const category = params.category;
  const sort = params.sort;

  const db = getDb();

  // Fetch stats for the stat row
  const allAgents = db.prepare("SELECT * FROM agents").all() as Agent[];
  const onlineCount = allAgents.filter((a) => a.status === "online").length;
  const categories = new Set(allAgents.map((a) => a.category));
  const avgPrice =
    allAgents.length > 0
      ? allAgents.reduce((sum, a) => sum + a.price_per_call, 0) / allAgents.length
      : 0;

  // Filtered query
  let query = "SELECT * FROM agents";
  const queryParams: string[] = [];

  if (category && category !== "all") {
    query += " WHERE category = ?";
    queryParams.push(category);
  }

  if (sort === "price_asc") query += " ORDER BY price_per_call ASC";
  else if (sort === "price_desc") query += " ORDER BY price_per_call DESC";
  else if (sort === "rating") query += " ORDER BY rating DESC";
  else if (sort === "jobs") query += " ORDER BY total_jobs DESC";
  else query += " ORDER BY created_at DESC";

  const agents = db.prepare(query).all(...queryParams) as Agent[];

  return (
    <section>
      {/* Stat row */}
      <div
        className="mb-6 flex flex-wrap items-center gap-8"
        style={{
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border-light)",
          borderRadius: 12,
          padding: "16px 20px",
        }}
      >
        <div className="flex items-center gap-3">
          <span
            className="inline-block rounded-full"
            style={{
              width: 8,
              height: 8,
              backgroundColor: "var(--accent-lime)",
              boxShadow: "0 0 6px var(--accent-lime)",
            }}
          />
          <span
            style={{
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
            }}
          >
            Agents Online
          </span>
          <span
            className="font-mono text-sm font-semibold"
            style={{
              color: "var(--text-primary)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {onlineCount}
          </span>
        </div>

        <div
          aria-hidden="true"
          style={{
            width: 1,
            height: 20,
            backgroundColor: "var(--border-light)",
          }}
        />

        <div className="flex items-center gap-3">
          <span
            style={{
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
            }}
          >
            Categories
          </span>
          <span
            className="font-mono text-sm font-semibold"
            style={{
              color: "var(--text-primary)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {categories.size}
          </span>
        </div>

        <div
          aria-hidden="true"
          style={{
            width: 1,
            height: 20,
            backgroundColor: "var(--border-light)",
          }}
        />

        <div className="flex items-center gap-3">
          <span
            style={{
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
            }}
          >
            Avg Price
          </span>
          <span
            className="font-mono text-sm font-semibold"
            style={{
              color: "var(--accent-lime)",
              textShadow: "0 0 12px rgba(203, 255, 59, 0.35)",
            }}
          >
            ${avgPrice.toFixed(4)}
          </span>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            / call
          </span>
        </div>
      </div>

      <Suspense fallback={null}>
        <FilterBar totalCount={allAgents.length} />
      </Suspense>

      <AgentGrid agents={agents} />
    </section>
  );
}
