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
          {/* Segmented bar - taller with rounded segment edges */}
          <div
            className="mb-6 flex w-full overflow-hidden rounded-full"
            style={{ height: 24, backgroundColor: "var(--bg-tertiary)" }}
          >
            {segments.map((seg, i) => {
              const pct = total > 0 ? (seg.count / total) * 100 : 0;
              if (pct === 0) return null;

              // Determine border-radius for rounded segment edges
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

          {/* Legend - compact with large numbers and colored dots */}
          <div className="flex items-center justify-between">
            {segments.map((seg) => {
              const pct = total > 0 ? ((seg.count / total) * 100).toFixed(0) : "0";
              return (
                <div key={seg.label} className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: seg.color }}
                    />
                    <span
                      className="text-xs font-medium"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      {seg.label}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span
                      className="text-xl font-semibold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {seg.count}
                    </span>
                    <span
                      className="text-xs"
                      style={{ color: "var(--text-tertiary)" }}
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
