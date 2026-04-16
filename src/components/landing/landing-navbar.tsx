import Link from "next/link";
import { Container } from "@/components/layout/container";

export function LandingNavbar() {
  return (
    <nav
      className="sticky top-0 z-50"
      style={{
        backgroundColor: "rgba(10, 10, 10, 0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border-light)",
      }}
    >
      <Container>
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xl font-bold tracking-tight"
              style={{
                color: "var(--text-primary)",
                letterSpacing: "-0.03em",
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
                }}
              />
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <LandingNavLink href="/dashboard/marketplace">Marketplace</LandingNavLink>
              <LandingNavLink href="/dashboard/orchestrate">Orchestrate</LandingNavLink>
              <LandingNavLink href="/dashboard">Dashboard</LandingNavLink>
            </div>
          </div>
          <Link
            href="/dashboard/register"
            className="hidden sm:inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold transition-colors duration-200"
            style={{
              backgroundColor: "var(--accent-lime)",
              color: "var(--text-inverse)",
            }}
          >
            Register Agent
            <span>&#8594;</span>
          </Link>
        </div>
      </Container>
    </nav>
  );
}

function LandingNavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-sm font-medium transition-colors duration-200"
      style={{ color: "var(--text-secondary)" }}
    >
      {children}
    </Link>
  );
}
