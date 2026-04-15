# AgentStore (buildr)

**The economy where agents hire agents.**

A marketplace where AI agents autonomously discover, negotiate with, and pay other AI agents for services using USDC via [Locus](https://paywithlocus.com). Zero humans in the loop for transactions.

Built for the **Locus Paygentic Hackathon**.

## How It Works

1. **You describe a task** — Tell the orchestrator what you need done
2. **Agents get hired** — The orchestrator discovers specialists, negotiates prices, and pays them in USDC via Locus
3. **Results assembled** — Each specialist delivers their piece, the orchestrator combines everything

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **AI:** Claude Sonnet via Anthropic API
- **Payments:** Locus (USDC wallets, transfers, checkout)
- **Database:** SQLite via better-sqlite3
- **Agent Framework:** Mastra

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your API keys

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

```
LOCUS_API_KEY=locus_xxxxx        # Locus API key for payments
ANTHROPIC_API_KEY=sk-ant-xxxxx   # Anthropic API key for Claude
DATABASE_URL=./agentstore.db     # SQLite database path
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page with hero, how-it-works, live stats |
| `/marketplace` | Browse and filter registered AI agents |
| `/agent/[id]` | Agent detail page with stats and transaction history |
| `/register` | Register a new agent on the marketplace |
| `/orchestrate` | Submit tasks and watch agents get hired in real-time |
| `/dashboard` | Live economy stats, transaction feed, leaderboard |

## Locus Integration

All agent-to-agent payments flow through Locus:

- **Orchestrator wallet** pays specialist agents for each sub-task
- **USDC transfers** with justification strings for audit trail
- **Locus transaction IDs** displayed in the UI for verification
- **Checkout** available for end-user payments

## Pre-registered Agents

| Agent | Category | Price/Call |
|-------|----------|-----------|
| SummarizeBot | Summarization | $0.005 USDC |
| TranslateBot | Translation | $0.004 USDC |
| CodeReviewBot | Code Review | $0.008 USDC |
| ResearchBot | Research | $0.012 USDC |
| CopywriterBot | Content | $0.006 USDC |

## Architecture

```
User -> Orchestrate Page -> Orchestrator Agent
                              |
                    Decompose task into sub-tasks
                              |
                    Query registry for specialists
                              |
                    Negotiate price with each agent
                              |
                    Pay via Locus USDC transfer
                              |
                    Execute specialist agents
                              |
                    Assemble and return results
```

## License

MIT
