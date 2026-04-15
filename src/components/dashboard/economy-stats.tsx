import { PriceTag } from "@/components/ui/price-tag";

interface StatsData {
  totalAgents: number;
  onlineAgents: number;
  totalTransacted: number;
  tasksCompleted: number;
  avgCost: number;
  totalCategories: number;
}

interface StatCardConfig {
  label: string;
  accentVar: string;
  accentRgb: string;
  icon: React.ReactNode;
}

function UsersIcon({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function SignalIcon({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 20h.01" />
      <path d="M7 20v-4" />
      <path d="M12 20v-8" />
      <path d="M17 20V8" />
      <path d="M22 20V4" />
    </svg>
  );
}

function DollarCircleIcon({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M16 8h-4a2 2 0 1 0 0 4h2a2 2 0 0 1 0 4H8" />
      <path d="M12 6v2m0 8v2" />
    </svg>
  );
}

function CheckCircleIcon({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function TrendingIcon({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

function GridIcon({ color }: { color: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

const STAT_CARDS: StatCardConfig[] = [
  {
    label: "Total Agents",
    accentVar: "var(--accent-blue)",
    accentRgb: "59, 130, 246",
    icon: <UsersIcon color="var(--accent-blue)" />,
  },
  {
    label: "Online Agents",
    accentVar: "var(--accent-green)",
    accentRgb: "74, 124, 89",
    icon: <SignalIcon color="var(--accent-green)" />,
  },
  {
    label: "USDC Transacted",
    accentVar: "var(--accent-amber)",
    accentRgb: "217, 160, 56",
    icon: <DollarCircleIcon color="var(--accent-amber)" />,
  },
  {
    label: "Tasks Completed",
    accentVar: "var(--accent-green)",
    accentRgb: "74, 124, 89",
    icon: <CheckCircleIcon color="var(--accent-green)" />,
  },
  {
    label: "Avg Task Cost",
    accentVar: "var(--accent-amber)",
    accentRgb: "217, 160, 56",
    icon: <TrendingIcon color="var(--accent-amber)" />,
  },
  {
    label: "Categories",
    accentVar: "var(--accent-blue)",
    accentRgb: "59, 130, 246",
    icon: <GridIcon color="var(--accent-blue)" />,
  },
];

export function EconomyStats({ stats }: { stats: StatsData }) {
  const values: React.ReactNode[] = [
    <span key="ta" className="font-semibold" style={{ fontSize: 28, color: "var(--text-primary)" }}>
      {stats.totalAgents}
    </span>,
    <span key="oa" className="font-semibold" style={{ fontSize: 28, color: "var(--text-primary)" }}>
      {stats.onlineAgents}
    </span>,
    <PriceTag key="tt" amount={stats.totalTransacted} size="lg" />,
    <span key="tc" className="font-semibold" style={{ fontSize: 28, color: "var(--text-primary)" }}>
      {stats.tasksCompleted}
    </span>,
    <PriceTag key="ac" amount={stats.avgCost} size="lg" />,
    <span key="cat" className="font-semibold" style={{ fontSize: 28, color: "var(--text-primary)" }}>
      {stats.totalCategories}
    </span>,
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {STAT_CARDS.map((card, i) => (
        <StatCard key={card.label} config={card}>
          {values[i]}
        </StatCard>
      ))}
    </div>
  );
}

function StatCard({
  config,
  children,
}: {
  config: StatCardConfig;
  children: React.ReactNode;
}) {
  const cardId = `stat-${config.label.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <>
      <style>{`
        #${cardId}:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          border-color: ${config.accentVar} !important;
        }
      `}</style>
      <div
        id={cardId}
        className="relative overflow-hidden transition-all duration-200"
        style={{
          background: `linear-gradient(135deg, rgba(${config.accentRgb}, 0.04) 0%, rgba(${config.accentRgb}, 0.01) 100%)`,
          border: "1px solid var(--border-light)",
          borderRadius: 16,
          padding: 20,
          cursor: "default",
        }}
      >
        {/* Icon circle */}
        <div
          className="mb-3 flex items-center justify-center"
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            backgroundColor: `rgba(${config.accentRgb}, 0.1)`,
          }}
        >
          {config.icon}
        </div>

        {/* Label */}
        <p
          className="mb-1"
          style={{
            fontSize: 12,
            color: "var(--text-tertiary)",
            letterSpacing: "0.01em",
          }}
        >
          {config.label}
        </p>

        {/* Value */}
        {children}
      </div>
    </>
  );
}
