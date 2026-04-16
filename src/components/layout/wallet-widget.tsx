"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { useTaskStore } from "@/lib/task-store";

interface WalletData {
  balance: number;
  currency: string;
  wallet_address: string;
  chain: string;
  basescan_url: string;
}

function truncateAddress(addr: string): string {
  if (!addr) return "";
  if (addr.length <= 12) return addr;
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function BaseDiamond() {
  return (
    <span
      aria-hidden
      style={{
        display: "inline-block",
        width: 8,
        height: 8,
        transform: "rotate(45deg)",
        backgroundColor: "currentColor",
        borderRadius: 1,
      }}
    />
  );
}

function CopyIcon({ copied }: { copied: boolean }) {
  if (copied) {
    return (
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="2.5 7 5.5 10 11.5 3.5" />
      </svg>
    );
  }
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="4" width="8" height="8" rx="1.5" />
      <path d="M2.5 10V3C2.5 2.448 2.948 2 3.5 2H10" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 11 11"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      <path d="M4 2H2V9H9V7" />
      <path d="M6 2H9V5" />
      <path d="M5 6L9 2" />
    </svg>
  );
}

function ArrowUpIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9.5V2.5" />
      <path d="M2.5 6L6 2.5L9.5 6" />
    </svg>
  );
}

export function WalletWidget() {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [copied, setCopied] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchWallet = useCallback(async () => {
    try {
      const res = await fetch("/api/locus/wallet", { cache: "no-store" });
      const data = (await res.json()) as WalletData;
      setWallet(data);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWallet();
    const id = setInterval(fetchWallet, 30_000);
    return () => clearInterval(id);
  }, [fetchWallet]);

  // Refresh after any task run completes
  const completedAt = useTaskStore((s) => s.completedAt);
  useEffect(() => {
    if (completedAt > 0) {
      // Slight delay to let on-chain balance settle, then refresh twice
      const t1 = setTimeout(fetchWallet, 1500);
      const t2 = setTimeout(fetchWallet, 6000);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [completedAt, fetchWallet]);

  // Also refresh on each payment event during an active run
  const runs = useTaskStore((s) => s.runs);
  const paymentCountRef = useRef(0);
  useEffect(() => {
    let paymentCount = 0;
    for (const run of Object.values(runs)) {
      for (const ev of run.events) {
        if (ev.type === "payment") paymentCount++;
      }
    }
    if (paymentCount > paymentCountRef.current) {
      paymentCountRef.current = paymentCount;
      // Debounce — slight delay to let the tx confirm
      const t = setTimeout(fetchWallet, 2500);
      return () => clearTimeout(t);
    }
    paymentCountRef.current = paymentCount;
  }, [runs, fetchWallet]);

  const handleCopy = useCallback(() => {
    if (!wallet?.wallet_address) return;
    navigator.clipboard.writeText(wallet.wallet_address).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [wallet]);

  const hasBalance = wallet !== null && wallet.balance > 0;
  const balanceStr =
    wallet !== null ? wallet.balance.toFixed(2) : loading ? "" : "0.00";

  return (
    <>
      <div
        style={{
          backgroundColor: "var(--bg-card)",
          borderRadius: 12,
          padding: 16,
          border: "1px solid var(--border-light)",
        }}
      >
        {/* Chain pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 10,
              fontWeight: 700,
              color: "var(--accent-lime)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              padding: "4px 10px",
              borderRadius: 9999,
              backgroundColor: "var(--accent-lime-faded)",
            }}
          >
            <BaseDiamond />
            Base
          </span>
          <span
            aria-hidden
            style={{
              display: "inline-block",
              width: 6,
              height: 6,
              borderRadius: "50%",
              backgroundColor:
                wallet !== null ? "var(--accent-green)" : "var(--text-muted)",
              boxShadow:
                wallet !== null ? "0 0 6px rgba(74,222,128,0.6)" : "none",
            }}
          />
        </div>

        {/* Address row */}
        <button
          type="button"
          onClick={handleCopy}
          disabled={!wallet?.wallet_address}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "transparent",
            border: "none",
            color: "var(--text-tertiary)",
            padding: 0,
            cursor: wallet?.wallet_address ? "pointer" : "default",
            marginBottom: 10,
            fontSize: 12,
            fontFamily: "var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)",
            letterSpacing: "0.01em",
          }}
          aria-label="Copy wallet address"
        >
          <span>
            {wallet?.wallet_address
              ? truncateAddress(wallet.wallet_address)
              : "—"}
          </span>
          <CopyIcon copied={copied} />
        </button>

        {/* Big balance */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 6,
            marginBottom: 2,
          }}
        >
          <span
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
              fontFeatureSettings: "'tnum'",
              lineHeight: 1.1,
            }}
          >
            ${balanceStr || "0.00"}
          </span>
          {hasBalance && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                color: "var(--accent-green)",
              }}
              aria-hidden
            >
              <ArrowUpIcon />
            </span>
          )}
        </div>

        <div
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: "var(--text-muted)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          USDC
        </div>

        {/* Basescan link */}
        {wallet?.basescan_url && (
          <a
            href={wallet.basescan_url}
            target="_blank"
            rel="noopener noreferrer"
            className="wallet-basescan-link"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              fontSize: 11,
              color: "var(--text-muted)",
              textDecoration: "none",
              letterSpacing: "0.02em",
              marginBottom: 14,
              transition: "color 150ms ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color =
                "var(--accent-lime)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color =
                "var(--text-muted)";
            }}
          >
            View on Basescan
            <ExternalLinkIcon />
          </a>
        )}

        {/* Request credits — the WOW button */}
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          style={{
            width: "100%",
            padding: "12px 14px",
            borderRadius: 9999,
            border: "none",
            backgroundColor: "var(--accent-lime)",
            color: "var(--text-inverse)",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "-0.01em",
            cursor: "pointer",
            transition: "background-color 150ms ease, box-shadow 150ms ease, transform 150ms ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              "var(--accent-lime-bright)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              "var(--shadow-glow)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              "var(--accent-lime)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
          }}
        >
          Request Credits
        </button>
      </div>

      <CreditsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchWallet}
      />
    </>
  );
}

/* ── Credits request modal ────────────────────────────────────── */

function CreditsModal({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [amount, setAmount] = useState(10);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<
    { ok: true; message: string } | { ok: false; message: string } | null
  >(null);

  useEffect(() => {
    if (!open) {
      setAmount(10);
      setReason("");
      setResult(null);
      setSubmitting(false);
    }
  }, [open]);

  const handleSubmit = useCallback(async () => {
    if (!reason.trim() || submitting) return;
    setSubmitting(true);
    setResult(null);
    try {
      const res = await fetch("/api/locus/credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: reason.trim(), amount }),
      });
      const data = await res.json();
      if (data.success) {
        setResult({
          ok: true,
          message: `Request submitted for ${amount} USDC. Reviewers will follow up soon.`,
        });
        onSuccess();
      } else {
        setResult({
          ok: false,
          message: data.error || "Request failed. Please try again.",
        });
      }
    } catch (err) {
      setResult({
        ok: false,
        message: err instanceof Error ? err.message : "Request failed",
      });
    } finally {
      setSubmitting(false);
    }
  }, [reason, amount, submitting, onSuccess]);

  return (
    <Modal open={open} onClose={onClose} title="Request USDC Credits">
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <p
          style={{
            fontSize: 13,
            color: "var(--text-secondary)",
            lineHeight: 1.5,
            margin: 0,
          }}
        >
          Request additional USDC credits from the Locus team. Tell them why
          you need them and how much.
        </p>

        {/* Amount slider */}
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <label
              htmlFor="credit-amount"
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "var(--text-secondary)",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Amount
            </label>
            <span
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "var(--accent-green)",
                fontFamily: "var(--font-mono, monospace)",
              }}
            >
              ${amount} USDC
            </span>
          </div>
          <input
            id="credit-amount"
            type="range"
            min={5}
            max={50}
            step={5}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            style={{ width: "100%", accentColor: "var(--accent-green)" }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 10,
              color: "var(--text-muted)",
              marginTop: 4,
            }}
          >
            <span>$5</span>
            <span>$50</span>
          </div>
        </div>

        {/* Reason */}
        <div>
          <label
            htmlFor="credit-reason"
            style={{
              display: "block",
              fontSize: 12,
              fontWeight: 600,
              color: "var(--text-secondary)",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              marginBottom: 8,
            }}
          >
            Reason
          </label>
          <textarea
            id="credit-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Tell us what you're building and why you need these credits..."
            rows={4}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 8,
              border: "1px solid var(--border-light)",
              backgroundColor: "var(--bg-secondary)",
              color: "var(--text-primary)",
              fontSize: 13,
              fontFamily: "inherit",
              resize: "vertical",
              outline: "none",
            }}
          />
        </div>

        {/* Result banner */}
        {result && (
          <div
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              fontSize: 13,
              backgroundColor: result.ok
                ? "var(--accent-green-light)"
                : "var(--accent-red-light)",
              color: result.ok ? "var(--accent-green)" : "var(--accent-red)",
              border: `1px solid ${result.ok ? "var(--accent-green)" : "var(--accent-red)"}`,
            }}
          >
            {result.message}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "9px 16px",
              borderRadius: 8,
              border: "1px solid var(--border-light)",
              backgroundColor: "transparent",
              color: "var(--text-secondary)",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!reason.trim() || submitting || result?.ok === true}
            style={{
              padding: "9px 18px",
              borderRadius: 8,
              border: "none",
              backgroundColor:
                !reason.trim() || submitting || result?.ok === true
                  ? "var(--bg-tertiary)"
                  : "var(--accent-green)",
              color:
                !reason.trim() || submitting || result?.ok === true
                  ? "var(--text-muted)"
                  : "#FFFFFF",
              fontSize: 13,
              fontWeight: 600,
              cursor:
                !reason.trim() || submitting || result?.ok === true
                  ? "default"
                  : "pointer",
            }}
          >
            {submitting
              ? "Submitting..."
              : result?.ok
                ? "Submitted"
                : "Submit Request"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
