"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/marketplace": "Marketplace",
  "/dashboard/orchestrate": "Orchestrate",
  "/dashboard/register": "Register Agent",
};

export function DashboardTopbar() {
  const pathname = usePathname();
  const [balance, setBalance] = useState<string | null>(null);

  // Derive page title from pathname
  const title = PAGE_TITLES[pathname] || (pathname.startsWith("/dashboard/agent/") ? "Agent Detail" : "Dashboard");

  useEffect(() => {
    fetch("/api/locus/wallet")
      .then((res) => res.json())
      .then((data) => {
        if (data.balance !== undefined) {
          setBalance(Number(data.balance).toFixed(4));
        }
      })
      .catch(() => {
        setBalance(null);
      });
  }, []);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 32px",
        borderBottom: "1px solid var(--border-light)",
        backgroundColor: "var(--bg-primary)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 13, color: "var(--text-tertiary)" }}>Dashboard</span>
        <span style={{ fontSize: 13, color: "var(--text-tertiary)" }}>/</span>
        <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text-primary)" }}>{title}</span>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "6px 14px",
          borderRadius: 9999,
          backgroundColor: "var(--bg-secondary)",
          border: "1px solid var(--border-light)",
          fontSize: 13,
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: balance !== null ? "var(--accent-green)" : "var(--text-muted)",
          }}
        />
        <span style={{ color: "var(--text-secondary)", fontWeight: 500 }}>
          {balance !== null ? `$${balance} USDC` : "Wallet"}
        </span>
      </div>
    </div>
  );
}
