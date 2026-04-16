"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { WalletWidget } from "./wallet-widget";

/* ── Icon components (16×16 SVG, inline, currentColor) ────────── */

function GridIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.25" y="1.25" width="5.5" height="5.5" rx="1.25" stroke="currentColor" strokeWidth="1.5" />
      <rect x="9.25" y="1.25" width="5.5" height="5.5" rx="1.25" stroke="currentColor" strokeWidth="1.5" />
      <rect x="1.25" y="9.25" width="5.5" height="5.5" rx="1.25" stroke="currentColor" strokeWidth="1.5" />
      <rect x="9.25" y="9.25" width="5.5" height="5.5" rx="1.25" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function StorefrontIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 7V14C2 14.276 2.224 14.5 2.5 14.5H13.5C13.776 14.5 14 14.276 14 14V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M1 4.5L2.8 1.8H13.2L15 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M1 4.5C1 5.43 1.784 6.2 2.75 6.2C3.716 6.2 4.5 5.43 4.5 4.5C4.5 5.43 5.284 6.2 6.25 6.2C7.216 6.2 8 5.43 8 4.5C8 5.43 8.784 6.2 9.75 6.2C10.716 6.2 11.5 5.43 11.5 4.5C11.5 5.43 12.284 6.2 13.25 6.2C14.216 6.2 15 5.43 15 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M6.25 14.5V10.75C6.25 10.336 6.586 10 7 10H9C9.414 10 9.75 10.336 9.75 10.75V14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6.75 5.5L10.5 8L6.75 10.5V5.5Z" fill="currentColor" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 4.5V8L10.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 1.5L9.4 5.5L13.5 7L9.4 8.5L8 12.5L6.6 8.5L2.5 7L6.6 5.5L8 1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M12.5 11.5L13 13L14.5 13.5L13 14L12.5 15.5L12 14L10.5 13.5L12 13L12.5 11.5Z" fill="currentColor" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 5V11M5 8H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/* ── Navigation data ──────────────────────────────────────────── */

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType;
}

const SECTIONS: { title: string; items: NavItem[] }[] = [
  {
    title: "MAIN",
    items: [
      { label: "Overview", href: "/dashboard", icon: GridIcon },
      { label: "Marketplace", href: "/dashboard/marketplace", icon: StorefrontIcon },
      { label: "Orchestrate", href: "/dashboard/orchestrate", icon: PlayIcon },
    ],
  },
  {
    title: "ACTIVITY",
    items: [
      { label: "History", href: "/dashboard/history", icon: ClockIcon },
      { label: "Playground", href: "/dashboard/playground", icon: SparkleIcon },
    ],
  },
  {
    title: "TOOLS",
    items: [
      { label: "Register Agent", href: "/dashboard/register", icon: PlusIcon },
    ],
  },
];

/* ── Sidebar ──────────────────────────────────────────────────── */

export function Sidebar() {
  const pathname = usePathname();
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);

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
        width: 240,
        height: "100vh",
        background: "var(--bg-primary)",
        color: "var(--text-primary)",
        display: "flex",
        flexDirection: "column",
        zIndex: 40,
        borderRight: "1px solid var(--border-light)",
      }}
    >
      {/* Brand */}
      <div style={{ padding: 24 }}>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: "var(--text-primary)",
            textDecoration: "none",
            lineHeight: 1,
          }}
        >
          buildr
          <span
            style={{
              display: "inline-block",
              width: 6,
              height: 6,
              borderRadius: "50%",
              backgroundColor: "var(--accent-lime)",
              boxShadow: "0 0 10px var(--accent-lime-glow)",
              flexShrink: 0,
            }}
          />
        </Link>
      </div>

      {/* Navigation */}
      <nav
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
      >
        {SECTIONS.map((section, idx) => (
          <div key={section.title} style={{ marginTop: idx === 0 ? 0 : 20 }}>
            {/* Section label */}
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.1em",
                color: "var(--text-muted)",
                padding: "8px 20px",
                textTransform: "uppercase",
              }}
            >
              {section.title}
            </div>

            <ul
              style={{
                listStyle: "none",
                margin: 0,
                padding: 0,
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {section.items.map((item) => {
                const active = isActive(item.href);
                const hovered = hoveredHref === item.href;
                const Icon = item.icon;

                const textColor = active
                  ? "var(--text-inverse)"
                  : hovered
                    ? "var(--text-primary)"
                    : "var(--text-secondary)";

                const bgColor = active
                  ? "var(--accent-lime)"
                  : hovered
                    ? "var(--bg-elevated)"
                    : "transparent";

                return (
                  <li key={item.href} style={{ margin: "0 12px" }}>
                    <Link
                      href={item.href}
                      onMouseEnter={() => setHoveredHref(item.href)}
                      onMouseLeave={() => setHoveredHref(null)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "10px 16px",
                        borderRadius: 6,
                        fontSize: 14,
                        fontWeight: active ? 600 : 500,
                        color: textColor,
                        background: bgColor,
                        textDecoration: "none",
                        transition:
                          "background-color 160ms ease, color 160ms ease",
                      }}
                    >
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          flexShrink: 0,
                          color: textColor,
                        }}
                      >
                        <Icon />
                      </span>
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Bottom — wallet widget */}
      <div
        style={{
          padding: 16,
          borderTop: "1px solid var(--border-light)",
        }}
      >
        <WalletWidget />
      </div>
    </aside>
  );
}
