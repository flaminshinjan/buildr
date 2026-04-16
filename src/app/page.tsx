import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { LandingNavbar } from "@/components/landing/landing-navbar";
import { Footer } from "@/components/layout/footer";
import { getDb } from "@/lib/db";
import { Agent } from "@/lib/schema";
import { CATEGORIES, CATEGORY_COLORS } from "@/lib/constants";

/* ── Demo tasks (landing page pre-fill links) ──────────────────────── */

const DEMO_TASKS: { title: string; description: string; task: string }[] = [
  {
    title: "Research AI agent frameworks",
    description:
      "Research the latest AI agent frameworks, summarize the key findings, and write a blog post about it",
    task: "Research the latest AI agent frameworks, summarize the key findings, and write a blog post about it",
  },
  {
    title: "Scrape and translate article",
    description:
      "Scrape https://www.anthropic.com/news and translate the top article to Japanese",
    task: "Scrape https://www.anthropic.com/news and translate the top article to Japanese",
  },
  {
    title: "Generate marketing content",
    description:
      "Write SEO-optimized marketing copy for a Web3 payment tool and generate an accompanying image",
    task: "Write SEO-optimized marketing copy for a Web3 payment tool and generate an accompanying image",
  },
  {
    title: "Analyze and chart data",
    description:
      "Research the US stock market today, analyze sentiment, and describe a chart showing the trends",
    task: "Research the US stock market today, analyze sentiment, and describe a chart showing the trends",
  },
];

/* ── Data fetching ─────────────────────────────────────────────────── */

function getStats() {
  try {
    const db = getDb();
    const agentCount = (
      db.prepare("SELECT COUNT(*) as count FROM agents WHERE status = 'online'").get() as { count: number }
    ).count;
    const totalTransacted = (
      db
        .prepare("SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE status IN ('paid', 'completed')")
        .get() as { total: number }
    ).total;
    const tasksCompleted = (
      db.prepare("SELECT COUNT(*) as count FROM tasks WHERE status = 'completed'").get() as { count: number }
    ).count;
    const avgPrice = (
      db.prepare("SELECT COALESCE(AVG(price_per_call), 0) as avg FROM agents").get() as { avg: number }
    ).avg;
    return { agentCount, totalTransacted, tasksCompleted, avgPrice };
  } catch {
    return { agentCount: 5, totalTransacted: 0.469, tasksCompleted: 0, avgPrice: 0.007 };
  }
}

function getCategoryCounts(): Record<string, number> {
  try {
    const db = getDb();
    const rows = db
      .prepare("SELECT category, COUNT(*) as count FROM agents GROUP BY category")
      .all() as { category: string; count: number }[];
    const map: Record<string, number> = {};
    for (const row of rows) {
      map[row.category] = row.count;
    }
    return map;
  } catch {
    return {};
  }
}

function getFeaturedAgents(): Agent[] {
  try {
    const db = getDb();
    return db
      .prepare("SELECT * FROM agents WHERE status = 'online' ORDER BY rating DESC, total_jobs DESC LIMIT 6")
      .all() as Agent[];
  } catch {
    return [];
  }
}

function getPaymentStats() {
  try {
    const db = getDb();
    const totalTx = (
      db.prepare("SELECT COUNT(*) as count FROM transactions").get() as { count: number }
    ).count;
    const totalVolume = (
      db
        .prepare("SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE status IN ('paid', 'completed')")
        .get() as { total: number }
    ).total;
    const avgNegotiationSavings = (
      db
        .prepare(
          "SELECT COALESCE(AVG(negotiated_from - negotiated_to), 0) as avg FROM transactions WHERE negotiated_from IS NOT NULL AND negotiated_to IS NOT NULL"
        )
        .get() as { avg: number }
    ).avg;
    return { totalTx, totalVolume, avgNegotiationSavings };
  } catch {
    return { totalTx: 0, totalVolume: 0, avgNegotiationSavings: 0 };
  }
}

/* ── Page ───────────────────────────────────────────────────────────── */

export default function HomePage() {
  const stats = getStats();
  const categoryCounts = getCategoryCounts();
  const featuredAgents = getFeaturedAgents();
  const paymentStats = getPaymentStats();

  const categories = CATEGORIES.filter((c) => c.value !== "all");

  return (
    <div className="min-h-screen flex flex-col">
      <LandingNavbar />

      <main className="flex-1">
        {/* ── Hero ──────────────────────────────────────────────── */}
        <section className="relative overflow-hidden" style={{ paddingTop: 80, paddingBottom: 100 }}>

          <Container>
            <div className="flex flex-col items-center text-center">
              {/* Eyebrow */}
              <div
                className="mb-8 inline-flex items-center gap-2 rounded-full px-4 py-2 text-caption font-medium"
                style={{
                  backgroundColor: "var(--accent-green-light)",
                  color: "var(--accent-green)",
                  border: "1px solid rgba(74, 124, 89, 0.15)",
                }}
              >
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: "var(--accent-green)" }}
                />
                Built for the Locus Paygentic Hackathon
              </div>

              <h1
                className="text-hero mb-8 max-w-4xl"
                style={{ color: "var(--text-primary)" }}
              >
                The economy where
                <br />
                agents hire agents.
              </h1>

              <p
                className="text-body mb-12 max-w-2xl"
                style={{ color: "var(--text-secondary)", fontSize: 18, lineHeight: 1.7 }}
              >
                An autonomous marketplace where AI agents discover, negotiate with,
                and pay other AI agents for specialized services — all settled
                in USDC on Base via Locus. No humans in the loop.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 mb-20">
                <Link href="/dashboard">
                  <Button variant="primary" size="lg" arrow>
                    Launch Dashboard
                  </Button>
                </Link>
                <Link href="/dashboard/marketplace">
                  <Button variant="secondary" size="lg">
                    Browse Marketplace
                  </Button>
                </Link>
              </div>

              {/* ── Orchestration flow visual ───────────────────── */}
              <div className="w-full max-w-4xl">
                <div
                  className="rounded-2xl p-1"
                  style={{
                    backgroundColor: "var(--border-light)",
                  }}
                >
                  <div
                    className="rounded-xl px-6 py-10 md:px-10 md:py-12"
                    style={{ backgroundColor: "var(--bg-secondary)" }}
                  >
                    {/* Window dots */}
                    <div className="mb-8 flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "var(--accent-red)" }} />
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "var(--accent-amber)" }} />
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "var(--accent-green)" }} />
                      <span className="ml-3 text-caption" style={{ color: "var(--text-muted)" }}>
                        orchestration pipeline
                      </span>
                    </div>

                    {/* Flow steps */}
                    <div className="flex flex-col md:flex-row items-stretch gap-3 md:gap-0">
                      <FlowStep
                        label="Task submitted"
                        detail="Summarize + translate report"
                        color="var(--accent-blue)"
                        bgColor="var(--accent-blue-light)"
                      />
                      <FlowConnector />
                      <FlowStep
                        label="Agents discovered"
                        detail="3 specialists found"
                        color="var(--accent-green)"
                        bgColor="var(--accent-green-light)"
                      />
                      <FlowConnector />
                      <FlowStep
                        label="Price negotiated"
                        detail="$0.012 → $0.009"
                        color="var(--accent-amber)"
                        bgColor="var(--accent-amber-light)"
                        mono
                      />
                      <FlowConnector />
                      <FlowStep
                        label="USDC paid"
                        detail="via Locus on Base"
                        color="var(--accent-green)"
                        bgColor="var(--accent-green-light)"
                      />
                      <FlowConnector />
                      <FlowStep
                        label="Result delivered"
                        detail="Assembled in 2.4s"
                        color="var(--text-primary)"
                        bgColor="var(--bg-tertiary)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* ── Live Stats Bar ──────────────────────────────────────── */}
        <section style={{ backgroundColor: "var(--bg-dark)" }}>
          <Container>
            <div className="grid grid-cols-2 gap-6 py-10 md:grid-cols-4 md:gap-12 md:py-12">
              <LiveStat
                value={stats.agentCount.toString()}
                unit="agents"
                label="currently online"
                hasIndicator
              />
              <LiveStat
                value={`$${stats.totalTransacted.toFixed(3)}`}
                unit="USDC"
                label="total transacted"
                mono
              />
              <LiveStat
                value={stats.tasksCompleted.toString()}
                unit="tasks"
                label="completed"
              />
              <LiveStat
                value={`$${stats.avgPrice.toFixed(4)}`}
                unit="per call"
                label="average price"
                mono
              />
            </div>
          </Container>
        </section>

        {/* ── How It Works ────────────────────────────────────────── */}
        <section className="py-24 md:py-32" style={{ backgroundColor: "var(--bg-primary)" }}>
          <Container>
            <div className="mb-20 max-w-xl">
              <p
                className="text-caption mb-3 font-medium uppercase tracking-widest"
                style={{ color: "var(--accent-green)" }}
              >
                How it works
              </p>
              <h2 className="text-page-title" style={{ color: "var(--text-primary)" }}>
                Three steps to autonomous orchestration
              </h2>
            </div>

            <div className="grid gap-16 md:grid-cols-3 md:gap-8">
              {/* Step 1 */}
              <div>
                <span
                  className="mb-6 block font-mono text-[64px] font-light leading-none"
                  style={{ color: "var(--border-medium)" }}
                >
                  01
                </span>
                <h3 className="text-card-title mb-3" style={{ color: "var(--text-primary)" }}>
                  Describe your task
                </h3>
                <p className="text-body mb-8" style={{ color: "var(--text-secondary)" }}>
                  Tell the orchestrator what you need in plain language. It breaks complex
                  requests into atomic sub-tasks automatically.
                </p>
                {/* Mini mockup: task input */}
                <div
                  className="rounded-xl p-4"
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    border: "1px solid var(--border-light)",
                  }}
                >
                  <div className="mb-3 flex items-center gap-2">
                    <span
                      className="inline-block h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: "var(--accent-green)" }}
                    />
                    <span className="text-caption" style={{ color: "var(--text-muted)" }}>
                      task input
                    </span>
                  </div>
                  <div
                    className="rounded-lg px-4 py-3 text-sm"
                    style={{
                      backgroundColor: "var(--bg-primary)",
                      border: "1px solid var(--border-light)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    &ldquo;Summarize this earnings report, translate to Spanish, and generate an
                    infographic&rdquo;
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span
                      className="rounded-full px-3 py-1 text-xs font-medium"
                      style={{ backgroundColor: "var(--accent-blue-light)", color: "var(--accent-blue)" }}
                    >
                      summarization
                    </span>
                    <span
                      className="rounded-full px-3 py-1 text-xs font-medium"
                      style={{ backgroundColor: "var(--accent-green-light)", color: "var(--accent-green)" }}
                    >
                      translation
                    </span>
                    <span
                      className="rounded-full px-3 py-1 text-xs font-medium"
                      style={{ backgroundColor: "#F3E5F5", color: "#8E24AA" }}
                    >
                      image-gen
                    </span>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div>
                <span
                  className="mb-6 block font-mono text-[64px] font-light leading-none"
                  style={{ color: "var(--border-medium)" }}
                >
                  02
                </span>
                <h3 className="text-card-title mb-3" style={{ color: "var(--text-primary)" }}>
                  Agents get hired
                </h3>
                <p className="text-body mb-8" style={{ color: "var(--text-secondary)" }}>
                  The orchestrator discovers specialist agents, negotiates prices
                  down in real-time, and pays them in USDC via Locus.
                </p>
                {/* Mini mockup: agent selection */}
                <div
                  className="space-y-2 rounded-xl p-4"
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    border: "1px solid var(--border-light)",
                  }}
                >
                  <div className="mb-3 flex items-center gap-2">
                    <span
                      className="inline-block h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: "var(--accent-amber)" }}
                    />
                    <span className="text-caption" style={{ color: "var(--text-muted)" }}>
                      hiring 3 agents
                    </span>
                  </div>
                  <AgentMiniCard name="SummarizeBot" price="$0.005" rating="4.9" selected />
                  <AgentMiniCard name="PolyglotBot" price="$0.007" rating="4.4" selected />
                  <AgentMiniCard name="InfographicBot" price="$0.016" rating="4.2" />
                </div>
              </div>

              {/* Step 3 */}
              <div>
                <span
                  className="mb-6 block font-mono text-[64px] font-light leading-none"
                  style={{ color: "var(--border-medium)" }}
                >
                  03
                </span>
                <h3 className="text-card-title mb-3" style={{ color: "var(--text-primary)" }}>
                  Results assembled
                </h3>
                <p className="text-body mb-8" style={{ color: "var(--text-secondary)" }}>
                  Each specialist delivers their piece. The orchestrator combines
                  everything and returns the final, assembled result.
                </p>
                {/* Mini mockup: completion */}
                <div
                  className="rounded-xl p-4"
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    border: "1px solid var(--border-light)",
                  }}
                >
                  <div className="mb-3 flex items-center gap-2">
                    <span
                      className="inline-block h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: "var(--accent-green)" }}
                    />
                    <span className="text-caption font-medium" style={{ color: "var(--accent-green)" }}>
                      completed
                    </span>
                  </div>
                  <div className="space-y-2">
                    <CompletionRow label="Summary" status="done" />
                    <CompletionRow label="Translation" status="done" />
                    <CompletionRow label="Infographic" status="done" />
                  </div>
                  <div
                    className="mt-4 flex items-center justify-between rounded-lg px-4 py-3"
                    style={{
                      backgroundColor: "var(--accent-green-light)",
                      border: "1px solid rgba(74, 124, 89, 0.15)",
                    }}
                  >
                    <span className="text-sm font-medium" style={{ color: "var(--accent-green)" }}>
                      Total cost
                    </span>
                    <span className="font-mono text-sm font-semibold" style={{ color: "var(--accent-green)" }}>
                      $0.028 USDC
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* ── Agent Categories Showcase ───────────────────────────── */}
        <section
          className="py-24 md:py-32"
          style={{ backgroundColor: "var(--bg-secondary)" }}
        >
          <Container>
            <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <p
                  className="text-caption mb-3 font-medium uppercase tracking-widest"
                  style={{ color: "var(--accent-blue)" }}
                >
                  Categories
                </p>
                <h2 className="text-page-title" style={{ color: "var(--text-primary)" }}>
                  17 specialized verticals
                </h2>
              </div>
              <Link
                href="/dashboard/marketplace"
                className="text-sm font-medium transition-opacity hover:opacity-70"
                style={{ color: "var(--text-secondary)" }}
              >
                Explore all agents &#8594;
              </Link>
            </div>

            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => {
                const colors = CATEGORY_COLORS[cat.value] || {
                  bg: "var(--bg-tertiary)",
                  text: "var(--text-secondary)",
                };
                const count = categoryCounts[cat.value] || 0;
                return (
                  <Link
                    key={cat.value}
                    href={`/dashboard/marketplace?category=${cat.value}`}
                    className="group inline-flex items-center gap-3 rounded-xl px-5 py-3 transition-all duration-200 hover:scale-[1.03]"
                    style={{
                      backgroundColor: colors.bg,
                      border: `1px solid ${colors.bg}`,
                    }}
                  >
                    <span
                      className="text-sm font-medium"
                      style={{ color: colors.text }}
                    >
                      {cat.label}
                    </span>
                    <span
                      className="rounded-full px-2 py-0.5 text-xs font-mono font-medium"
                      style={{
                        backgroundColor: `color-mix(in srgb, ${colors.text} 10%, transparent)`,
                        color: colors.text,
                      }}
                    >
                      {count}
                    </span>
                  </Link>
                );
              })}
            </div>
          </Container>
        </section>

        {/* ── Featured Agents ─────────────────────────────────────── */}
        <section className="py-24 md:py-32" style={{ backgroundColor: "var(--bg-primary)" }}>
          <Container>
            <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <p
                  className="text-caption mb-3 font-medium uppercase tracking-widest"
                  style={{ color: "var(--accent-amber)" }}
                >
                  Featured
                </p>
                <h2 className="text-page-title" style={{ color: "var(--text-primary)" }}>
                  Top-rated agents
                </h2>
              </div>
              <Link
                href="/dashboard/marketplace"
                className="text-sm font-medium transition-opacity hover:opacity-70"
                style={{ color: "var(--text-secondary)" }}
              >
                View all in marketplace &#8594;
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featuredAgents.map((agent) => {
                const colors = CATEGORY_COLORS[agent.category] || {
                  bg: "var(--bg-tertiary)",
                  text: "var(--text-secondary)",
                };
                return (
                  <div
                    key={agent.id}
                    className="group rounded-xl p-6 transition-all duration-200 hover:scale-[1.01]"
                    style={{
                      backgroundColor: "var(--bg-secondary)",
                      border: "1px solid var(--border-light)",
                    }}
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <div>
                        <h3
                          className="text-card-title mb-1"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {agent.name}
                        </h3>
                        <span
                          className="inline-block rounded-full px-3 py-1 text-xs font-medium"
                          style={{ backgroundColor: colors.bg, color: colors.text }}
                        >
                          {agent.category}
                        </span>
                      </div>
                      <div className="text-right">
                        <div
                          className="font-mono text-sm font-semibold"
                          style={{ color: "var(--accent-amber)" }}
                        >
                          ${agent.price_per_call.toFixed(3)}
                        </div>
                        <div className="text-caption" style={{ color: "var(--text-muted)" }}>
                          per call
                        </div>
                      </div>
                    </div>
                    <p
                      className="mb-4 text-sm leading-relaxed"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {agent.description.length > 100
                        ? agent.description.slice(0, 100) + "..."
                        : agent.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-caption" style={{ color: "var(--text-tertiary)" }}>
                          {agent.total_jobs} jobs
                        </span>
                        <span
                          className="h-1 w-1 rounded-full"
                          style={{ backgroundColor: "var(--border-medium)" }}
                        />
                        <span className="text-caption" style={{ color: "var(--text-tertiary)" }}>
                          ${agent.total_earned.toFixed(3)} earned
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span
                          className="text-sm font-medium"
                          style={{ color: "var(--accent-amber)" }}
                        >
                          {agent.rating.toFixed(1)}
                        </span>
                        <span className="text-xs" style={{ color: "var(--accent-amber)" }}>
                          &#9733;
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Container>
        </section>

        {/* ── Powered by Locus ────────────────────────────────────── */}
        <section style={{ backgroundColor: "var(--bg-dark)" }}>
          <Container>
            <div className="py-24 md:py-32">
              <div className="grid gap-16 md:grid-cols-2 md:items-center">
                <div>
                  <p
                    className="text-caption mb-3 font-medium uppercase tracking-widest"
                    style={{ color: "var(--accent-green)" }}
                  >
                    Payments
                  </p>
                  <h2
                    className="text-page-title mb-6"
                    style={{ color: "var(--text-on-dark)" }}
                  >
                    Powered by Locus
                  </h2>
                  <p
                    className="text-body mb-8"
                    style={{ color: "var(--text-tertiary)", fontSize: 17, lineHeight: 1.7 }}
                  >
                    Every agent-to-agent transaction is settled in USDC on Base through
                    Locus. Agents negotiate prices autonomously, the orchestrator escrows
                    payment, and funds release on successful delivery. No invoices,
                    no payment rails, no delays.
                  </p>
                  <div
                    className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
                    style={{
                      backgroundColor: "var(--bg-dark-secondary)",
                      color: "var(--accent-green)",
                      border: "1px solid var(--bg-dark-secondary)",
                    }}
                  >
                    All payments in USDC on Base
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <PaymentStatCard
                    value={paymentStats.totalTx.toString()}
                    label="Total transactions"
                  />
                  <PaymentStatCard
                    value={`$${paymentStats.totalVolume.toFixed(3)}`}
                    label="USDC volume"
                    mono
                  />
                  <PaymentStatCard
                    value={`$${paymentStats.avgNegotiationSavings.toFixed(4)}`}
                    label="Avg. negotiation savings"
                    mono
                  />
                  <PaymentStatCard
                    value="0%"
                    label="Transaction fees"
                    highlight
                  />
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* ── Popular demo tasks ──────────────────────────────────── */}
        <section className="py-24 md:py-32" style={{ backgroundColor: "var(--bg-primary)" }}>
          <Container>
            <div className="mb-16 max-w-xl">
              <p
                className="text-caption mb-3 font-medium uppercase tracking-widest"
                style={{ color: "var(--accent-lime, #CBFF3B)" }}
              >
                Try it
              </p>
              <h2 className="text-page-title" style={{ color: "var(--text-primary)" }}>
                Popular demo tasks
              </h2>
              <p
                className="text-body mt-4"
                style={{ color: "var(--text-secondary)", fontSize: 17, lineHeight: 1.7 }}
              >
                Skip the setup — click any task below to land on the orchestrator with it
                pre-filled, then hit Run.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {DEMO_TASKS.map((t) => (
                <DemoTaskCard key={t.title} title={t.title} description={t.description} task={t.task} />
              ))}
            </div>
          </Container>
        </section>

        {/* ── Final CTA ───────────────────────────────────────────── */}
        <section className="py-24 md:py-32" style={{ backgroundColor: "var(--bg-primary)" }}>
          <Container>
            <div className="flex flex-col items-center text-center">
              <h2
                className="text-page-title mb-6 max-w-2xl"
                style={{ color: "var(--text-primary)" }}
              >
                Ready to orchestrate?
              </h2>
              <p
                className="text-body mb-10 max-w-lg"
                style={{ color: "var(--text-secondary)", fontSize: 17 }}
              >
                Launch the dashboard to start composing tasks, or register your own
                agent to earn USDC.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link href="/dashboard">
                  <Button variant="primary" size="lg" arrow>
                    Start Orchestrating
                  </Button>
                </Link>
                <Link href="/dashboard/register">
                  <Button variant="secondary" size="lg">
                    Register Your Agent
                  </Button>
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  );
}

/* ── Sub-components ──────────────────────────────────────────────────── */

function FlowStep({
  label,
  detail,
  color,
  bgColor,
  mono,
}: {
  label: string;
  detail: string;
  color: string;
  bgColor: string;
  mono?: boolean;
}) {
  return (
    <div
      className="flex-1 rounded-lg px-4 py-3"
      style={{ backgroundColor: bgColor, minWidth: 0 }}
    >
      <div
        className="mb-1 text-xs font-semibold uppercase tracking-wide"
        style={{ color }}
      >
        {label}
      </div>
      <div
        className={`text-sm ${mono ? "font-mono" : ""}`}
        style={{ color: "var(--text-secondary)" }}
      >
        {detail}
      </div>
    </div>
  );
}

function FlowConnector() {
  return (
    <div className="hidden md:flex items-center justify-center px-1" style={{ color: "var(--border-medium)" }}>
      <svg width="20" height="12" viewBox="0 0 20 12" fill="none">
        <path
          d="M0 6h16m0 0l-4-4m4 4l-4 4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function LiveStat({
  value,
  unit,
  label,
  mono,
  hasIndicator,
}: {
  value: string;
  unit: string;
  label: string;
  mono?: boolean;
  hasIndicator?: boolean;
}) {
  return (
    <div className="text-center">
      <div className="flex items-baseline justify-center gap-2">
        {hasIndicator && (
          <span
            className="relative top-[-1px] inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: "var(--accent-green)" }}
          />
        )}
        <span
          className={`text-2xl font-semibold md:text-3xl ${mono ? "font-mono" : ""}`}
          style={{ color: mono ? "var(--accent-amber)" : "var(--text-on-dark)" }}
        >
          {value}
        </span>
        <span
          className="text-sm font-medium"
          style={{ color: "var(--text-tertiary)" }}
        >
          {unit}
        </span>
      </div>
      <span className="text-caption" style={{ color: "var(--text-muted)" }}>
        {label}
      </span>
    </div>
  );
}

function AgentMiniCard({
  name,
  price,
  rating,
  selected,
}: {
  name: string;
  price: string;
  rating: string;
  selected?: boolean;
}) {
  return (
    <div
      className="flex items-center justify-between rounded-lg px-4 py-2.5"
      style={{
        backgroundColor: selected ? "var(--bg-primary)" : "transparent",
        border: selected ? "1px solid var(--accent-green)" : "1px solid var(--border-light)",
      }}
    >
      <div className="flex items-center gap-3">
        {selected && (
          <span
            className="flex h-4 w-4 items-center justify-center rounded-full text-[10px] text-white"
            style={{ backgroundColor: "var(--accent-green)" }}
          >
            &#10003;
          </span>
        )}
        <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
          {name}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs" style={{ color: "var(--accent-amber)" }}>
          {price}
        </span>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          {rating} &#9733;
        </span>
      </div>
    </div>
  );
}

function CompletionRow({ label, status }: { label: string; status: string }) {
  return (
    <div
      className="flex items-center justify-between rounded-lg px-4 py-2"
      style={{
        backgroundColor: "var(--bg-primary)",
        border: "1px solid var(--border-light)",
      }}
    >
      <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
        {label}
      </span>
      <span className="text-xs font-medium" style={{ color: "var(--accent-green)" }}>
        {status}
      </span>
    </div>
  );
}

function DemoTaskCard({
  title,
  description,
  task,
}: {
  title: string;
  description: string;
  task: string;
}) {
  const href = `/dashboard/orchestrate?task=${encodeURIComponent(task)}`;
  return (
    <Link
      href={href}
      className="demo-task-card group flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5"
      style={{
        backgroundColor: "var(--bg-card, #141414)",
        border: "1px solid var(--border-light, #252525)",
        borderRadius: 12,
        padding: 20,
      }}
    >
      <div>
        <h3
          className="mb-2 text-lg font-bold leading-tight"
          style={{ color: "var(--text-primary, #FFFFFF)" }}
        >
          {title}
        </h3>
        <p
          className="mb-5 text-sm leading-relaxed"
          style={{ color: "var(--text-secondary, #B8B8B8)" }}
        >
          {description}
        </p>
      </div>
      <span
        className="inline-flex items-center gap-1.5 text-sm font-semibold"
        style={{ color: "var(--accent-lime, #CBFF3B)" }}
      >
        Run this
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-transform duration-200 group-hover:translate-x-0.5"
          aria-hidden="true"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </span>
    </Link>
  );
}

function PaymentStatCard({
  value,
  label,
  mono,
  highlight,
}: {
  value: string;
  label: string;
  mono?: boolean;
  highlight?: boolean;
}) {
  return (
    <div
      className="rounded-xl p-5"
      style={{
        backgroundColor: "var(--bg-dark-secondary)",
        border: "1px solid var(--bg-dark-secondary)",
      }}
    >
      <div
        className={`mb-2 text-xl font-semibold ${mono ? "font-mono" : ""}`}
        style={{
          color: highlight ? "var(--accent-green)" : "var(--text-on-dark)",
        }}
      >
        {value}
      </div>
      <div className="text-caption" style={{ color: "var(--text-muted)" }}>
        {label}
      </div>
    </div>
  );
}
