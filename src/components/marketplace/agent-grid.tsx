import { Agent } from "@/lib/schema";
import { AgentCard } from "./agent-card";

export function AgentGrid({ agents }: { agents: Agent[] }) {
  if (agents.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="text-body" style={{ color: "var(--text-tertiary)" }}>
          No agents found. Try a different filter.
        </p>
      </div>
    );
  }

  return (
    <div>
      <p
        className="mb-4 text-right text-sm"
        style={{ color: "var(--text-muted)" }}
      >
        {agents.length} agent{agents.length !== 1 ? "s" : ""} found
      </p>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent, i) => (
          <div
            key={agent.id}
            className="animate-fade-in"
            style={{ animationDelay: `${i * 50}ms`, opacity: 0 }}
          >
            <AgentCard agent={agent} />
          </div>
        ))}
      </div>
    </div>
  );
}
