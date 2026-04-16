"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

interface MarkdownProps {
  content: string;
  className?: string;
}

const components: Components = {
  h1: ({ children }) => (
    <h1
      style={{
        fontSize: 28,
        fontWeight: 700,
        marginBottom: 16,
        color: "var(--text-primary)",
      }}
    >
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2
      style={{
        fontSize: 22,
        fontWeight: 700,
        marginBottom: 12,
        color: "var(--text-primary)",
        borderBottom: "1px solid var(--border-light)",
        paddingBottom: 8,
      }}
    >
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3
      style={{
        fontSize: 18,
        fontWeight: 700,
        marginBottom: 8,
        color: "var(--text-primary)",
      }}
    >
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4
      style={{
        fontSize: 16,
        fontWeight: 600,
        color: "var(--text-primary)",
      }}
    >
      {children}
    </h4>
  ),
  p: ({ children }) => (
    <p
      style={{
        fontSize: 15,
        lineHeight: 1.7,
        marginBottom: 12,
        color: "var(--text-secondary)",
      }}
    >
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul
      style={{
        marginLeft: 24,
        marginBottom: 12,
        listStyleType: "disc",
        color: "var(--text-secondary)",
      }}
    >
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol
      style={{
        marginLeft: 24,
        marginBottom: 12,
        listStyleType: "decimal",
        color: "var(--text-secondary)",
      }}
    >
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li
      style={{
        marginBottom: 4,
        lineHeight: 1.6,
        color: "var(--text-secondary)",
      }}
    >
      {children}
    </li>
  ),
  code: ({ children, className }) => {
    const isBlock = className?.includes("language-");
    if (isBlock) {
      return (
        <code
          style={{
            display: "block",
            backgroundColor: "#0A0A0A",
            color: "var(--text-primary)",
            padding: 16,
            borderRadius: 12,
            border: "1px solid var(--border-light)",
            overflowX: "auto",
            fontFamily: "var(--font-mono, monospace)",
            fontSize: 13,
            lineHeight: 1.6,
          }}
        >
          {children}
        </code>
      );
    }
    return (
      <code
        style={{
          backgroundColor: "var(--bg-elevated)",
          color: "var(--accent-lime)",
          border: "1px solid var(--border-light)",
          padding: "2px 6px",
          borderRadius: 4,
          fontFamily: "var(--font-mono, monospace)",
          fontSize: 13,
        }}
      >
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre
      style={{
        marginBottom: 12,
      }}
    >
      {children}
    </pre>
  ),
  blockquote: ({ children }) => (
    <blockquote
      style={{
        borderLeft: "3px solid var(--accent-lime)",
        paddingLeft: 16,
        backgroundColor: "var(--bg-elevated)",
        padding: "12px 16px",
        borderRadius: "0 8px 8px 0",
        fontStyle: "italic",
        marginBottom: 12,
        color: "var(--text-secondary)",
      }}
    >
      {children}
    </blockquote>
  ),
  strong: ({ children }) => (
    <strong
      style={{
        fontWeight: 700,
        color: "var(--text-primary)",
      }}
    >
      {children}
    </strong>
  ),
  a: ({ children, href }) => (
    <a
      href={href}
      style={{
        color: "var(--accent-lime)",
        textDecoration: "underline",
      }}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  hr: () => (
    <hr
      style={{
        margin: "24px 0",
        border: "none",
        borderTopWidth: 1,
        borderTopStyle: "solid",
        borderTopColor: "var(--border-light)",
      }}
    />
  ),
  table: ({ children }) => (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        border: "1px solid var(--border-light)",
        marginBottom: 12,
      }}
    >
      {children}
    </table>
  ),
  th: ({ children }) => (
    <th
      style={{
        backgroundColor: "var(--bg-elevated)",
        color: "var(--text-primary)",
        padding: "8px 12px",
        textAlign: "left",
        fontWeight: 600,
        fontSize: 13,
        borderBottom: "1px solid var(--border-light)",
      }}
    >
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td
      style={{
        padding: "8px 12px",
        borderTop: "1px solid var(--border-light)",
        fontSize: 14,
        color: "var(--text-secondary)",
      }}
    >
      {children}
    </td>
  ),
};

export function Markdown({ content, className }: MarkdownProps) {
  return (
    <div className={className}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
