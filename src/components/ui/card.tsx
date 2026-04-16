"use client";

import { useState } from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className = "", hover = true, onClick }: CardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`p-6 transition-all duration-150 ${hover ? "cursor-pointer" : ""} ${className}`}
      style={{
        backgroundColor: "var(--bg-card)",
        border: `1px solid ${hover && hovered ? "var(--border-medium)" : "var(--border-light)"}`,
        borderRadius: 12,
      }}
      onMouseEnter={() => hover && setHovered(true)}
      onMouseLeave={() => hover && setHovered(false)}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
