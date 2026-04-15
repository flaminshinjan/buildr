import Database from "better-sqlite3";
import path from "path";

const DB_PATH = process.env.DATABASE_URL || path.join(process.cwd(), "agentstore.db");

let db: Database.Database;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    initializeDb(db);
  }
  return db;
}

function initializeDb(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS agents (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      price_per_call REAL NOT NULL,
      input_schema TEXT,
      output_schema TEXT,
      endpoint TEXT NOT NULL,
      locus_wallet_address TEXT NOT NULL,
      status TEXT DEFAULT 'online',
      rating REAL DEFAULT 5.0,
      total_jobs INTEGER DEFAULT 0,
      total_earned REAL DEFAULT 0.0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      task_id TEXT NOT NULL,
      buyer_agent_id TEXT NOT NULL,
      seller_agent_id TEXT NOT NULL,
      amount REAL NOT NULL,
      negotiated_from REAL,
      negotiated_to REAL,
      status TEXT DEFAULT 'pending',
      locus_tx_id TEXT,
      task_description TEXT,
      result TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      completed_at TEXT
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      user_input TEXT NOT NULL,
      status TEXT DEFAULT 'decomposing',
      sub_tasks TEXT,
      final_result TEXT,
      total_cost REAL DEFAULT 0.0,
      created_at TEXT DEFAULT (datetime('now')),
      completed_at TEXT
    );
  `);

  const count = db.prepare("SELECT COUNT(*) as count FROM agents").get() as { count: number };
  if (count.count === 0) {
    seedAgents(db);
  }
}

function seedAgents(db: Database.Database) {
  const insert = db.prepare(`
    INSERT INTO agents (id, name, description, category, price_per_call, endpoint, locus_wallet_address, status, rating, total_jobs, total_earned)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const agents = [
    {
      id: crypto.randomUUID(),
      name: "SummarizeBot",
      description: "Condenses long documents, articles, and text into clear, structured summaries with key takeaways.",
      category: "summarization",
      price_per_call: 0.005,
      endpoint: "/api/agents/summarizer/execute",
      wallet: "locus_wallet_summarizer",
      status: "online",
      rating: 4.9,
      jobs: 23,
      earned: 0.115,
    },
    {
      id: crypto.randomUUID(),
      name: "TranslateBot",
      description: "Translates text between 50+ languages while preserving tone and context. Specializes in technical and business content.",
      category: "translation",
      price_per_call: 0.004,
      endpoint: "/api/agents/translator/execute",
      wallet: "locus_wallet_translator",
      status: "online",
      rating: 4.8,
      jobs: 18,
      earned: 0.072,
    },
    {
      id: crypto.randomUUID(),
      name: "CodeReviewBot",
      description: "Reviews code for bugs, security issues, performance problems, and style. Supports Python, TypeScript, Go, and Rust.",
      category: "code-review",
      price_per_call: 0.008,
      endpoint: "/api/agents/code-reviewer/execute",
      wallet: "locus_wallet_codereviewer",
      status: "online",
      rating: 4.7,
      jobs: 12,
      earned: 0.096,
    },
    {
      id: crypto.randomUUID(),
      name: "ResearchBot",
      description: "Conducts deep research on any topic using web search and data analysis. Returns structured reports with citations.",
      category: "research",
      price_per_call: 0.012,
      endpoint: "/api/agents/researcher/execute",
      wallet: "locus_wallet_researcher",
      status: "online",
      rating: 4.6,
      jobs: 8,
      earned: 0.096,
    },
    {
      id: crypto.randomUUID(),
      name: "CopywriterBot",
      description: "Generates marketing copy, blog posts, social media content, and email sequences optimized for engagement.",
      category: "content",
      price_per_call: 0.006,
      endpoint: "/api/agents/copywriter/execute",
      wallet: "locus_wallet_copywriter",
      status: "online",
      rating: 4.8,
      jobs: 15,
      earned: 0.09,
    },
  ];

  const insertMany = db.transaction(() => {
    for (const a of agents) {
      insert.run(a.id, a.name, a.description, a.category, a.price_per_call, a.endpoint, a.wallet, a.status, a.rating, a.jobs, a.earned);
    }
  });

  insertMany();
}
