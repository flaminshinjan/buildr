import Link from "next/link";
import { Container } from "./container";

export function Navbar() {
  return (
    <nav
      className="sticky top-0 z-50 border-b"
      style={{
        backgroundColor: "rgba(245, 240, 232, 0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderColor: "var(--border-light)",
      }}
    >
      <Container>
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="text-xl font-semibold tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              buildr
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <NavLink href="/marketplace">Marketplace</NavLink>
              <NavLink href="/orchestrate">Orchestrate</NavLink>
              <NavLink href="/dashboard">Dashboard</NavLink>
            </div>
          </div>
          <Link
            href="/register"
            className="hidden sm:inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-colors duration-200"
            style={{
              backgroundColor: "var(--text-primary)",
              color: "white",
            }}
          >
            Register Agent
            <span>→</span>
          </Link>
        </div>
      </Container>
    </nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-sm font-medium transition-colors duration-200 hover:opacity-80"
      style={{ color: "var(--text-secondary)" }}
    >
      {children}
    </Link>
  );
}
