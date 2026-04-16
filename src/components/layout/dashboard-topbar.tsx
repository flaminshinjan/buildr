"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTaskStore } from "@/lib/task-store";

const PAGE_META: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": {
    title: "Overview",
    subtitle: "Real-time platform analytics",
  },
  "/dashboard/marketplace": {
    title: "Marketplace",
    subtitle: "50 autonomous AI agents",
  },
  "/dashboard/orchestrate": {
    title: "Orchestrate",
    subtitle: "Submit tasks and watch agents work",
  },
  "/dashboard/history": {
    title: "History",
    subtitle: "Past orchestration runs",
  },
  "/dashboard/register": {
    title: "Register",
    subtitle: "Add your agent to the marketplace",
  },
  "/dashboard/playground": {
    title: "Agent Playground",
    subtitle: "View agent outputs and payment details",
  },
  "/dashboard/transactions": {
    title: "Transactions",
    subtitle: "On-chain USDC payment history",
  },
};

function SearchIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="6" cy="6" r="4.75" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M9.5 9.5L12.5 12.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PlusGlyph() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 2V10M2 6H10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function DashboardTopbar() {
  const pathname = usePathname();
  const router = useRouter();
  const runs = useTaskStore((s) => s.runs);
  const order = useTaskStore((s) => s.order);
  const setActiveRunId = useTaskStore((s) => s.setActiveRunId);
  const runningTasks = order.filter((id) => runs[id]?.status === "running");

  const isAgentDetail = pathname.startsWith("/dashboard/agent/");
  const isPlayground = pathname.startsWith("/dashboard/playground/");
  const isOnOrchestrate = pathname.startsWith("/dashboard/orchestrate");

  function handleRunningClick() {
    if (runningTasks.length > 0) {
      setActiveRunId(runningTasks[0]);
      router.push("/dashboard/orchestrate");
    }
  }

  const meta = isAgentDetail
    ? { title: "Agent Detail", subtitle: "Performance and transaction history" }
    : isPlayground
      ? {
          title: "Agent Playground",
          subtitle: "View agent outputs and payment details",
        }
      : PAGE_META[pathname] ?? { title: "Dashboard", subtitle: "" };

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 30,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 64,
        padding: "0 32px",
        borderBottom: "1px solid var(--border-light)",
        backgroundColor: "var(--bg-primary)",
      }}
    >
      {/* Left — title + subtitle */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          minWidth: 0,
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: 20,
            fontWeight: 700,
            color: "var(--text-primary)",
            letterSpacing: "-0.015em",
            lineHeight: 1.2,
          }}
        >
          {meta.title}
        </h1>
        {meta.subtitle && (
          <span
            style={{
              fontSize: 13,
              color: "var(--text-muted)",
              lineHeight: 1.2,
            }}
          >
            {meta.subtitle}
          </span>
        )}
      </div>

      {/* Right — running indicator + search + new task */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        {/* Pulsing-dot keyframes (scoped via unique name) */}
        <style>{`
          @keyframes topbar-running-pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.45; transform: scale(0.7); }
          }
        `}</style>

        {/* Running tasks pill — only when there are running tasks */}
        {runningTasks.length > 0 && (
          <button
            type="button"
            onClick={handleRunningClick}
            aria-label={`${runningTasks.length} task${runningTasks.length === 1 ? "" : "s"} running — view latest`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              height: 28,
              padding: "0 12px",
              borderRadius: 9999,
              backgroundColor: "var(--accent-lime)",
              color: "var(--text-inverse)",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "-0.01em",
              border: "none",
              cursor: "pointer",
              transition: "box-shadow 150ms ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 0 0 1px var(--accent-lime-glow), 0 0 16px var(--accent-lime-glow)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "var(--text-inverse)",
                animation: "topbar-running-pulse 1.2s ease-in-out infinite",
              }}
            />
            {runningTasks.length} running
          </button>
        )}

        {/* Search pill (decorative) */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            width: 200,
            height: 36,
            padding: "0 14px",
            borderRadius: 9999,
            backgroundColor: "var(--bg-elevated)",
            border: "1px solid var(--border-light)",
            color: "var(--text-muted)",
            cursor: "default",
          }}
        >
          <SearchIcon />
          <span
            style={{
              fontSize: 13,
              color: "var(--text-muted)",
              userSelect: "none",
              whiteSpace: "nowrap",
            }}
          >
            Search agents...
          </span>
        </div>

        {/* New Task button — lime + dark text, only when not on orchestrate */}
        {!isOnOrchestrate && (
          <Link
            href="/dashboard/orchestrate"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              height: 36,
              padding: "0 18px",
              borderRadius: 9999,
              backgroundColor: "var(--accent-lime)",
              color: "var(--text-inverse)",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "-0.01em",
              textDecoration: "none",
              transition:
                "background-color 150ms ease, box-shadow 150ms ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                "var(--accent-lime-bright)";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                "var(--shadow-glow)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                "var(--accent-lime)";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
            }}
          >
            <PlusGlyph />
            New Task
          </Link>
        )}
      </div>
    </div>
  );
}
