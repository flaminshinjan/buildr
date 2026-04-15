"use client";

import { OrchestrationEvent } from "@/lib/schema";
import { AgentHireEvent } from "./agent-hire-event";
import { NegotiationLog } from "./negotiation-log";
import { ResultPanel } from "./result-panel";
import { Badge } from "@/components/ui/badge";

export function ExecutionTimeline({ events }: { events: OrchestrationEvent[] }) {
  if (events.length === 0) {
    return (
      <div className="flex h-full items-center justify-center py-24">
        <p className="text-body text-center" style={{ color: "var(--text-tertiary)" }}>
          Submit a task to watch agents get hired in real-time.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event, i) => (
        <TimelineEvent key={i} event={event} />
      ))}
    </div>
  );
}

function TimelineEvent({ event }: { event: OrchestrationEvent }) {
  const time = new Date(event.timestamp).toLocaleTimeString();

  switch (event.type) {
    case "decomposition":
      return (
        <EventCard icon="◧" time={time}>
          <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
            Task decomposed into {(event.data.count as number)} sub-tasks
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {(event.data.sub_tasks as { category: string; description: string }[])?.map((st, i) => (
              <Badge key={i} variant="blue">{st.category}</Badge>
            ))}
          </div>
        </EventCard>
      );

    case "discovery":
      return (
        <EventCard icon="◉" time={time}>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Searching for <span className="font-medium">{event.data.category as string}</span> agents...
          </p>
        </EventCard>
      );

    case "negotiation":
      return (
        <EventCard icon="⇄" time={time}>
          <AgentHireEvent
            agentName={event.data.agent_name as string}
            category={event.data.category as string}
            askingPrice={event.data.asking_price as number}
            finalPrice={event.data.final_price as number}
            savingsPercent={event.data.savings_percent as number}
            txId=""
          />
          {Array.isArray(event.data.steps) && (
            <div className="mt-3">
              <NegotiationLog
                steps={event.data.steps as { round: number; buyer_offer: number; seller_counter: number; accepted: boolean }[]}
                agentName={event.data.agent_name as string}
              />
            </div>
          )}
        </EventCard>
      );

    case "payment":
      return (
        <EventCard icon="$" time={time}>
          <p className="text-sm" style={{ color: "var(--text-primary)" }}>
            Paid <span className="font-medium">{event.data.agent_name as string}</span>{" "}
            <span className="font-mono" style={{ color: "var(--accent-amber)" }}>
              ${(event.data.amount as number).toFixed(4)} USDC
            </span>{" "}
            via Locus
          </p>
          <p className="mt-1 font-mono text-xs" style={{ color: "var(--text-muted)" }}>
            tx: {event.data.locus_tx_id as string}
          </p>
        </EventCard>
      );

    case "execution": {
      const status = event.data.status as string;
      return (
        <EventCard icon={status === "completed" ? "✓" : "⚙"} time={time}>
          <p className="text-sm" style={{ color: "var(--text-primary)" }}>
            {status === "completed" ? (
              <>
                <span className="font-medium">{event.data.agent_name as string}</span> delivered result
              </>
            ) : (
              <>
                <span className="font-medium">{event.data.agent_name as string}</span> is working...
              </>
            )}
          </p>
          {status === "completed" && typeof event.data.result === "string" && (
            <details className="mt-2">
              <summary className="cursor-pointer text-xs" style={{ color: "var(--accent-blue)" }}>
                View output
              </summary>
              <div
                className="mt-2 rounded-lg p-3 text-xs whitespace-pre-wrap"
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  color: "var(--text-secondary)",
                  maxHeight: 200,
                  overflow: "auto",
                }}
              >
                {event.data.result as string}
              </div>
            </details>
          )}
        </EventCard>
      );
    }

    case "assembly":
      return (
        <EventCard icon="▦" time={time}>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Assembling final result from {event.data.results_count as number} agents...
          </p>
        </EventCard>
      );

    case "completion":
      return (
        <ResultPanel
          totalCost={event.data.total_cost as number}
          agentsHired={event.data.agents_hired as number}
          finalResult={event.data.final_result as string}
        />
      );

    case "error":
      return (
        <EventCard icon="✕" time={time}>
          <p className="text-sm" style={{ color: "var(--accent-red)" }}>
            Error: {event.data.message as string}
          </p>
        </EventCard>
      );

    default:
      return null;
  }
}

function EventCard({ icon, time, children }: { icon: string; time: string; children: React.ReactNode }) {
  return (
    <div className="animate-fade-in flex gap-3">
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm"
        style={{ backgroundColor: "var(--bg-tertiary)", color: "var(--text-secondary)" }}
      >
        {icon}
      </div>
      <div className="flex-1">
        <p className="mb-1 text-xs" style={{ color: "var(--text-muted)" }}>{time}</p>
        {children}
      </div>
    </div>
  );
}
