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
      className="animate-fade-in overflow-hidden"
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--accent-lime)",
        borderRadius: 12,
      }}
    >
      {/* Top banner */}
      <div
        className="px-6 py-4"
        style={{
          backgroundColor: "var(--accent-lime-faded)",
          borderBottom: "1px solid var(--border-light)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold"
            style={{
              backgroundColor: "var(--accent-lime)",
              color: "var(--text-inverse)",
            }}
          >
            ✓
          </div>
          <h3
            style={{
              color: "var(--text-primary)",
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            Task completed
          </h3>
        </div>
      </div>

      <div className="px-6 pb-6 pt-4">
        {/* Metrics — 3-column grid */}
        <div
          className="mb-4 grid grid-cols-3 gap-3 rounded-lg p-3"
          style={{
            backgroundColor: "var(--bg-elevated)",
            border: "1px solid var(--border-light)",
          }}
        >
          <div className="text-center">
            <p
              style={{
                fontSize: 11,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
                fontWeight: 500,
              }}
            >
              Agents Hired
            </p>
            <p
              className="mt-1 font-mono text-lg font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              {agentsHired}
            </p>
          </div>
          <div
            className="text-center"
            style={{
              borderLeft: "1px solid var(--border-light)",
              borderRight: "1px solid var(--border-light)",
            }}
          >
            <p
              style={{
                fontSize: 11,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
                fontWeight: 500,
              }}
            >
              Total Cost
            </p>
            <div className="mt-1">
              <PriceTag amount={totalCost} size="md" />
            </div>
          </div>
          <div className="text-center">
            <p
              style={{
                fontSize: 11,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
                fontWeight: 500,
              }}
            >
              Duration
            </p>
            <p
              className="mt-1 font-mono text-lg font-bold"
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
          className="mt-3 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-colors duration-200"
          style={{
            backgroundColor: "transparent",
            border: `1px solid ${copied ? "var(--accent-lime)" : "var(--border-medium)"}`,
            color: copied ? "var(--accent-lime)" : "var(--text-secondary)",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--accent-lime)";
            e.currentTarget.style.color = "var(--accent-lime)";
          }}
          onMouseLeave={(e) => {
            if (!copied) {
              e.currentTarget.style.borderColor = "var(--border-medium)";
              e.currentTarget.style.color = "var(--text-secondary)";
            }
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
            className="ml-2 mt-3 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-opacity"
            style={{
              backgroundColor: "var(--accent-lime)",
              color: "var(--text-inverse)",
              border: "none",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--accent-lime-bright)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "var(--accent-lime)";
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
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
