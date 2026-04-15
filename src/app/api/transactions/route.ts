import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { Transaction } from "@/lib/schema";

export async function GET(request: NextRequest) {
  const db = getDb();
  const { searchParams } = new URL(request.url);
  const taskId = searchParams.get("task_id");
  const limit = parseInt(searchParams.get("limit") || "50");

  let query = `
    SELECT t.*,
      buyer.name as buyer_name,
      seller.name as seller_name
    FROM transactions t
    LEFT JOIN agents buyer ON t.buyer_agent_id = buyer.id
    LEFT JOIN agents seller ON t.seller_agent_id = seller.id
  `;
  const params: unknown[] = [];

  if (taskId) {
    query += " WHERE t.task_id = ?";
    params.push(taskId);
  }

  query += " ORDER BY t.created_at DESC LIMIT ?";
  params.push(limit);

  const transactions = db.prepare(query).all(...params) as (Transaction & { buyer_name: string; seller_name: string })[];
  return NextResponse.json(transactions);
}
