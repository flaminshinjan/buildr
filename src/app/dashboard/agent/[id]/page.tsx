import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { PriceTag } from "@/components/ui/price-tag";
import { StatusDot } from "@/components/ui/status-dot";
import { getDb } from "@/lib/db";
import { Agent, Transaction } from "@/lib/schema";
import { CATEGORY_COLORS } from "@/lib/constants";

export default async function AgentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();

  const agent = db.prepare("SELECT * FROM agents WHERE id = ?").get(id) as Agent | undefined;
  if (!agent) notFound();

  const transactions = db.prepare(
    "SELECT * FROM transactions WHERE seller_agent_id = ? ORDER BY created_at DESC LIMIT 20"
  ).all(id) as Transaction[];

  const categoryColor = CATEGORY_COLORS[agent.category] || { bg: "var(--bg-tertiary)", text: "var(--text-secondary)" };

  return (
    <section>
      <Link
        href="/dashboard/marketplace"
        className="mb-8 inline-block text-sm transition-opacity duration-200 hover:opacity-70"
        style={{ color: "var(--text-tertiary)" }}
      >
        ← Back to marketplace
      </Link>

      <div className="mb-8 flex flex-wrap items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-page-title" style={{ color: "var(--text-primary)" }}>
              {agent.name}
            </h1>
            <StatusDot status={agent.status} size={10} />
          </div>
          <div className="flex gap-2 mb-6">
            <span
              className="inline-flex rounded-full px-3 py-1 text-xs font-medium"
              style={{ backgroundColor: categoryColor.bg, color: categoryColor.text }}
            >
              {agent.category}
            </span>
            <Badge variant={agent.status === "online" ? "green" : agent.status === "busy" ? "amber" : "red"}>
              {agent.status}
            </Badge>
          </div>
          <p className="text-body max-w-2xl" style={{ color: "var(--text-secondary)" }}>
            {agent.description}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div
        className="mb-12 grid grid-cols-2 gap-6 rounded-xl p-6 md:grid-cols-4"
        style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-light)" }}
      >
        <StatBlock label="Price per call">
          <PriceTag amount={agent.price_per_call} size="lg" />
        </StatBlock>
        <StatBlock label="Rating">
          <span className="text-lg font-medium" style={{ color: "var(--text-primary)" }}>
            &#9733; {agent.rating.toFixed(1)}
          </span>
        </StatBlock>
        <StatBlock label="Total jobs">
          <span className="text-lg font-medium" style={{ color: "var(--text-primary)" }}>
            {agent.total_jobs}
          </span>
        </StatBlock>
        <StatBlock label="Total earned">
          <PriceTag amount={agent.total_earned} size="lg" />
        </StatBlock>
      </div>

      {/* Transaction History */}
      <h2 className="text-section-heading mb-6" style={{ color: "var(--text-primary)" }}>
        Recent Transactions
      </h2>

      {transactions.length === 0 ? (
        <p className="text-body py-8 text-center" style={{ color: "var(--text-tertiary)" }}>
          No transactions yet.
        </p>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between rounded-lg p-4"
              style={{ backgroundColor: "var(--bg-secondary)", border: "1px solid var(--border-light)" }}
            >
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                  {tx.task_description || "Task"}
                </p>
                <p className="text-caption" style={{ color: "var(--text-tertiary)" }}>
                  {new Date(tx.created_at).toLocaleDateString()}
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
      )}
    </section>
  );
}

function StatBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-caption mb-1" style={{ color: "var(--text-tertiary)" }}>{label}</p>
      {children}
    </div>
  );
}
