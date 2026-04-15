import { getDb } from "@/lib/db";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = getDb();
  const task = db.prepare("SELECT * FROM tasks WHERE id = ?").get(id);

  if (!task) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const transactions = db
    .prepare(
      "SELECT t.*, s.name as seller_name FROM transactions t LEFT JOIN agents s ON t.seller_agent_id = s.id WHERE t.task_id = ? ORDER BY t.created_at ASC"
    )
    .all(id);

  return Response.json({ ...task, transactions });
}
