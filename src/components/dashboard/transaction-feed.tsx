import { Badge } from "@/components/ui/badge";
import { PriceTag } from "@/components/ui/price-tag";

interface FeedTransaction {
  id: string;
  buyer_name: string;
  seller_name: string;
  amount: number;
  status: string;
  created_at: string;
}

export function TransactionFeed({ transactions }: { transactions: FeedTransaction[] }) {
  if (transactions.length === 0) {
    return (
      <p className="py-8 text-center text-body" style={{ color: "var(--text-tertiary)" }}>
        No transactions yet. Run a task to see activity.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((tx) => (
        <div
          key={tx.id}
          className="flex items-center justify-between rounded-lg p-4"
          style={{ backgroundColor: "var(--bg-primary)", border: "1px solid var(--border-light)" }}
        >
          <div>
            <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              {tx.buyer_name || "Orchestrator"} → {tx.seller_name || "Agent"}
            </p>
            <p className="text-caption" style={{ color: "var(--text-tertiary)" }}>
              {new Date(tx.created_at).toLocaleString()}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <PriceTag amount={tx.amount} size="sm" />
            <Badge variant={tx.status === "completed" ? "green" : tx.status === "paid" ? "blue" : "default"}>
              {tx.status}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
}
