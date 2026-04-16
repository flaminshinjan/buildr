"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/* ── Types ───────────────────────────────────────────────────────────── */

interface Transaction {
  id: string;
  amount: number;
  status: string;
  tx_hash: string | null;
  locus_tx_id: string | null;
  buyer_name?: string;
  seller_name?: string;
  created_at: string;
}

interface Agent {
  id: string;
  name: string;
  category: string;
  status: string;
}

interface Metrics {
  onChainTxCount: number;
  totalUsdc: number;
  agentCount: number;
  categoryCount: number;
}

/* ── Icons (inline SVGs) ─────────────────────────────────────────────── */

function IconCheck({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconBolt({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

function IconGlobe({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function IconList({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function IconGift({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="8" width="18" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 12h18M12 8v13M8 8a2 2 0 110-4c2 0 4 4 4 4s2-4 4-4a2 2 0 110 4" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

function IconWallet({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="6" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 10h18M17 15h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function IconExternal({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M14 4h6v6M10 14l10-10M19 13v6a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconArrow({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Page ────────────────────────────────────────────────────────────── */

export default function HackathonPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [txs, setTxs] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [txRes, agentsRes] = await Promise.all([
          fetch("/api/transactions?limit=200"),
          fetch("/api/agents"),
        ]);

        const txData: Transaction[] = txRes.ok ? await txRes.json() : [];
        const agentData: Agent[] = agentsRes.ok ? await agentsRes.json() : [];

        const onChainTxCount = txData.filter((t) => t.tx_hash).length;
        const totalUsdc = txData
          .filter((t) => t.status === "paid" || t.status === "completed")
          .reduce((sum, t) => sum + (t.amount || 0), 0);
        const categoryCount = new Set(agentData.map((a) => a.category)).size;

        setMetrics({
          onChainTxCount,
          totalUsdc,
          agentCount: agentData.length,
          categoryCount,
        });

        setTxs(txData.filter((t) => t.tx_hash).slice(0, 10));
      } catch {
        setMetrics({ onChainTxCount: 0, totalUsdc: 0, agentCount: 0, categoryCount: 0 });
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const demoTask =
    "Summarize this article about AI payments https://www.coindesk.com and translate the summary to Spanish";
  const demoHref = `/dashboard/orchestrate?task=${encodeURIComponent(demoTask)}`;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}
    >
      {/* ── Header ──────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-50 backdrop-blur"
        style={{
          backgroundColor: "rgba(10, 10, 10, 0.8)",
          borderBottom: "1px solid var(--border-light)",
        }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: "var(--accent-lime)" }}
            />
            <span
              className="text-base font-medium tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              buildr
            </span>
          </Link>
          <Link
            href="/"
            className="text-sm transition-opacity hover:opacity-70"
            style={{ color: "var(--text-secondary)" }}
          >
            &#8592; Back to app
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* ── Hero ────────────────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-6 pt-24 pb-20">
          <div className="flex flex-col items-start">
            <div
              className="mb-6 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium"
              style={{
                backgroundColor: "var(--accent-lime-faded)",
                color: "var(--accent-lime)",
                border: "1px solid rgba(203, 255, 59, 0.2)",
              }}
            >
              <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: "var(--accent-lime)" }}
              />
              Submission by flaminshinjan
            </div>

            <h1
              className="mb-6 max-w-4xl"
              style={{
                fontSize: "clamp(40px, 6vw, 68px)",
                fontWeight: 300,
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                color: "var(--text-primary)",
              }}
            >
              Built for the Locus
              <br />
              Paygentic Hackathon
            </h1>

            <p
              className="mb-10 max-w-2xl"
              style={{
                fontSize: 18,
                lineHeight: 1.7,
                color: "var(--text-secondary)",
              }}
            >
              An autonomous agent marketplace where AI agents discover, negotiate with,
              and pay each other in USDC on Base — powered end-to-end by Locus.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all hover:opacity-90"
                style={{
                  backgroundColor: "var(--accent-lime)",
                  color: "var(--text-inverse)",
                }}
              >
                Launch App
                <IconArrow />
              </Link>
              <a
                href="https://github.com/flaminshinjan/buildr"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all hover:opacity-80"
                style={{
                  backgroundColor: "var(--bg-card)",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border-medium)",
                }}
              >
                View on GitHub
                <IconExternal />
              </a>
            </div>
          </div>
        </section>

        {/* ── Live Metrics Strip ──────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-6 pb-24">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <MetricCard
              label="On-chain transactions"
              value={loading ? null : metrics?.onChainTxCount.toString() ?? "0"}
              unit="txs"
              mono
            />
            <MetricCard
              label="Total USDC transacted"
              value={loading ? null : `$${(metrics?.totalUsdc ?? 0).toFixed(3)}`}
              unit="USDC"
              mono
              accent
            />
            <MetricCard
              label="Agents in marketplace"
              value={loading ? null : metrics?.agentCount.toString() ?? "0"}
              unit="agents"
            />
            <MetricCard
              label="Different categories"
              value={loading ? null : metrics?.categoryCount.toString() ?? "0"}
              unit="categories"
            />
          </div>
        </section>

        {/* ── Locus Features ──────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-6 pb-24">
          <SectionHeader
            eyebrow="Locus Integration"
            title="Every Locus primitive, wired end-to-end"
          />

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<IconCheck />}
              title="USDC Payments on Base"
              description="Real pay/send transfers with tx_hash verifiable on Basescan. Agent-to-agent settlement, zero fees."
            />
            <FeatureCard
              icon={<IconBolt />}
              title="Email Payments"
              description="pay/send-email drives escrow-based agent wallets — every agent gets its own email-addressable wallet."
            />
            <FeatureCard
              icon={<IconGlobe />}
              title="Wrapped APIs"
              description="Agents call Firecrawl, Exa, OpenAI, Anthropic, DeepL, Stability AI, Perplexity, Brave, and Deepgram — all billed through one Locus wallet."
            />
            <FeatureCard
              icon={<IconList />}
              title="Transaction History"
              description="Fetched from pay/transactions with a full audit trail. Every payment is traceable."
            />
            <FeatureCard
              icon={<IconGift />}
              title="Gift Code Credits"
              description="gift-code-requests hands out promotional USDC to new agents and demo users."
            />
            <FeatureCard
              icon={<IconWallet />}
              title="Wallet Balance"
              description="Live polling of pay/balance in the UI — the wallet widget updates in real time as agents earn and spend."
            />
          </div>
        </section>

        {/* ── Architecture Diagram ────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-6 pb-24">
          <SectionHeader eyebrow="How it works" title="Orchestration pipeline" />

          <div
            className="rounded-2xl p-6 md:p-10 overflow-x-auto"
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-light)",
            }}
          >
            <pre
              className="font-mono text-xs leading-[1.9] md:text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              <span style={{ color: "var(--accent-blue)" }}>  User submits task</span>
              {"\n"}         │{"\n"}         ▼{"\n"}
              <span style={{ color: "var(--accent-amber)" }}>  Orchestrator (Claude) decomposes into sub-tasks</span>
              {"\n"}         │{"\n"}         ├─►{" "}
              <span style={{ color: "var(--text-primary)" }}>Discover best specialist agent per sub-task</span>
              {"\n"}         │{"\n"}         ├─►{" "}
              <span style={{ color: "var(--text-primary)" }}>Negotiate price (2-round auction, ~20% discount)</span>
              {"\n"}         │{"\n"}         ├─►{" "}
              <span style={{ color: "var(--accent-lime)" }}>Pay in USDC via Locus → real Base tx_hash</span>
              {"\n"}         │{"\n"}         ├─►{" "}
              <span style={{ color: "var(--text-primary)" }}>
                Specialist calls wrapped API (Firecrawl, Exa, etc.)
              </span>
              {"\n"}         │         │{"\n"}         │         └─►{" "}
              <span style={{ color: "var(--accent-lime)" }}>Locus auto-deducts USDC from wallet</span>
              {"\n"}         │{"\n"}         ▼{"\n"}
              <span style={{ color: "var(--accent-green)" }}>  Assemble results → markdown → /playground</span>
            </pre>
          </div>
        </section>

        {/* ── Real On-Chain Transactions ──────────────────────── */}
        <section className="mx-auto max-w-6xl px-6 pb-24">
          <SectionHeader
            eyebrow="Every payment is on-chain"
            title="Real USDC transfers on Base"
          />
          <p
            className="mb-8 max-w-2xl text-sm"
            style={{ color: "var(--text-tertiary)" }}
          >
            These are real USDC transfers on Base. Every link is verifiable on Basescan.
          </p>

          <div
            className="overflow-hidden rounded-xl"
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-light)",
            }}
          >
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-light)" }}>
                  <TableHead>Agent</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Tx Hash</TableHead>
                  <TableHead>Status</TableHead>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid var(--border-light)" }}>
                      <TableCell>
                        <div
                          className="h-4 w-28 rounded animate-pulse-skeleton"
                          style={{ backgroundColor: "var(--bg-elevated)" }}
                        />
                      </TableCell>
                      <TableCell>
                        <div
                          className="h-4 w-16 rounded animate-pulse-skeleton"
                          style={{ backgroundColor: "var(--bg-elevated)" }}
                        />
                      </TableCell>
                      <TableCell>
                        <div
                          className="h-4 w-32 rounded animate-pulse-skeleton"
                          style={{ backgroundColor: "var(--bg-elevated)" }}
                        />
                      </TableCell>
                      <TableCell>
                        <div
                          className="h-4 w-16 rounded animate-pulse-skeleton"
                          style={{ backgroundColor: "var(--bg-elevated)" }}
                        />
                      </TableCell>
                    </tr>
                  ))
                ) : txs.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-10 text-center text-sm"
                      style={{ color: "var(--text-muted)" }}
                    >
                      No on-chain transactions yet — run a task to see them here.
                    </td>
                  </tr>
                ) : (
                  txs.map((tx) => (
                    <tr
                      key={tx.id}
                      style={{ borderBottom: "1px solid var(--border-light)" }}
                    >
                      <TableCell>
                        <span style={{ color: "var(--text-primary)" }}>
                          {tx.seller_name || "Unknown agent"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono" style={{ color: "var(--accent-lime)" }}>
                          ${tx.amount.toFixed(4)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {tx.tx_hash ? (
                          <a
                            href={`https://basescan.org/tx/${tx.tx_hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 font-mono text-xs transition-opacity hover:opacity-70"
                            style={{ color: "var(--accent-blue)" }}
                          >
                            {tx.tx_hash.slice(0, 8)}…{tx.tx_hash.slice(-6)}
                            <IconExternal size={11} />
                          </a>
                        ) : (
                          <span style={{ color: "var(--text-muted)" }}>—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <StatusPill status={tx.status} />
                      </TableCell>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Key Numbers Banner ──────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-6 pb-24">
          <div
            className="rounded-2xl p-8 md:p-12"
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--accent-lime-faded)",
              boxShadow: "0 0 40px rgba(203, 255, 59, 0.05)",
            }}
          >
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              <BannerStat value="50" label="agents" />
              <BannerStat value="17" label="categories" />
              <BannerStat value="9" label="wrapped APIs" />
              <BannerStat value="1" label="Locus wallet" accent />
            </div>
          </div>
        </section>

        {/* ── Tech Stack ──────────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-6 pb-24">
          <SectionHeader eyebrow="Tech Stack" title="What's under the hood" />
          <div
            className="rounded-xl p-6 md:p-8"
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-light)",
            }}
          >
            <ul className="space-y-3">
              <StackItem label="Next.js 16 (App Router) + React 19" />
              <StackItem label="TypeScript + Tailwind CSS v4" />
              <StackItem label="Anthropic Claude for orchestration" />
              <StackItem label="SQLite (better-sqlite3)" />
              <StackItem label="Zustand for background tasks" />
              <StackItem label="Locus SDK (USDC payments, wrapped APIs, gift codes)" />
            </ul>
          </div>
        </section>

        {/* ── Try it ──────────────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-6 pb-24">
          <div
            className="relative overflow-hidden rounded-2xl p-8 md:p-12"
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-medium)",
            }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full"
              style={{
                backgroundColor: "var(--accent-lime-faded)",
                filter: "blur(80px)",
              }}
            />
            <div className="relative">
              <h2
                className="mb-4"
                style={{
                  fontSize: 40,
                  fontWeight: 300,
                  letterSpacing: "-0.02em",
                  color: "var(--text-primary)",
                }}
              >
                Try buildr now
              </h2>
              <p
                className="mb-6 max-w-xl text-sm"
                style={{ color: "var(--text-secondary)", lineHeight: 1.7 }}
              >
                Run the preset demo task — it will orchestrate two agents, negotiate prices,
                pay in USDC, and return an assembled markdown result.
              </p>

              <div
                className="mb-6 rounded-lg p-4 font-mono text-xs md:text-sm"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  border: "1px solid var(--border-light)",
                  color: "var(--text-secondary)",
                }}
              >
                <span style={{ color: "var(--text-muted)" }}>$ task:</span> {demoTask}
              </div>

              <Link
                href={demoHref}
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all hover:opacity-90"
                style={{
                  backgroundColor: "var(--accent-lime)",
                  color: "var(--text-inverse)",
                }}
              >
                Run This Demo
                <IconArrow />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer
        style={{
          borderTop: "1px solid var(--border-light)",
          backgroundColor: "var(--bg-secondary)",
        }}
      >
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-6 py-10 md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: "var(--accent-lime)" }}
            />
            <span className="text-sm" style={{ color: "var(--text-tertiary)" }}>
              Built by flaminshinjan · Paygentic Hackathon 2026 · Source on GitHub
            </span>
          </div>
          <div className="flex items-center gap-5 text-sm">
            <a
              href="https://github.com/flaminshinjan/buildr"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-70"
              style={{ color: "var(--text-secondary)" }}
            >
              GitHub
            </a>
            <a
              href="https://twitter.com/flaminshinjan"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-70"
              style={{ color: "var(--text-secondary)" }}
            >
              Twitter
            </a>
            <Link
              href="/"
              className="transition-opacity hover:opacity-70"
              style={{ color: "var(--text-secondary)" }}
            >
              Home
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ── Sub-components ──────────────────────────────────────────────────── */

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-10">
      <div className="mb-4 flex items-center gap-3">
        <span
          className="inline-block h-4 w-1 rounded-full"
          style={{ backgroundColor: "var(--accent-lime)" }}
        />
        <p
          className="text-xs font-medium uppercase tracking-widest"
          style={{ color: "var(--accent-lime)" }}
        >
          {eyebrow}
        </p>
      </div>
      <h2
        style={{
          fontSize: "clamp(28px, 4vw, 40px)",
          fontWeight: 300,
          letterSpacing: "-0.02em",
          color: "var(--text-primary)",
        }}
      >
        {title}
      </h2>
    </div>
  );
}

function MetricCard({
  label,
  value,
  unit,
  mono,
  accent,
}: {
  label: string;
  value: string | null;
  unit: string;
  mono?: boolean;
  accent?: boolean;
}) {
  return (
    <div
      className="rounded-xl p-5"
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border-light)",
      }}
    >
      <div className="mb-3 text-xs" style={{ color: "var(--text-muted)" }}>
        {label}
      </div>
      <div className="flex items-baseline gap-2">
        {value === null ? (
          <div
            className="h-8 w-24 rounded animate-pulse-skeleton"
            style={{ backgroundColor: "var(--bg-elevated)" }}
          />
        ) : (
          <span
            className={`text-3xl font-semibold ${mono ? "font-mono" : ""}`}
            style={{
              color: accent ? "var(--accent-lime)" : "var(--text-primary)",
              letterSpacing: mono ? "-0.02em" : "-0.01em",
            }}
          >
            {value}
          </span>
        )}
        <span
          className="text-xs font-medium"
          style={{ color: "var(--text-tertiary)" }}
        >
          {unit}
        </span>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div
      className="rounded-xl p-4 transition-all duration-200 hover:scale-[1.01]"
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border-light)",
      }}
    >
      <div className="mb-3 flex items-center gap-2">
        <span
          className="inline-flex h-7 w-7 items-center justify-center rounded-lg"
          style={{
            backgroundColor: "var(--accent-lime-faded)",
            color: "var(--accent-lime)",
          }}
        >
          {icon}
        </span>
        <h3
          className="text-base font-medium"
          style={{ color: "var(--text-primary)" }}
        >
          {title}
        </h3>
      </div>
      <p
        className="text-sm"
        style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}
      >
        {description}
      </p>
    </div>
  );
}

function TableHead({ children }: { children: React.ReactNode }) {
  return (
    <th
      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide"
      style={{ color: "var(--text-muted)" }}
    >
      {children}
    </th>
  );
}

function TableCell({ children }: { children: React.ReactNode }) {
  return <td className="px-6 py-3 text-sm">{children}</td>;
}

function StatusPill({ status }: { status: string }) {
  const color =
    status === "completed"
      ? "var(--accent-green)"
      : status === "paid"
      ? "var(--accent-lime)"
      : status === "failed"
      ? "var(--accent-red)"
      : "var(--accent-amber)";

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
      style={{
        backgroundColor: `color-mix(in srgb, ${color} 12%, transparent)`,
        color,
      }}
    >
      <span
        className="inline-block h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      {status}
    </span>
  );
}

function BannerStat({
  value,
  label,
  accent,
}: {
  value: string;
  label: string;
  accent?: boolean;
}) {
  return (
    <div>
      <div
        className="mb-1 font-mono"
        style={{
          fontSize: "clamp(32px, 5vw, 56px)",
          fontWeight: 500,
          color: accent ? "var(--accent-lime)" : "var(--text-primary)",
          letterSpacing: "-0.02em",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div className="text-sm" style={{ color: "var(--text-tertiary)" }}>
        {label}
      </div>
    </div>
  );
}

function StackItem({ label }: { label: string }) {
  return (
    <li
      className="flex items-center gap-3 text-sm"
      style={{ color: "var(--text-secondary)" }}
    >
      <span
        className="inline-flex h-5 w-5 items-center justify-center rounded-full"
        style={{
          backgroundColor: "var(--accent-lime-faded)",
          color: "var(--accent-lime)",
        }}
      >
        <IconCheck size={12} />
      </span>
      {label}
    </li>
  );
}
