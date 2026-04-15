interface StatusCounts {
  online: number;
  offline: number;
  busy: number;
}

export function AgentStatusOverview({ counts }: { counts: StatusCounts }) {
  const total = counts.online + counts.offline + counts.busy;

  const segments = [
    { label: "Online", count: counts.online, color: "var(--accent-green)", lightColor: "var(--accent-green-light)" },
    { label: "Busy", count: counts.busy, color: "var(--accent-amber)", lightColor: "var(--accent-amber-light)" },
    { label: "Offline", count: counts.offline, color: "var(--accent-red)", lightColor: "var(--accent-red-light)" },
  ];

  return (
    <div
      className="rounded-xl p-6"
      style={{
        backgroundColor: "var(--bg-primary)",
        border: "1px solid var(--border-light)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <h3 className="text-card-title mb-6" style={{ color: "var(--text-primary)" }}>
        Agent Status
      </h3>

      {total === 0 ? (
        <p className="text-body" style={{ color: "var(--text-tertiary)" }}>
          No agents registered.
        </p>
      ) : (
        <>
          {/* Segmented bar */}
          <div className="mb-6 flex h-4 w-full overflow-hidden rounded-full" style={{ backgroundColor: "var(--bg-tertiary)" }}>
            {segments.map((seg) => {
              const pct = total > 0 ? (seg.count / total) * 100 : 0;
              if (pct === 0) return null;
              return (
                <div
                  key={seg.label}
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: seg.color,
                  }}
                />
              );
            })}
          </div>

          {/* Legend */}
          <div className="space-y-3">
            {segments.map((seg) => {
              const pct = total > 0 ? ((seg.count / total) * 100).toFixed(0) : "0";
              return (
                <div
                  key={seg.label}
                  className="flex items-center justify-between rounded-lg px-4 py-3"
                  style={{ backgroundColor: seg.lightColor }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="inline-block h-3 w-3 rounded-full"
                      style={{ backgroundColor: seg.color }}
                    />
                    <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                      {seg.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                      {seg.count}
                    </span>
                    <span className="text-caption" style={{ color: "var(--text-tertiary)" }}>
                      {pct}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
