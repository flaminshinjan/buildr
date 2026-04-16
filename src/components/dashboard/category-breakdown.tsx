import { PriceTag } from "@/components/ui/price-tag";
import { CATEGORY_COLORS } from "@/lib/constants";

interface CategoryData {
  category: string;
  agent_count: number;
  total_earned: number;
}

function getColorForCategory(category: string): { bg: string; bar: string } {
  const entry = CATEGORY_COLORS[category];
  if (entry) return { bg: entry.bg, bar: entry.text };

  // Fallback: hash-based color from the constants palette
  const allColors = Object.values(CATEGORY_COLORS);
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }
  const picked = allColors[Math.abs(hash) % allColors.length];
  return { bg: picked.bg, bar: picked.text };
}

export function CategoryBreakdown({ categories }: { categories: CategoryData[] }) {
  const totalCount = categories.length;

  if (totalCount === 0) {
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
          className="text-card-title mb-4"
          style={{ color: "var(--text-primary)", fontWeight: 700 }}
        >
          Category Breakdown
        </h3>
        <p className="text-body" style={{ color: "var(--text-tertiary)" }}>
          No categories found.
        </p>
      </div>
    );
  }

  const maxEarned = Math.max(...categories.map((c) => c.total_earned), 0.001);

  return (
    <div
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border-light)",
        borderRadius: 12,
        padding: 24,
      }}
    >
      {/* Header with total count */}
      <div className="mb-6 flex items-baseline justify-between">
        <h3
          className="text-card-title"
          style={{ color: "var(--text-primary)", fontWeight: 700 }}
        >
          Category Breakdown
        </h3>
        <span
          className="text-xs font-medium"
          style={{ color: "var(--text-muted)" }}
        >
          {totalCount} categor{totalCount === 1 ? "y" : "ies"}
        </span>
      </div>

      <div className="space-y-4">
        {categories.map((cat) => {
          const colors = getColorForCategory(cat.category);
          const barWidth = Math.max((cat.total_earned / maxEarned) * 100, 4);

          return (
            <div key={cat.category}>
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"
                    style={{
                      backgroundColor: colors.bg,
                      color: colors.bar,
                      border: `1px solid ${colors.bar}22`,
                    }}
                  >
                    {cat.category}
                  </span>
                  {/* Agent count badge */}
                  <span
                    className="inline-flex items-center justify-center rounded-full text-xs font-medium"
                    style={{
                      minWidth: 22,
                      height: 22,
                      padding: "0 6px",
                      backgroundColor: "var(--bg-elevated)",
                      color: "var(--text-secondary)",
                      border: "1px solid var(--border-light)",
                    }}
                  >
                    {cat.agent_count}
                  </span>
                </div>
                <PriceTag amount={cat.total_earned} size="sm" />
              </div>
              {/* Bar */}
              <div
                className="w-full overflow-hidden rounded-full"
                style={{ height: 6, backgroundColor: "var(--bg-tertiary)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${barWidth}%`,
                    backgroundColor: colors.bar,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
