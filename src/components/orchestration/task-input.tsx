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
      {/* Textarea with character count */}
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Describe your task — e.g., Summarize this article about AI payments, then translate the summary to Japanese..."
          className="mb-2 w-full resize-none outline-none"
          style={{
            backgroundColor: "var(--bg-secondary)",
            border: "1px solid var(--border-light)",
            color: "var(--text-primary)",
            minHeight: 180,
            padding: 16,
            borderRadius: 16,
            fontSize: 14,
            lineHeight: 1.6,
          }}
          disabled={loading}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "var(--accent-blue)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "var(--border-light)";
          }}
        />
        {/* Character count */}
        <span
          className="pointer-events-none absolute text-xs"
          style={{
            bottom: 18,
            right: 16,
            color: "var(--text-muted)",
          }}
        >
          {value.length}
        </span>
      </div>

      {/* Run Task button */}
      <Button
        variant="primary"
        size="lg"
        arrow={!loading}
        className="w-full"
        onClick={onSubmit}
        disabled={loading || !value.trim()}
        style={{
          height: 48,
          borderRadius: 14,
          background: loading
            ? "var(--text-primary)"
            : "linear-gradient(180deg, #2C2C2C 0%, #1A1A1A 100%)",
        }}
      >
        {loading ? (
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-white" style={{ animationDelay: "0ms" }} />
            <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-white" style={{ animationDelay: "150ms" }} />
            <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-white" style={{ animationDelay: "300ms" }} />
            <span className="ml-2">Running</span>
          </span>
        ) : (
          "Run Task"
        )}
      </Button>
    </div>
  );
}
