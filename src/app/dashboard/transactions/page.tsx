"use client";

import { useEffect, useState, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { PriceTag } from "@/components/ui/price-tag";
import { useTaskStore } from "@/lib/task-store";

interface TxRow {
  id: string;
  task_id: string;
  amount: number;
  status: string;
  locus_tx_id: string | null;
  tx_hash: string | null;
  task_description: string | null;
  buyer_name: string | null;
  seller_name: string | null;
  negotiated_from: number | null;
  negotiated_to: number | null;
  created_at: string;
  completed_at: string | null;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

function truncateHash(hash: string): string {
  if (hash.length <= 14) return hash;
  return `${hash.slice(0, 8)}...${hash.slice(-6)}`;
}

function statusVariant(status: string): "green" | "blue" | "amber" | "red" | "default" {
  switch (status) {
    case "completed":
      return "green";
    case "paid":
      return "blue";
    case "pending":
      return "amber";
    case "failed":
      return "red";
    default:
      return "default";
  }
}

export default function TransactionsPage() {
  const [txs, setTxs] = useState<TxRow[] | null>(null);
  const [filter, setFilter] = useState<"all" | "completed" | "paid" | "failed">("all");

  const fetchTxs = useCallback(async () => {
    try {
      const res = await fetch("/api/transactions?limit=200", { cache: "no-store" });
      const data = await res.json();
      setTxs(Array.isArray(data) ? data : []);
    } catch {
      setTxs([]);
    }
  }, []);

  useEffect(() => {
    fetchTxs();
    const id = setInterval(fetchTxs, 15_000);
    return () => clearInterval(id);
  }, [fetchTxs]);

  // Refresh after any task completes or a payment is made
  const completedAt = useTaskStore((s) => s.completedAt);
  useEffect(() => {
    if (completedAt > 0) {
      const t = setTimeout(fetchTxs, 1500);
      return () => clearTimeout(t);
    }
  }, [completedAt, fetchTxs]);

  const filtered = (txs ?? []).filter((t) => filter === "all" || t.status === filter);

  const totalVolume = filtered.reduce((sum, t) => sum + (t.amount || 0), 0);
  const confirmedCount = filtered.filter((t) => t.tx_hash).length;
  const failedCount = (txs ?? []).filter((t) => t.status === "failed").length;

  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Top stat strip */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 12,
        }}
      >
        <StatTile label="Total Transactions" value={String(txs?.length ?? "—")} />
        <StatTile
          label="On-chain Volume"
          value={<PriceTag amount={totalVolume} size="lg" />}
        />
        <StatTile label="Confirmed On-chain" value={String(confirmedCount)} accent="lime" />
        <StatTile label="Failed" value={String(failedCount)} accent={failedCount > 0 ? "red" : undefined} />
      </div>

      {/* Filter bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingBottom: 12,
          borderBottom: "1px solid var(--border-light)",
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          {(["all", "completed", "paid", "failed"] as const).map((key) => {
            const active = filter === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                style={{
                  padding: "6px 14px",
                  borderRadius: 9999,
                  border: active ? "none" : "1px solid var(--border-medium)",
                  backgroundColor: active ? "var(--accent-lime)" : "transparent",
                  color: active ? "var(--text-inverse)" : "var(--text-secondary)",
                  fontSize: 13,
                  fontWeight: active ? 700 : 500,
                  cursor: "pointer",
                  textTransform: "capitalize",
                }}
              >
                {key}
              </button>
            );
          })}
        </div>
        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
          {filtered.length} record{filtered.length === 1 ? "" : "s"}
        </span>
      </div>

      {/* Transactions list */}
      <div
        style={{
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border-light)",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1.5fr 140px 140px 160px 100px",
            gap: 16,
            padding: "12px 20px",
            borderBottom: "1px solid var(--border-light)",
            backgroundColor: "var(--bg-elevated)",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
          }}
        >
          <span>Agent</span>
          <span>Task</span>
          <span>Tx Hash</span>
          <span style={{ textAlign: "right" }}>Amount</span>
          <span>Status</span>
          <span style={{ textAlign: "right" }}>When</span>
        </div>

        {/* Rows */}
        {txs === null ? (
          <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>Loading transactions...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>
            No transactions yet. Run an orchestration to get started.
          </div>
        ) : (
          filtered.map((tx) => (
            <div
              key={tx.id}
              style={{
                display: "grid",
                gridTemplateColumns: "1.2fr 1.5fr 140px 140px 160px 100px",
                gap: 16,
                padding: "14px 20px",
                borderBottom: "1px solid var(--border-light)",
                alignItems: "center",
              }}
            >
              {/* Agent */}
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {tx.seller_name || "Unknown agent"}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--text-muted)",
                    marginTop: 2,
                  }}
                >
                  from {tx.buyer_name || "Orchestrator"}
                </div>
              </div>

              {/* Task description */}
              <div
                style={{
                  fontSize: 13,
                  color: "var(--text-secondary)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  minWidth: 0,
                }}
                title={tx.task_description || ""}
              >
                {tx.task_description || "—"}
              </div>

              {/* Tx hash */}
              <div style={{ minWidth: 0 }}>
                {tx.tx_hash ? (
                  <a
                    href={`https://basescan.org/tx/${tx.tx_hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontFamily: "var(--font-mono, monospace)",
                      fontSize: 11,
                      color: "var(--accent-lime)",
                      textDecoration: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    {truncateHash(tx.tx_hash)}
                    <span style={{ fontSize: 10 }}>↗</span>
                  </a>
                ) : (
                  <span
                    style={{
                      fontSize: 11,
                      color: "var(--text-muted)",
                      fontStyle: "italic",
                    }}
                  >
                    confirming...
                  </span>
                )}
              </div>

              {/* Amount */}
              <div style={{ textAlign: "right" }}>
                <PriceTag amount={tx.amount} size="sm" />
                {tx.negotiated_from != null &&
                  tx.negotiated_to != null &&
                  tx.negotiated_from !== tx.negotiated_to && (
                    <div
                      style={{
                        fontSize: 10,
                        color: "var(--text-muted)",
                        fontFamily: "var(--font-mono, monospace)",
                        marginTop: 2,
                      }}
                    >
                      was ${tx.negotiated_from.toFixed(4)}
                    </div>
                  )}
              </div>

              {/* Status */}
              <div>
                <Badge variant={statusVariant(tx.status)}>{tx.status}</Badge>
              </div>

              {/* When */}
              <div
                style={{
                  textAlign: "right",
                  fontSize: 11,
                  color: "var(--text-muted)",
                }}
              >
                {timeAgo(tx.created_at)}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

function StatTile({
  label,
  value,
  accent,
}: {
  label: string;
  value: React.ReactNode;
  accent?: "lime" | "red";
}) {
  const accentColor =
    accent === "lime"
      ? "var(--accent-lime)"
      : accent === "red"
        ? "var(--accent-red)"
        : "var(--text-primary)";
  return (
    <div
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border-light)",
        borderRadius: 12,
        padding: 16,
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--text-muted)",
          marginBottom: 8,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: accentColor,
          fontFeatureSettings: "'tnum'",
          lineHeight: 1.1,
        }}
      >
        {value}
      </div>
    </div>
  );
}
