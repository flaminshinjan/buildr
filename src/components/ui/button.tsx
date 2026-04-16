"use client";

import { ButtonHTMLAttributes, CSSProperties, useState } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  arrow?: boolean;
}

type VariantState = {
  base: CSSProperties;
  hover: CSSProperties;
};

const variantStyles: Record<string, VariantState> = {
  primary: {
    base: {
      backgroundColor: "var(--accent-lime)",
      color: "var(--text-inverse)",
      border: "1px solid var(--accent-lime)",
      fontWeight: 600,
    },
    hover: {
      backgroundColor: "var(--accent-lime-bright)",
      color: "var(--text-inverse)",
      border: "1px solid var(--accent-lime-bright)",
      fontWeight: 600,
      boxShadow: "var(--shadow-glow)",
    },
  },
  secondary: {
    base: {
      backgroundColor: "transparent",
      border: "1px solid var(--border-medium)",
      color: "var(--text-primary)",
      fontWeight: 500,
    },
    hover: {
      backgroundColor: "transparent",
      border: "1px solid var(--accent-lime)",
      color: "var(--accent-lime)",
      fontWeight: 500,
    },
  },
  ghost: {
    base: {
      backgroundColor: "transparent",
      border: "1px solid transparent",
      color: "var(--text-secondary)",
      fontWeight: 500,
    },
    hover: {
      backgroundColor: "transparent",
      border: "1px solid transparent",
      color: "var(--text-primary)",
      fontWeight: 500,
    },
  },
};

export function Button({
  variant = "primary",
  size = "md",
  arrow = false,
  children,
  className = "",
  onMouseEnter,
  onMouseLeave,
  ...props
}: ButtonProps) {
  const [hovered, setHovered] = useState(false);

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const style = hovered ? variantStyles[variant].hover : variantStyles[variant].base;

  return (
    <button
      className={`group inline-flex items-center justify-center gap-2 rounded-full transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${sizes[size]} ${className}`}
      style={style}
      onMouseEnter={(e) => {
        setHovered(true);
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        setHovered(false);
        onMouseLeave?.(e);
      }}
      {...props}
    >
      {children}
      {arrow && (
        <span className="transition-transform duration-150 group-hover:translate-x-1">→</span>
      )}
    </button>
  );
}
