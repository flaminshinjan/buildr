interface PriceTagProps {
  amount: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function PriceTag({ amount, size = "md", className = "" }: PriceTagProps) {
  const sizes = { sm: "text-xs", md: "text-sm", lg: "text-base" };

  return (
    <span
      className={`font-mono font-medium ${sizes[size]} ${className}`}
      style={{
        color: "var(--accent-lime)",
        textShadow: "0 0 12px rgba(203, 255, 59, 0.35)",
      }}
    >
      ${amount < 0.01 ? amount.toFixed(4) : amount.toFixed(3)} USDC
    </span>
  );
}
