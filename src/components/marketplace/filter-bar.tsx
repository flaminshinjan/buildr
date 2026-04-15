"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CATEGORIES } from "@/lib/constants";

export function FilterBar({ totalCount }: { totalCount?: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category") || "all";
  const activeSort = searchParams.get("sort") || "";

  function setFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all" || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/dashboard/marketplace?${params.toString()}`);
  }

  return (
    <div
      className="mb-8 flex flex-wrap items-center gap-3 pb-6"
      style={{ borderBottom: "1px solid var(--border-light)" }}
    >
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.value;
          const label =
            cat.value === "all" && totalCount != null
              ? `All (${totalCount})`
              : cat.label;

          return (
            <button
              key={cat.value}
              onClick={() => setFilter("category", cat.value)}
              className="rounded-full text-sm font-medium transition-all duration-200"
              style={{
                padding: "8px 16px",
                backgroundColor: isActive ? "#1A1A1A" : "transparent",
                color: isActive ? "#FFFFFF" : "var(--text-secondary)",
                border: isActive ? "1px solid #1A1A1A" : "1px solid var(--border-light)",
                boxShadow: isActive ? "0 2px 8px rgba(0,0,0,0.15)" : "none",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = "var(--bg-secondary)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = "transparent";
                }
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="relative ml-auto">
        <select
          value={activeSort}
          onChange={(e) => setFilter("sort", e.target.value)}
          className="cursor-pointer appearance-none rounded-full pr-9 pl-4 py-2 text-sm outline-none transition-all duration-200"
          style={{
            backgroundColor: "transparent",
            border: "1px solid var(--border-light)",
            color: "var(--text-secondary)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--bg-secondary)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <option value="">Sort by</option>
          <option value="price_asc">Price ↑</option>
          <option value="price_desc">Price ↓</option>
          <option value="rating">Rating ↓</option>
          <option value="jobs">Jobs completed</option>
        </select>
        {/* Chevron down indicator */}
        <svg
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--text-tertiary)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </div>
  );
}
