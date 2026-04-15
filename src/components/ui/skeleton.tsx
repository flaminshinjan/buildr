interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
}

export function Skeleton({ className = "", width, height }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse-skeleton rounded-lg ${className}`}
      style={{ backgroundColor: "var(--bg-tertiary)", width: width || "100%", height: height || "20px" }}
    />
  );
}
