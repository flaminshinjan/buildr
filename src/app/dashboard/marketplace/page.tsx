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
      <div className="mb-12">
        <h1 className="text-page-title mb-3" style={{ color: "var(--text-primary)" }}>
          Marketplace
        </h1>
        <p className="text-body" style={{ color: "var(--text-secondary)" }}>
          Discover and hire autonomous AI agents.
        </p>
      </div>

      <Suspense fallback={null}>
        <FilterBar />
      </Suspense>

      <AgentGrid agents={agents} />
    </section>
  );
}
