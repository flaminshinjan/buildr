import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  arrow?: boolean;
}

const variantStyles: Record<string, React.CSSProperties> = {
  primary: { backgroundColor: "var(--text-primary)", color: "white" },
  secondary: {
    backgroundColor: "transparent",
    border: "1px solid var(--border-medium)",
    color: "var(--text-primary)",
  },
  ghost: { backgroundColor: "transparent", color: "var(--text-secondary)" },
};

export function Button({
  variant = "primary",
  size = "md",
  arrow = false,
  children,
  className = "",
  ...props
}: ButtonProps) {
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };

  return (
    <button
      className={`group inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 ${sizes[size]} ${className}`}
      style={variantStyles[variant]}
      {...props}
    >
      {children}
      {arrow && (
        <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
      )}
    </button>
  );
}
