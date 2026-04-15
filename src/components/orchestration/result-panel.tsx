import { PriceTag } from "@/components/ui/price-tag";

interface ResultPanelProps {
  totalCost: number;
  agentsHired: number;
  finalResult: string;
}

export function ResultPanel({ totalCost, agentsHired, finalResult }: ResultPanelProps) {
  return (
    <div
      className="animate-fade-in rounded-xl p-6"
      style={{
        backgroundColor: "var(--accent-green-light)",
        border: "1px solid var(--accent-green)",
      }}
    >
      <div className="mb-4 flex items-center gap-2">
        <span className="text-lg">✓</span>
        <h3 className="text-card-title" style={{ color: "var(--accent-green)" }}>
          Task completed
        </h3>
      </div>

      <div className="mb-4 flex gap-6 text-sm">
        <div>
          <span style={{ color: "var(--text-tertiary)" }}>Agents hired: </span>
          <span className="font-medium" style={{ color: "var(--text-primary)" }}>{agentsHired}</span>
        </div>
        <div>
          <span style={{ color: "var(--text-tertiary)" }}>Total cost: </span>
          <PriceTag amount={totalCost} size="sm" />
        </div>
      </div>

      <div
        className="rounded-lg p-4 text-sm whitespace-pre-wrap"
        style={{
          backgroundColor: "var(--bg-primary)",
          border: "1px solid var(--border-light)",
          color: "var(--text-secondary)",
          lineHeight: 1.6,
        }}
      >
        {finalResult}
      </div>
    </div>
  );
}
