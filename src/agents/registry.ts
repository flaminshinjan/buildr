import { getDb } from "@/lib/db";
import { Agent } from "@/lib/schema";

export function findAgentsByCategory(category: string): Agent[] {
  const db = getDb();
  return db.prepare("SELECT * FROM agents WHERE category = ? AND status = 'online' ORDER BY rating DESC").all(category) as Agent[];
}

export function findBestAgent(category: string): Agent | null {
  const agents = findAgentsByCategory(category);
  return agents.length > 0 ? agents[0] : null;
}

export function getAllOnlineAgents(): Agent[] {
  const db = getDb();
  return db.prepare("SELECT * FROM agents WHERE status = 'online' ORDER BY rating DESC").all() as Agent[];
}

export function getAgentById(id: string): Agent | null {
  const db = getDb();
  return (db.prepare("SELECT * FROM agents WHERE id = ?").get(id) as Agent) || null;
}

export function updateAgentStatus(id: string, status: "online" | "offline" | "busy") {
  const db = getDb();
  db.prepare("UPDATE agents SET status = ?, updated_at = datetime('now') WHERE id = ?").run(status, id);
}

export function incrementAgentStats(id: string, amount: number) {
  const db = getDb();
  db.prepare("UPDATE agents SET total_jobs = total_jobs + 1, total_earned = total_earned + ?, updated_at = datetime('now') WHERE id = ?").run(amount, id);
}
