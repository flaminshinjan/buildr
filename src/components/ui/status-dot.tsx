interface StatusDotProps {
  status: "online" | "offline" | "busy";
  size?: number;
  className?: string;
}

const statusColors: Record<string, string> = {
  online: "var(--accent-green)",
  offline: "var(--accent-red)",
  busy: "var(--accent-amber)",
};

export function StatusDot({ status, size = 8, className = "" }: StatusDotProps) {
  return (
    <span
      className={`inline-block rounded-full ${className}`}
      style={{ width: size, height: size, backgroundColor: statusColors[status] }}
    />
  );
}
