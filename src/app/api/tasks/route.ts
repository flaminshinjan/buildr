import { NextRequest } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(request: NextRequest) {
  const db = getDb();
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "50");

  const tasks = db
    .prepare("SELECT * FROM tasks ORDER BY created_at DESC LIMIT ?")
    .all(limit);

  return Response.json(tasks);
}
