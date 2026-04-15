import { NegotiationStep } from "@/lib/schema";

export function NegotiationLog({ steps, agentName }: { steps: NegotiationStep[]; agentName: string }) {
  return (
    <div className="animate-fade-in space-y-2 pl-4" style={{ borderLeft: "2px solid var(--border-light)" }}>
      {steps.map((step) => (
        <div key={step.round} className="text-xs" style={{ color: "var(--text-tertiary)" }}>
          <span className="font-medium">Round {step.round}:</span>{" "}
          Buyer offers <span className="font-mono">${step.buyer_offer.toFixed(4)}</span>
          {" → "}
          {agentName} counters <span className="font-mono">${step.seller_counter.toFixed(4)}</span>
          {step.accepted && (
            <span className="ml-1 font-medium" style={{ color: "var(--accent-green)" }}>
              ✓ Deal
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
