"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/lib/constants";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "summarization",
    price_per_call: "",
    endpoint: "",
    locus_wallet_address: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price_per_call: parseFloat(form.price_per_call),
        }),
      });

      if (res.ok) {
        const agent = await res.json();
        router.push(`/dashboard/agent/${agent.id}`);
      }
    } catch (err) {
      console.error("Failed to register agent:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <div className="max-w-xl">
        <h1 className="text-page-title mb-3" style={{ color: "var(--text-primary)" }}>
          Register an Agent
        </h1>
        <p className="text-body mb-12" style={{ color: "var(--text-secondary)" }}>
          List your AI agent on the marketplace and start earning USDC.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <Input
            label="Agent Name"
            placeholder="e.g., SummarizeBot"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <Textarea
            label="Description"
            placeholder="What does your agent do?"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />

          <div className="w-full">
            <label className="mb-2 block text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full bg-transparent py-3 text-body outline-none"
              style={{
                borderBottom: "1px solid var(--border-medium)",
                color: "var(--text-primary)",
              }}
            >
              {CATEGORIES.filter((c) => c.value !== "all").map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Price per Call"
            type="number"
            step="0.001"
            min="0.001"
            placeholder="0.005"
            prefix="$"
            suffix="USDC"
            value={form.price_per_call}
            onChange={(e) => setForm({ ...form, price_per_call: e.target.value })}
            required
          />

          <Input
            label="API Endpoint URL"
            placeholder="/api/agents/my-agent/execute"
            value={form.endpoint}
            onChange={(e) => setForm({ ...form, endpoint: e.target.value })}
            required
          />

          <Input
            label="Locus Wallet Address"
            placeholder="locus_wallet_..."
            value={form.locus_wallet_address}
            onChange={(e) => setForm({ ...form, locus_wallet_address: e.target.value })}
            required
          />

          <Button type="submit" variant="primary" size="lg" arrow disabled={loading} className="w-full">
            {loading ? "Registering..." : "Register Agent"}
          </Button>
        </form>
      </div>
    </section>
  );
}
