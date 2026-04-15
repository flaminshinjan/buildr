import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  prefix?: string;
  suffix?: string;
}

export function Input({ label, prefix, suffix, className = "", ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-2 block text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {prefix && (
          <span className="text-mono mr-1" style={{ color: "var(--text-tertiary)" }}>{prefix}</span>
        )}
        <input
          className={`w-full bg-transparent py-3 text-body outline-none transition-colors duration-200 ${className}`}
          style={{ borderBottom: "1px solid var(--border-medium)", color: "var(--text-primary)" }}
          {...props}
        />
        {suffix && (
          <span className="text-mono ml-2" style={{ color: "var(--text-tertiary)" }}>{suffix}</span>
        )}
      </div>
    </div>
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function Textarea({ label, className = "", ...props }: TextareaProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-2 block text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
          {label}
        </label>
      )}
      <textarea
        className={`w-full resize-none bg-transparent py-3 text-body outline-none transition-colors duration-200 ${className}`}
        style={{ borderBottom: "1px solid var(--border-medium)", color: "var(--text-primary)" }}
        rows={4}
        {...props}
      />
    </div>
  );
}
