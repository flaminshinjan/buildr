"use client";

import { useEffect, useRef } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(245, 240, 232, 0.8)" }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div
        className="animate-fade-in w-full max-w-lg rounded-xl p-8"
        style={{
          backgroundColor: "var(--bg-primary)",
          border: "1px solid var(--border-light)",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        {title && (
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-card-title" style={{ color: "var(--text-primary)" }}>{title}</h2>
            <button onClick={onClose} className="text-xl transition-colors duration-200" style={{ color: "var(--text-tertiary)" }}>
              ×
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
