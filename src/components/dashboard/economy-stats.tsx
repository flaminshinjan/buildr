import { PriceTag } from "@/components/ui/price-tag";

interface StatsData {
  totalAgents: number;
  totalTransacted: number;
  tasksCompleted: number;
  avgCost: number;
}

export function EconomyStats({ stats }: { stats: StatsData }) {
  return (
    <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard label="Total Agents">
        <span className="text-2xl font-medium" style={{ color: "var(--text-primary)" }}>
          {stats.totalAgents}
        </span>
      </StatCard>
      <StatCard label="Total USDC Transacted">
        <PriceTag amount={stats.totalTransacted} size="lg" />
      </StatCard>
      <StatCard label="Tasks Completed">
        <span className="text-2xl font-medium" style={{ color: "var(--text-primary)" }}>
          {stats.tasksCompleted}
        </span>
      </StatCard>
      <StatCard label="Avg Task Cost">
        <PriceTag amount={stats.avgCost} size="lg" />
      </StatCard>
    </div>
  );
}

function StatCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-xl p-6"
      style={{
        backgroundColor: "var(--bg-primary)",
        border: "1px solid var(--border-light)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <p className="text-caption mb-2" style={{ color: "var(--text-tertiary)" }}>{label}</p>
      {children}
    </div>
  );
}
