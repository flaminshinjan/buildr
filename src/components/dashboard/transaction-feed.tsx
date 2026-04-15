import { Badge } from "@/components/ui/badge";
import { PriceTag } from "@/components/ui/price-tag";

interface FeedTransaction {
  id: string;
  buyer_name: string;
  seller_name: string;
  amount: number;
  negotiated_from: number | null;
  negotiated_to: number | null;
  status: string;
  task_description: string | null;
  created_at: string;
}

function statusVariant(status: string): "green" | "blue" | "amber" | "red" | "default" {
  switch (status) {
    case "completed":
      return "green";
    case "paid":
      return "blue";
    case "pending":
      return "amber";
    case "failed":
      return "red";
    default:
      return "default";
  }
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}d ago`;
}

export function TransactionFeed({ transactions }: { transactions: FeedTransaction[] }) {
  if (transactions.length === 0) {
    return (
      <div
        className="rounded-xl p-6"
        style={{
          backgroundColor: "var(--bg-primary)",
          border: "1px solid var(--border-light)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <h3 className="text-card-title mb-4" style={{ color: "var(--text-primary)" }}>
          Recent Transactions
        </h3>
        <p className="py-8 text-center text-body" style={{ color: "var(--text-tertiary)" }}>
          No transactions yet. Run a task to see activity.
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl p-6"
      style={{
        backgroundColor: "var(--bg-primary)",
        border: "1px solid var(--border-light)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-card-title" style={{ color: "var(--text-primary)" }}>
          Recent Transactions
        </h3>
        <span className="text-caption" style={{ color: "var(--text-tertiary)" }}>
          Last {transactions.length}
        </span>
      </div>

      <div className="space-y-2">
        {transactions.map((tx) => {
          const negotiated =
            tx.negotiated_from != null &&
            tx.negotiated_to != null &&
            tx.negotiated_from !== tx.negotiated_to;

          return (
            <div
              key={tx.id}
              className="rounded-lg px-4 py-3"
              style={{
                backgroundColor: "var(--bg-secondary)",
                border: "1px solid transparent",
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                      {tx.buyer_name || "Orchestrator"} &rarr; {tx.seller_name || "Agent"}
                    </p>
                    <Badge variant={statusVariant(tx.status)}>{tx.status}</Badge>
                  </div>
                  {tx.task_description && (
                    <p
                      className="mt-1 truncate text-caption"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      {tx.task_description}
                    </p>
                  )}
                  <div className="mt-1 flex items-center gap-3">
                    <span className="text-caption" style={{ color: "var(--text-muted)" }}>
                      {timeAgo(tx.created_at)}
                    </span>
                    {negotiated && (
                      <span className="text-caption" style={{ color: "var(--text-muted)" }}>
                        negotiated ${tx.negotiated_from!.toFixed(4)} &rarr; ${tx.negotiated_to!.toFixed(4)}
                      </span>
                    )}
                  </div>
                </div>
                <PriceTag amount={tx.amount} size="sm" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
