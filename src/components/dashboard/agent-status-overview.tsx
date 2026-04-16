interface StatusCounts {
  online: number;
  offline: number;
  busy: number;
}

export function AgentStatusOverview({ counts }: { counts: StatusCounts }) {
  const total = counts.online + counts.offline + counts.busy;

  const segments = [
    { label: "Online", count: counts.online, color: "var(--accent-green)" },
    { label: "Busy", count: counts.busy, color: "var(--accent-amber)" },
    { label: "Offline", count: counts.offline, color: "var(--accent-red)" },
  ];

  return (
    <div
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border-light)",
        borderRadius: 12,
        padding: 24,
      }}
    >
      <h3
        className="text-card-title mb-6"
        style={{ color: "var(--text-primary)", fontWeight: 700 }}
      >
        Agent Status
      </h3>

      {total === 0 ? (
        <p className="text-body" style={{ color: "var(--text-tertiary)" }}>
          No agents registered.
        </p>
      ) : (
        <>
          {/* Segmented bar */}
          <div
            className="mb-6 flex w-full overflow-hidden rounded-full"
            style={{ height: 20, backgroundColor: "var(--bg-tertiary)" }}
          >
            {segments.map((seg, i) => {
              const pct = total > 0 ? (seg.count / total) * 100 : 0;
              if (pct === 0) return null;

              const isFirst = segments.slice(0, i).every((s) => s.count === 0);
              const isLast = segments.slice(i + 1).every((s) => s.count === 0);

              return (
                <div
                  key={seg.label}
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: seg.color,
                    borderRadius: isFirst && isLast
                      ? 9999
                      : isFirst
                        ? "9999px 0 0 9999px"
                        : isLast
                          ? "0 9999px 9999px 0"
                          : 0,
                  }}
                />
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-start justify-between">
            {segments.map((seg) => {
              const pct = total > 0 ? ((seg.count / total) * 100).toFixed(0) : "0";
              return (
                <div
                  key={seg.label}
                  className="flex flex-col gap-2"
                  style={{ minWidth: 60 }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block rounded-full"
                      style={{
                        width: 8,
                        height: 8,
                        backgroundColor: seg.color,
                      }}
                    />
                    <span
                      style={{
                        fontSize: 11,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "var(--text-tertiary)",
                        fontWeight: 500,
                      }}
                    >
                      {seg.label}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span
                      style={{
                        fontSize: 24,
                        fontWeight: 700,
                        color: "var(--text-primary)",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {seg.count}
                    </span>
                    <span
                      className="text-xs"
                      style={{ color: "var(--text-muted)" }}
                    >
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
