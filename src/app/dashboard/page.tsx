import { Container } from "@/components/layout/container";
import { EconomyStats } from "@/components/dashboard/economy-stats";
import { CategoryBreakdown } from "@/components/dashboard/category-breakdown";
import { AgentStatusOverview } from "@/components/dashboard/agent-status-overview";
import { AgentLeaderboard } from "@/components/dashboard/agent-leaderboard";
import { TransactionFeed } from "@/components/dashboard/transaction-feed";
import { RecentTasks } from "@/components/dashboard/recent-tasks";
import { getDb } from "@/lib/db";
import { Agent } from "@/lib/schema";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const db = getDb();

  // --- Row 1: Stat cards ---
  const totalAgents = (
    db.prepare("SELECT COUNT(*) as count FROM agents").get() as { count: number }
  ).count;
  const onlineAgents = (
    db.prepare("SELECT COUNT(*) as count FROM agents WHERE status = 'online'").get() as {
      count: number;
    }
  ).count;
  const totalTransacted = (
    db.prepare("SELECT COALESCE(SUM(amount), 0) as total FROM transactions").get() as {
      total: number;
    }
  ).total;
  const tasksCompleted = (
    db.prepare("SELECT COUNT(*) as count FROM tasks WHERE status = 'completed'").get() as {
      count: number;
    }
  ).count;
  const avgCost = (
    db
      .prepare(
        "SELECT COALESCE(AVG(total_cost), 0) as avg FROM tasks WHERE status = 'completed'"
      )
      .get() as { avg: number }
  ).avg;
  const totalCategories = (
    db.prepare("SELECT COUNT(DISTINCT category) as count FROM agents").get() as {
      count: number;
    }
  ).count;

  // --- Row 2: Category breakdown ---
  const categories = db
    .prepare(
      `SELECT category, COUNT(*) as agent_count, COALESCE(SUM(total_earned), 0) as total_earned
       FROM agents GROUP BY category ORDER BY total_earned DESC`
    )
    .all() as { category: string; agent_count: number; total_earned: number }[];

  // --- Row 2: Agent status counts ---
  const statusRows = db
    .prepare("SELECT status, COUNT(*) as count FROM agents GROUP BY status")
    .all() as { status: string; count: number }[];
  const statusCounts = { online: 0, offline: 0, busy: 0 };
  for (const row of statusRows) {
    if (row.status === "online") statusCounts.online = row.count;
    else if (row.status === "offline") statusCounts.offline = row.count;
    else if (row.status === "busy") statusCounts.busy = row.count;
  }

  // --- Row 3: Top earners ---
  const topAgents = db
    .prepare("SELECT * FROM agents ORDER BY total_earned DESC LIMIT 15")
    .all() as Agent[];

  // --- Row 3: Recent transactions ---
  const transactions = db
    .prepare(
      `SELECT t.id, t.amount, t.status, t.created_at, t.negotiated_from, t.negotiated_to, t.task_description,
        buyer.name as buyer_name, seller.name as seller_name
       FROM transactions t
       LEFT JOIN agents buyer ON t.buyer_agent_id = buyer.id
       LEFT JOIN agents seller ON t.seller_agent_id = seller.id
       ORDER BY t.created_at DESC LIMIT 20`
    )
    .all() as {
    id: string;
    amount: number;
    status: string;
    created_at: string;
    negotiated_from: number | null;
    negotiated_to: number | null;
    task_description: string | null;
    buyer_name: string;
    seller_name: string;
  }[];

  // --- Row 4: Recent tasks ---
  const recentTasks = db
    .prepare(
      "SELECT id, user_input, status, sub_tasks, total_cost, created_at, completed_at FROM tasks ORDER BY created_at DESC LIMIT 15"
    )
    .all() as {
    id: string;
    user_input: string;
    status: string;
    sub_tasks: string | null;
    total_cost: number;
    created_at: string;
    completed_at: string | null;
  }[];

  const taskRows = recentTasks.map((t) => {
    let subTaskCount = 0;
    if (t.sub_tasks) {
      try {
        const parsed = JSON.parse(t.sub_tasks);
        subTaskCount = Array.isArray(parsed) ? parsed.length : 0;
      } catch {
        subTaskCount = 0;
      }
    }
    return {
      id: t.id,
      user_input: t.user_input,
      status: t.status,
      sub_task_count: subTaskCount,
      total_cost: t.total_cost,
      created_at: t.created_at,
      completed_at: t.completed_at,
    };
  });

  return (
    <section className="py-10">
      <Container>
        {/* Header */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h1
              className="text-page-title mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              Dashboard
            </h1>
            <p className="text-body" style={{ color: "var(--text-secondary)" }}>
              Real-time analytics for the agent economy.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: "var(--accent-green)" }}
            />
            <span className="text-caption" style={{ color: "var(--text-tertiary)" }}>
              Live
            </span>
          </div>
        </div>

        {/* Row 1: 6 Stat Cards */}
        <EconomyStats
          stats={{
            totalAgents,
            onlineAgents,
            totalTransacted,
            tasksCompleted,
            avgCost,
            totalCategories,
          }}
        />

        {/* Row 2: Category Breakdown (2/3) + Agent Status (1/3) */}
        <div className="mb-8 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <CategoryBreakdown categories={categories} />
          </div>
          <div>
            <AgentStatusOverview counts={statusCounts} />
          </div>
        </div>

        {/* Row 3: Top Earners (1/2) + Recent Transactions (1/2) */}
        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          <AgentLeaderboard agents={topAgents} />
          <TransactionFeed transactions={transactions} />
        </div>

        {/* Row 4: Recent Tasks (full width) */}
        <RecentTasks tasks={taskRows} />
      </Container>
    </section>
  );
}
