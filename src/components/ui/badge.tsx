interface BadgeProps {
  variant?: "default" | "green" | "blue" | "amber" | "red" | "lime";
  children: React.ReactNode;
  className?: string;
}

const badgeStyles: Record<string, React.CSSProperties> = {
  default: {
    backgroundColor: "var(--bg-elevated)",
    color: "var(--text-secondary)",
    border: "1px solid var(--border-light)",
  },
  green: {
    backgroundColor: "var(--accent-green-light)",
    color: "var(--accent-green)",
    border: "1px solid transparent",
  },
  blue: {
    backgroundColor: "var(--accent-blue-light)",
    color: "var(--accent-blue)",
    border: "1px solid transparent",
  },
  amber: {
    backgroundColor: "var(--accent-amber-light)",
    color: "var(--accent-amber)",
    border: "1px solid transparent",
  },
  red: {
    backgroundColor: "var(--accent-red-light)",
    color: "var(--accent-red)",
    border: "1px solid transparent",
  },
  lime: {
    backgroundColor: "var(--accent-lime-faded)",
    color: "var(--accent-lime)",
    border: "1px solid var(--accent-lime)",
  },
};

export function Badge({ variant = "default", children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full text-xs font-medium ${className}`}
      style={{ ...badgeStyles[variant], padding: "4px 10px" }}
    >
      {children}
    </span>
  );
}
