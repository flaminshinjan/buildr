"use client";

import { Button } from "@/components/ui/button";

interface TaskInputProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  loading: boolean;
}

export function TaskInput({ value, onChange, onSubmit, loading }: TaskInputProps) {
  return (
    <div>
      <h2 className="text-section-heading mb-6" style={{ color: "var(--text-primary)" }}>
        What do you need done?
      </h2>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g., Summarize this article about AI payments, then translate the summary to Japanese..."
        className="mb-6 w-full resize-none rounded-xl p-4 text-body outline-none"
        style={{
          backgroundColor: "var(--bg-secondary)",
          border: "1px solid var(--border-light)",
          color: "var(--text-primary)",
          minHeight: 160,
        }}
        disabled={loading}
      />
      <Button
        variant="primary"
        size="lg"
        arrow
        className="w-full"
        onClick={onSubmit}
        disabled={loading || !value.trim()}
      >
        {loading ? "Running..." : "Run Task"}
      </Button>
      <p className="mt-4 text-caption text-center" style={{ color: "var(--text-tertiary)" }}>
        Agents will be discovered, hired, and paid automatically via Locus.
      </p>
    </div>
  );
}
