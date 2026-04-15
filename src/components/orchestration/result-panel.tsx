"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PriceTag } from "@/components/ui/price-tag";
import { Markdown } from "@/components/ui/markdown";

interface ResultPanelProps {
  totalCost: number;
  agentsHired: number;
  finalResult: string;
  taskId?: string;
}

export function ResultPanel({ totalCost, agentsHired, finalResult, taskId }: ResultPanelProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(finalResult).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div
      className="animate-fade-in overflow-hidden rounded-xl"
      style={{
        border: "1px solid var(--accent-green)",
      }}
    >
      {/* Top banner with subtle gradient */}
      <div
        className="px-6 py-4"
        style={{
          background: "linear-gradient(135deg, var(--accent-green-light) 0%, var(--accent-green-light) 60%, rgba(74,124,89,0.15) 100%)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold"
            style={{ backgroundColor: "var(--accent-green)", color: "#fff" }}
          >
            ✓
          </div>
          <h3
            className="font-bold"
            style={{ color: "var(--accent-green)", fontSize: 24 }}
          >
            Task completed
          </h3>
        </div>
      </div>

      <div className="px-6 pb-6 pt-4" style={{ backgroundColor: "var(--accent-green-light)" }}>
        {/* Metrics — 3-column grid */}
        <div
          className="mb-4 grid grid-cols-3 gap-3 rounded-lg p-3"
          style={{
            backgroundColor: "var(--bg-primary)",
            border: "1px solid var(--border-light)",
          }}
        >
          <div className="text-center">
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Agents Hired
            </p>
            <p
              className="mt-0.5 text-lg font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              {agentsHired}
            </p>
          </div>
          <div
            className="text-center"
            style={{ borderLeft: "1px solid var(--border-light)", borderRight: "1px solid var(--border-light)" }}
          >
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Total Cost
            </p>
            <div className="mt-0.5">
              <PriceTag amount={totalCost} size="md" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Duration
            </p>
            <p
              className="mt-0.5 text-lg font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              --
            </p>
          </div>
        </div>

        {/* Result text */}
        <div
          className="rounded-lg p-4 text-sm"
          style={{
            backgroundColor: "var(--bg-primary)",
            border: "1px solid var(--border-light)",
            maxHeight: 320,
            overflow: "auto",
          }}
        >
          <Markdown content={finalResult} />
        </div>

        {/* Copy Result button */}
        <button
          type="button"
          onClick={handleCopy}
          className="mt-3 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-medium transition-all duration-200"
          style={{
            backgroundColor: "var(--bg-primary)",
            border: "1px solid var(--border-light)",
            color: copied ? "var(--accent-green)" : "var(--text-secondary)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--accent-green)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border-light)";
          }}
        >
          {copied ? (
            <>
              <span>✓</span> Copied
            </>
          ) : (
            <>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
              </svg>
              Copy Result
            </>
          )}
        </button>

        {taskId && (
          <button
            type="button"
            onClick={() => router.push(`/dashboard/playground/${taskId}`)}
            className="mt-2 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-medium transition-all duration-200"
            style={{
              backgroundColor: "var(--accent-blue)",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            Open in Playground
          </button>
        )}
      </div>
    </div>
  );
}
