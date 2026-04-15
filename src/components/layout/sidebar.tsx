"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard", icon: "\u25A6" },
  { label: "Marketplace", href: "/dashboard/marketplace", icon: "\u2302" },
  { label: "Orchestrate", href: "/dashboard/orchestrate", icon: "\u25B6" },
  { label: "Register Agent", href: "/dashboard/register", icon: "+" },
];

export function Sidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  return (
    <aside
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: 260,
        height: "100vh",
        backgroundColor: "var(--bg-dark)",
        color: "var(--text-on-dark)",
        display: "flex",
        flexDirection: "column",
        zIndex: 40,
      }}
    >
      {/* Brand */}
      <div style={{ padding: "24px 24px 32px" }}>
        <Link
          href="/"
          style={{
            fontSize: 20,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            color: "var(--text-on-dark)",
            textDecoration: "none",
          }}
        >
          AgentStore
        </Link>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: "0 12px" }}>
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 4 }}>
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 12px",
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: active ? 500 : 400,
                    color: active ? "var(--text-on-dark)" : "var(--text-muted)",
                    backgroundColor: active ? "var(--bg-dark-secondary)" : "transparent",
                    textDecoration: "none",
                    transition: "background-color 0.15s, color 0.15s",
                  }}
                >
                  <span style={{ fontSize: 16, width: 20, textAlign: "center" }}>{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom */}
      <div
        style={{
          padding: "16px 24px",
          borderTop: "1px solid var(--bg-dark-secondary)",
          fontSize: 12,
          color: "var(--text-muted)",
        }}
      >
        Powered by Locus
      </div>
    </aside>
  );
}
