import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { Agent } from "@/lib/schema";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();
  const agent = db.prepare("SELECT * FROM agents WHERE id = ?").get(id) as Agent | undefined;

  if (!agent) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }

  return NextResponse.json(agent);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDb();
  const body = await request.json();

  const fields: string[] = [];
  const values: unknown[] = [];

  for (const [key, value] of Object.entries(body)) {
    if (["name", "description", "category", "price_per_call", "endpoint", "status", "rating", "total_jobs", "total_earned"].includes(key)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
  }

  if (fields.length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  fields.push("updated_at = datetime('now')");
  values.push(id);

  db.prepare(`UPDATE agents SET ${fields.join(", ")} WHERE id = ?`).run(...values);

  const agent = db.prepare("SELECT * FROM agents WHERE id = ?").get(id) as Agent;
  return NextResponse.json(agent);
}
