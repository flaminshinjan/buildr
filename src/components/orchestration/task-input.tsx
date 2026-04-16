"use client";

interface TaskInputProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  loading: boolean;
  minHeight?: number;
}

export function TaskInput({
  value,
  onChange,
  onSubmit,
  loading,
  minHeight = 180,
}: TaskInputProps) {
  return (
    <div>
      {/* Textarea with character count */}
      <div className="relative mb-3">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Describe your task — e.g., Summarize this article about AI payments, then translate the summary to Japanese..."
          className="w-full resize-none outline-none transition-all duration-150"
          style={{
            backgroundColor: "var(--bg-elevated)",
            border: "1px solid var(--border-light)",
            color: "var(--text-primary)",
            minHeight,
            padding: 16,
            borderRadius: 12,
            fontSize: 14,
            lineHeight: 1.6,
          }}
          disabled={loading}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "var(--accent-lime)";
            e.currentTarget.style.boxShadow = "0 0 0 3px var(--accent-lime-faded)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "var(--border-light)";
            e.currentTarget.style.boxShadow = "none";
          }}
        />
        {/* Character count */}
        <span
          className="pointer-events-none absolute font-mono text-xs"
          style={{
            bottom: 14,
            right: 16,
            color: "var(--text-muted)",
          }}
        >
          {value.length}
        </span>
      </div>

      {/* Run Task button */}
      <button
        type="button"
        onClick={onSubmit}
        disabled={loading || !value.trim()}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full text-sm font-bold transition-all duration-150"
        style={{
          height: 48,
          backgroundColor: "var(--accent-lime)",
          color: "var(--text-inverse)",
          border: "none",
          cursor: loading || !value.trim() ? "not-allowed" : "pointer",
          opacity: !value.trim() && !loading ? 0.5 : 1,
          padding: "0 24px",
        }}
        onMouseEnter={(e) => {
          if (!loading && value.trim()) {
            e.currentTarget.style.backgroundColor = "var(--accent-lime-bright)";
          }
        }}
        onMouseLeave={(e) => {
          if (!loading) {
            e.currentTarget.style.backgroundColor = "var(--accent-lime)";
          }
        }}
      >
        {loading ? (
          <span className="inline-flex items-center gap-1.5">
            <span
              className="inline-block h-1.5 w-1.5 animate-bounce rounded-full"
              style={{
                backgroundColor: "var(--text-inverse)",
                animationDelay: "0ms",
              }}
            />
            <span
              className="inline-block h-1.5 w-1.5 animate-bounce rounded-full"
              style={{
                backgroundColor: "var(--text-inverse)",
                animationDelay: "150ms",
              }}
            />
            <span
              className="inline-block h-1.5 w-1.5 animate-bounce rounded-full"
              style={{
                backgroundColor: "var(--text-inverse)",
                animationDelay: "300ms",
              }}
            />
            <span className="ml-2">Running</span>
          </span>
        ) : (
          <>
            Run Task
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </>
        )}
      </button>
    </div>
  );
}
