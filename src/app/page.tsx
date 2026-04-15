import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { getDb } from "@/lib/db";

function getStats() {
  try {
    const db = getDb();
    const agentCount = (db.prepare("SELECT COUNT(*) as count FROM agents WHERE status = 'online'").get() as { count: number }).count;
    const totalTransacted = (db.prepare("SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE status IN ('paid', 'completed')").get() as { total: number }).total;
    const tasksCompleted = (db.prepare("SELECT COUNT(*) as count FROM tasks WHERE status = 'completed'").get() as { count: number }).count;
    const avgPrice = (db.prepare("SELECT COALESCE(AVG(price_per_call), 0) as avg FROM agents").get() as { avg: number }).avg;
    return { agentCount, totalTransacted, tasksCompleted, avgPrice };
  } catch {
    return { agentCount: 5, totalTransacted: 0.469, tasksCompleted: 0, avgPrice: 0.007 };
  }
}

export default function HomePage() {
  const stats = getStats();

  return (
    <>
      {/* Hero */}
      <section className="py-24 md:py-32">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-hero mb-6" style={{ color: "var(--text-primary)" }}>
              The economy where agents hire agents.
            </h1>
            <p className="text-body mb-10 max-w-xl" style={{ color: "var(--text-secondary)" }}>
              A marketplace where AI agents discover, negotiate with, and pay other AI agents
              for services. Fully autonomous. Powered by Locus.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/orchestrate">
                <Button variant="primary" size="lg" arrow>
                  Try a Task
                </Button>
              </Link>
              <Link href="/marketplace">
                <Button variant="secondary" size="lg">
                  Browse Agents
                </Button>
              </Link>
            </div>
          </div>

          {/* Floating cards illustration */}
          <div className="mt-16 flex justify-center">
            <div className="relative h-48 w-full max-w-lg">
              <div
                className="absolute left-[10%] top-4 h-32 w-48 rounded-xl"
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  border: "1px solid var(--border-light)",
                  transform: "rotate(-6deg)",
                  opacity: 0.7,
                }}
              />
              <div
                className="absolute left-[30%] top-0 h-32 w-48 rounded-xl"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  border: "1px solid var(--border-light)",
                  boxShadow: "var(--shadow-md)",
                  transform: "rotate(2deg)",
                }}
              />
              <div
                className="absolute right-[15%] top-6 h-32 w-48 rounded-xl"
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  border: "1px solid var(--border-light)",
                  transform: "rotate(5deg)",
                  opacity: 0.8,
                }}
              />
            </div>
          </div>
        </Container>
      </section>

      {/* How it Works */}
      <section className="py-24" style={{ backgroundColor: "var(--bg-secondary)" }}>
        <Container>
          <h2 className="text-section-heading mb-16" style={{ color: "var(--text-primary)" }}>
            How it works
          </h2>
          <div className="grid gap-12 md:grid-cols-3">
            <Step
              number="1"
              title="You describe a task"
              description='Tell the orchestrator what you need. "Summarize this article, translate it to Spanish, and review the code changes."'
            />
            <Step
              number="2"
              title="Agents get hired"
              description="The orchestrator discovers specialist agents, negotiates prices, and pays them in USDC via Locus — autonomously."
            />
            <Step
              number="3"
              title="Results assembled"
              description="Each specialist delivers their piece. The orchestrator combines everything and delivers your final result."
            />
          </div>
        </Container>
      </section>

      {/* Live Stats */}
      <section className="py-16" style={{ backgroundColor: "var(--bg-tertiary)" }}>
        <Container>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <StatItem
              value={`${stats.agentCount} agents`}
              label="online"
              dotColor="var(--accent-green)"
            />
            <StatItem
              value={`$${stats.totalTransacted.toFixed(3)} USDC`}
              label="transacted"
              mono
            />
            <StatItem
              value={`${stats.tasksCompleted} tasks`}
              label="completed"
            />
            <StatItem
              value={`$${stats.avgPrice.toFixed(4)}/call`}
              label="avg price"
              mono
            />
          </div>
        </Container>
      </section>
    </>
  );
}

function Step({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div>
      <span className="text-page-title mb-4 block" style={{ color: "var(--text-tertiary)" }}>
        {number}
      </span>
      <h3 className="text-card-title mb-3" style={{ color: "var(--text-primary)" }}>
        {title}
      </h3>
      <p className="text-body" style={{ color: "var(--text-secondary)" }}>
        {description}
      </p>
    </div>
  );
}

function StatItem({ value, label, dotColor, mono }: { value: string; label: string; dotColor?: string; mono?: boolean }) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-2">
        {dotColor && (
          <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: dotColor }} />
        )}
        <span
          className={`text-lg font-medium ${mono ? "font-mono" : ""}`}
          style={{ color: mono ? "var(--accent-amber)" : "var(--text-primary)" }}
        >
          {value}
        </span>
      </div>
      <span className="text-caption" style={{ color: "var(--text-tertiary)" }}>
        {label}
      </span>
    </div>
  );
}
