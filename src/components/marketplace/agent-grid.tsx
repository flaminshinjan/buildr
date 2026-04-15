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
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {agents.map((agent) => (
        <AgentCard key={agent.id} agent={agent} />
      ))}
    </div>
  );
}
