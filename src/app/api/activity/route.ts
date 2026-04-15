import { getDb } from "@/lib/db";

export async function GET() {
  const db = getDb();

  const transactions = db
    .prepare(
      `SELECT t.id, t.amount, t.status, t.created_at, t.task_description,
        buyer.name as buyer_name, seller.name as seller_name
      FROM transactions t
      LEFT JOIN agents buyer ON t.buyer_agent_id = buyer.id
      LEFT JOIN agents seller ON t.seller_agent_id = seller.id
      ORDER BY t.created_at DESC LIMIT 10`
    )
    .all();

  const tasks = db
    .prepare(
      "SELECT id, user_input, status, total_cost, created_at FROM tasks ORDER BY created_at DESC LIMIT 10"
    )
    .all();

  return Response.json({ transactions, tasks });
}
