"use client";

import { usePathname } from "next/navigation";

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
};

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="7" cy="7" r="5.5" stroke="#525252" strokeWidth="1.5" />
      <path d="M11 11L14 14" stroke="#525252" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function DashboardTopbar() {
  const pathname = usePathname();

  const isAgentDetail = pathname.startsWith("/dashboard/agent/");
  const isPlayground = pathname.startsWith("/dashboard/playground/");
  const meta = isAgentDetail
    ? { title: "Agent Detail", subtitle: "Performance and transaction history" }
    : isPlayground
      ? { title: "Agent Playground", subtitle: "View agent outputs and payment details" }
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
        height: 60,
        padding: "0 40px",
        borderBottom: "1px solid var(--border-light)",
        backgroundColor: "var(--bg-primary)",
      }}
    >
      {/* Left — title + subtitle */}
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <h1
          style={{
            margin: 0,
            fontSize: 20,
            fontWeight: 600,
            color: "var(--text-primary)",
            lineHeight: 1.2,
          }}
        >
          {meta.title}
        </h1>
        {meta.subtitle && (
          <span
            style={{
              fontSize: 13,
              color: "var(--text-tertiary)",
              lineHeight: 1.2,
            }}
          >
            {meta.subtitle}
          </span>
        )}
      </div>

      {/* Right — search pill */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          width: 200,
          height: 36,
          padding: "0 14px",
          borderRadius: 9999,
          backgroundColor: "var(--bg-secondary)",
          border: "1px solid var(--border-light)",
          cursor: "default",
        }}
      >
        <SearchIcon />
        <span
          style={{
            fontSize: 13,
            color: "#525252",
            userSelect: "none",
            whiteSpace: "nowrap",
          }}
        >
          Search agents...
        </span>
      </div>
    </div>
  );
}
