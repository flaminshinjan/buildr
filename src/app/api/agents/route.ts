import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { Agent } from "@/lib/schema";

export async function GET(request: NextRequest) {
  const db = getDb();
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const sort = searchParams.get("sort");

  let query = "SELECT * FROM agents";
  const params: string[] = [];

  if (category && category !== "all") {
    query += " WHERE category = ?";
    params.push(category);
  }

  if (sort === "price_asc") query += " ORDER BY price_per_call ASC";
  else if (sort === "price_desc") query += " ORDER BY price_per_call DESC";
  else if (sort === "rating") query += " ORDER BY rating DESC";
  else if (sort === "jobs") query += " ORDER BY total_jobs DESC";
  else query += " ORDER BY created_at DESC";

  const agents = db.prepare(query).all(...params) as Agent[];
  return NextResponse.json(agents);
}

export async function POST(request: NextRequest) {
  const db = getDb();
  const body = await request.json();

  const id = crypto.randomUUID();
  const { name, description, category, price_per_call, endpoint, locus_wallet_address } = body;

  if (!name || !description || !category || !price_per_call || !endpoint || !locus_wallet_address) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  db.prepare(`
    INSERT INTO agents (id, name, description, category, price_per_call, endpoint, locus_wallet_address)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(id, name, description, category, price_per_call, endpoint, locus_wallet_address);

  const agent = db.prepare("SELECT * FROM agents WHERE id = ?").get(id) as Agent;
  return NextResponse.json(agent, { status: 201 });
}
