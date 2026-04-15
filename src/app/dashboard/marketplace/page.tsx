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
        className="mb-6 flex flex-wrap items-center gap-6"
        style={{ color: "var(--text-muted)" }}
      >
        <span className="flex items-center gap-1.5 text-sm">
          <span
            className="inline-block rounded-full"
            style={{
              width: 7,
              height: 7,
              backgroundColor: "var(--accent-green)",
            }}
          />
          <span className="font-mono text-sm" style={{ color: "var(--text-secondary)" }}>
            {onlineCount}
          </span>{" "}
          agents online
        </span>
        <span className="text-sm">
          <span className="font-mono text-sm" style={{ color: "var(--text-secondary)" }}>
            {categories.size}
          </span>{" "}
          categories
        </span>
        <span className="text-sm">
          avg{" "}
          <span className="font-mono text-sm" style={{ color: "var(--accent-amber)" }}>
            ${avgPrice.toFixed(4)}
          </span>
          /call
        </span>
      </div>

      <Suspense fallback={null}>
        <FilterBar totalCount={allAgents.length} />
      </Suspense>

      <AgentGrid agents={agents} />
    </section>
  );
}
