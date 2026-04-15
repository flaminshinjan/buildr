import Link from "next/link";
import { Container } from "./container";

export function Footer() {
  return (
    <footer style={{ backgroundColor: "var(--bg-dark)", color: "var(--text-on-dark)" }}>
      <Container>
        <div className="py-16">
          <div className="mb-16 pb-12" style={{ borderBottom: "1px solid var(--bg-dark-secondary)" }}>
            <h3 className="text-section-heading mb-2" style={{ color: "var(--text-on-dark)" }}>
              Stay in the Loop
            </h3>
            <p className="text-body mb-6" style={{ color: "var(--text-tertiary)" }}>
              Get updates on the agent economy.
            </p>
            <div className="flex max-w-md gap-3">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 rounded-full px-5 py-3 text-sm outline-none"
                style={{
                  backgroundColor: "var(--bg-dark-secondary)",
                  color: "var(--text-on-dark)",
                  border: "1px solid var(--bg-dark-secondary)",
                }}
              />
              <button
                className="rounded-full px-6 py-3 text-sm font-medium transition-opacity duration-200 hover:opacity-90"
                style={{
                  backgroundColor: "var(--text-on-dark)",
                  color: "var(--bg-dark)",
                }}
              >
                Subscribe
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <FooterColumn title="Product">
              <FooterLink href="/marketplace">Marketplace</FooterLink>
              <FooterLink href="/register">Register Agent</FooterLink>
              <FooterLink href="/dashboard">Dashboard</FooterLink>
              <FooterLink href="/orchestrate">Orchestrate</FooterLink>
            </FooterColumn>
            <FooterColumn title="Developers">
              <FooterLink href="#">Documentation</FooterLink>
              <FooterLink href="#">API Reference</FooterLink>
              <FooterLink href="#">GitHub</FooterLink>
            </FooterColumn>
            <FooterColumn title="Hackathon">
              <FooterLink href="https://paywithlocus.com">Locus</FooterLink>
              <FooterLink href="#">Devfolio</FooterLink>
              <FooterLink href="#">Discord</FooterLink>
            </FooterColumn>
            <FooterColumn title="Legal">
              <FooterLink href="#">Privacy</FooterLink>
              <FooterLink href="#">Terms</FooterLink>
            </FooterColumn>
          </div>

          <div
            className="mt-16 flex flex-col items-center justify-between gap-4 pt-8 text-caption sm:flex-row"
            style={{ borderTop: "1px solid var(--bg-dark-secondary)", color: "var(--text-tertiary)" }}
          >
            <p>Built for the Locus Paygentic Hackathon</p>
            <p>Powered by Locus</p>
          </div>
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-4 text-sm font-medium" style={{ color: "var(--text-on-dark)" }}>
        {title}
      </h4>
      <ul className="space-y-3">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="text-sm transition-colors duration-200 hover:opacity-80"
        style={{ color: "var(--text-tertiary)" }}
      >
        {children}
      </Link>
    </li>
  );
}
