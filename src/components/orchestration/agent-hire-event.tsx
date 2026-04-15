import { PriceTag } from "@/components/ui/price-tag";
import { StatusDot } from "@/components/ui/status-dot";

interface AgentHireEventProps {
  agentName: string;
  category: string;
  askingPrice: number;
  finalPrice: number;
  savingsPercent: number;
  txId: string;
}

export function AgentHireEvent({ agentName, category, askingPrice, finalPrice, savingsPercent, txId }: AgentHireEventProps) {
  return (
    <div
      className="animate-fade-in rounded-xl p-5"
      style={{ backgroundColor: "var(--bg-primary)", border: "1px solid var(--border-light)" }}
    >
      <div className="mb-3 flex items-center gap-3">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium"
          style={{ backgroundColor: "var(--bg-tertiary)", color: "var(--text-secondary)" }}
        >
          {agentName.slice(0, 2)}
        </div>
        <div>
          <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
            {agentName}
          </span>
          <span className="ml-2 text-xs" style={{ color: "var(--text-tertiary)" }}>
            {category}
          </span>
        </div>
        <StatusDot status="online" className="ml-auto" />
      </div>

      <div className="mb-2 flex items-center gap-2 text-sm">
        <span style={{ color: "var(--text-tertiary)" }}>Asking:</span>
        <span className="font-mono line-through" style={{ color: "var(--text-tertiary)" }}>
          ${askingPrice.toFixed(4)}
        </span>
        <span style={{ color: "var(--text-tertiary)" }}>→</span>
        <span className="font-mono font-medium" style={{ color: "var(--accent-green)" }}>
          ${finalPrice.toFixed(4)}
        </span>
        <span className="text-xs" style={{ color: "var(--accent-green)" }}>
          (-{savingsPercent}%)
        </span>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <span style={{ color: "var(--accent-amber)" }}>Paid</span>
        <PriceTag amount={finalPrice} size="sm" />
        <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>via Locus</span>
      </div>

      <p className="mt-2 font-mono text-xs" style={{ color: "var(--text-muted)" }}>
        tx: {txId}
      </p>
    </div>
  );
}
