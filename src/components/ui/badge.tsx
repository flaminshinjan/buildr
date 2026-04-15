interface BadgeProps {
  variant?: "default" | "green" | "blue" | "amber" | "red";
  children: React.ReactNode;
  className?: string;
}

const badgeStyles: Record<string, React.CSSProperties> = {
  default: { backgroundColor: "var(--bg-tertiary)", color: "var(--text-secondary)" },
  green: { backgroundColor: "var(--accent-green-light)", color: "var(--accent-green)" },
  blue: { backgroundColor: "var(--accent-blue-light)", color: "var(--accent-blue)" },
  amber: { backgroundColor: "var(--accent-amber-light)", color: "var(--accent-amber)" },
  red: { backgroundColor: "var(--accent-red-light)", color: "var(--accent-red)" },
};

export function Badge({ variant = "default", children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${className}`}
      style={badgeStyles[variant]}
    >
      {children}
    </span>
  );
}
