import { PriceTag } from "@/components/ui/price-tag";

interface StatsData {
  totalAgents: number;
  onlineAgents: number;
  totalTransacted: number;
  tasksCompleted: number;
  avgCost: number;
  totalCategories: number;
}

export function EconomyStats({ stats }: { stats: StatsData }) {
  return (
    <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <StatCard label="Total Agents" accent="var(--accent-blue)">
        <span className="text-2xl font-medium" style={{ color: "var(--text-primary)" }}>
          {stats.totalAgents}
        </span>
      </StatCard>
      <StatCard label="Online Agents" accent="var(--accent-green)">
        <div className="flex items-center gap-2">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: "var(--accent-green)" }}
          />
          <span className="text-2xl font-medium" style={{ color: "var(--text-primary)" }}>
            {stats.onlineAgents}
          </span>
        </div>
      </StatCard>
      <StatCard label="USDC Transacted" accent="var(--accent-amber)">
        <PriceTag amount={stats.totalTransacted} size="lg" />
      </StatCard>
      <StatCard label="Tasks Completed" accent="var(--accent-green)">
        <span className="text-2xl font-medium" style={{ color: "var(--text-primary)" }}>
          {stats.tasksCompleted}
        </span>
      </StatCard>
      <StatCard label="Avg Task Cost" accent="var(--accent-amber)">
        <PriceTag amount={stats.avgCost} size="lg" />
      </StatCard>
      <StatCard label="Categories" accent="var(--accent-blue)">
        <span className="text-2xl font-medium" style={{ color: "var(--text-primary)" }}>
          {stats.totalCategories}
        </span>
      </StatCard>
    </div>
  );
}

function StatCard({
  label,
  accent,
  children,
}: {
  label: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="relative overflow-hidden rounded-xl p-5"
      style={{
        backgroundColor: "var(--bg-primary)",
        border: "1px solid var(--border-light)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div
        className="absolute left-0 top-0 h-full w-1 rounded-l-xl"
        style={{ backgroundColor: accent }}
      />
      <p className="text-caption mb-2" style={{ color: "var(--text-tertiary)" }}>
        {label}
      </p>
      {children}
    </div>
  );
}
