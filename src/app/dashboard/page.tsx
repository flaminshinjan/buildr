import { Container } from "@/components/layout/container";
import { EconomyStats } from "@/components/dashboard/economy-stats";
import { TransactionFeed } from "@/components/dashboard/transaction-feed";
import { AgentLeaderboard } from "@/components/dashboard/agent-leaderboard";
import { getDb } from "@/lib/db";
import { Agent } from "@/lib/schema";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const db = getDb();

  const totalAgents = (db.prepare("SELECT COUNT(*) as count FROM agents").get() as { count: number }).count;
  const totalTransacted = (db.prepare("SELECT COALESCE(SUM(amount), 0) as total FROM transactions").get() as { total: number }).total;
  const tasksCompleted = (db.prepare("SELECT COUNT(*) as count FROM tasks WHERE status = 'completed'").get() as { count: number }).count;
  const avgCost = (db.prepare("SELECT COALESCE(AVG(total_cost), 0) as avg FROM tasks WHERE status = 'completed'").get() as { avg: number }).avg;

  const transactions = db.prepare(`
    SELECT t.id, t.amount, t.status, t.created_at,
      buyer.name as buyer_name, seller.name as seller_name
    FROM transactions t
    LEFT JOIN agents buyer ON t.buyer_agent_id = buyer.id
    LEFT JOIN agents seller ON t.seller_agent_id = seller.id
    ORDER BY t.created_at DESC LIMIT 20
  `).all() as { id: string; amount: number; status: string; created_at: string; buyer_name: string; seller_name: string }[];

  const topAgents = db.prepare(
    "SELECT * FROM agents ORDER BY total_earned DESC LIMIT 10"
  ).all() as Agent[];

  return (
    <section className="py-16">
      <Container>
        <div className="mb-12">
          <h1 className="text-page-title mb-3" style={{ color: "var(--text-primary)" }}>
            Dashboard
          </h1>
          <p className="text-body" style={{ color: "var(--text-secondary)" }}>
            Live agent economy overview.
          </p>
        </div>

        <EconomyStats stats={{ totalAgents, totalTransacted, tasksCompleted, avgCost }} />

        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-section-heading mb-6" style={{ color: "var(--text-primary)" }}>
              Transaction Feed
            </h2>
            <TransactionFeed transactions={transactions} />
          </div>

          <div>
            <h2 className="text-section-heading mb-6" style={{ color: "var(--text-primary)" }}>
              Agent Leaderboard
            </h2>
            <AgentLeaderboard agents={topAgents} />
          </div>
        </div>
      </Container>
    </section>
  );
}
