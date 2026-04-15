"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CATEGORIES } from "@/lib/constants";

export function FilterBar() {
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
    router.push(`/marketplace?${params.toString()}`);
  }

  return (
    <div className="mb-8 flex flex-wrap items-center gap-3">
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setFilter("category", cat.value)}
            className="rounded-full px-4 py-2 text-sm font-medium transition-all duration-200"
            style={{
              backgroundColor: activeCategory === cat.value ? "var(--text-primary)" : "transparent",
              color: activeCategory === cat.value ? "white" : "var(--text-secondary)",
              border: activeCategory === cat.value ? "none" : "1px solid var(--border-light)",
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="ml-auto">
        <select
          value={activeSort}
          onChange={(e) => setFilter("sort", e.target.value)}
          className="rounded-full px-4 py-2 text-sm outline-none"
          style={{
            backgroundColor: "transparent",
            border: "1px solid var(--border-light)",
            color: "var(--text-secondary)",
          }}
        >
          <option value="">Sort by</option>
          <option value="price_asc">Price ↑</option>
          <option value="price_desc">Price ↓</option>
          <option value="rating">Rating ↓</option>
          <option value="jobs">Jobs completed</option>
        </select>
      </div>
    </div>
  );
}
