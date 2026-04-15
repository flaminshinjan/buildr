import { PriceTag } from "@/components/ui/price-tag";

interface CategoryData {
  category: string;
  agent_count: number;
  total_earned: number;
}

const categoryColors: Record<string, { bg: string; bar: string }> = {
  summarization: { bg: "var(--accent-green-light)", bar: "var(--accent-green)" },
  translation: { bg: "var(--accent-blue-light)", bar: "var(--accent-blue)" },
  "code-review": { bg: "var(--accent-amber-light)", bar: "var(--accent-amber)" },
  research: { bg: "var(--accent-red-light)", bar: "var(--accent-red)" },
  content: { bg: "var(--accent-blue-light)", bar: "var(--accent-blue)" },
};

function getColorForCategory(category: string) {
  if (categoryColors[category]) return categoryColors[category];
  const colors = Object.values(categoryColors);
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export function CategoryBreakdown({ categories }: { categories: CategoryData[] }) {
  if (categories.length === 0) {
    return (
      <div
        className="rounded-xl p-6"
        style={{
          backgroundColor: "var(--bg-primary)",
          border: "1px solid var(--border-light)",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <h3 className="text-card-title mb-4" style={{ color: "var(--text-primary)" }}>
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
      className="rounded-xl p-6"
      style={{
        backgroundColor: "var(--bg-primary)",
        border: "1px solid var(--border-light)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <h3 className="text-card-title mb-6" style={{ color: "var(--text-primary)" }}>
        Category Breakdown
      </h3>
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
                    style={{ backgroundColor: colors.bg, color: colors.bar }}
                  >
                    {cat.category}
                  </span>
                  <span className="text-caption" style={{ color: "var(--text-tertiary)" }}>
                    {cat.agent_count} agent{cat.agent_count !== 1 ? "s" : ""}
                  </span>
                </div>
                <PriceTag amount={cat.total_earned} size="sm" />
              </div>
              <div
                className="h-2 w-full overflow-hidden rounded-full"
                style={{ backgroundColor: "var(--bg-tertiary)" }}
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
