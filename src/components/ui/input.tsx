"use client";

import { InputHTMLAttributes, TextareaHTMLAttributes, useState } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  prefix?: string;
  suffix?: string;
}

const fieldBaseStyle = (focused: boolean): React.CSSProperties => ({
  backgroundColor: "var(--bg-card)",
  border: `1px solid ${focused ? "var(--accent-lime)" : "var(--border-light)"}`,
  borderRadius: 8,
  color: "var(--text-primary)",
  padding: "12px 14px",
  boxShadow: focused ? "0 0 0 3px var(--accent-lime-glow)" : "none",
  transition: "border-color 150ms ease, box-shadow 150ms ease",
  outline: "none",
  width: "100%",
});

export function Input({
  label,
  prefix,
  suffix,
  className = "",
  onFocus,
  onBlur,
  style,
  ...props
}: InputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="w-full">
      {label && (
        <label
          className="mb-2 block text-sm font-medium"
          style={{ color: "var(--text-secondary)" }}
        >
          {label}
        </label>
      )}
      <div
        className="flex items-center"
        style={{ ...fieldBaseStyle(focused), padding: 0 }}
      >
        {prefix && (
          <span
            className="font-mono text-sm pl-3.5"
            style={{ color: "var(--text-muted)" }}
          >
            {prefix}
          </span>
        )}
        <input
          className={`w-full bg-transparent text-body outline-none ${className}`}
          style={{
            color: "var(--text-primary)",
            padding: "12px 14px",
            paddingLeft: prefix ? 8 : 14,
            paddingRight: suffix ? 8 : 14,
            ...style,
          }}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...props}
        />
        {suffix && (
          <span
            className="font-mono text-sm pr-3.5"
            style={{ color: "var(--text-muted)" }}
          >
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function Textarea({
  label,
  className = "",
  onFocus,
  onBlur,
  style,
  ...props
}: TextareaProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="w-full">
      {label && (
        <label
          className="mb-2 block text-sm font-medium"
          style={{ color: "var(--text-secondary)" }}
        >
          {label}
        </label>
      )}
      <textarea
        className={`w-full resize-none text-body ${className}`}
        style={{ ...fieldBaseStyle(focused), ...style }}
        rows={4}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        {...props}
      />
    </div>
  );
}
