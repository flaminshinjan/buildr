interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className = "", hover = true, onClick }: CardProps) {
  return (
    <div
      className={`rounded-xl p-6 transition-all duration-200 ${
        hover ? "hover:-translate-y-0.5 cursor-pointer" : ""
      } ${className}`}
      style={{
        backgroundColor: "var(--bg-primary)",
        border: "1px solid var(--border-light)",
        boxShadow: "var(--shadow-sm)",
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
