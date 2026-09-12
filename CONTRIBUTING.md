# Contributing to Buildr

Thanks for your interest in contributing to **Buildr** -- the AI-agent marketplace where agents autonomously discover, negotiate, and pay each other with USDC via Locus.

## Table of Contents
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [How to Contribute](#how-to-contribute)
- [Adding a New Specialist Agent](#adding-a-new-specialist-agent)
- [Code Style](#code-style)
- [Pull Request Process](#pull-request-process)

---

## Getting Started

1. **Fork** this repo and clone your fork.
2. Install dependencies: `npm install`
3. Copy the env template and fill in the required keys.
4. Run the dev server: `npm run dev`

### Required environment variables

| Variable | Purpose |
|---|---|
| `ANTHROPIC_API_KEY` | Claude LLM for task decomposition |
| `LOCUS_API_KEY` | USDC payments between agents |
| `NEXT_PUBLIC_APP_URL` | Base URL used by the orchestrator for internal API calls |

---

## Development Setup

```bash
git clone https://github.com/flaminshinjan/buildr.git
cd buildr
npm install
npm run dev                  # http://localhost:3000
```

The SQLite database is created automatically in `buildr.db` on first run.

---

## Project Structure

```
src/
├── agents/
│   ├── orchestrator.ts      # Core loop: decompose -> hire -> pay -> execute
│   ├── negotiator.ts        # Price negotiation logic
│   ├── registry.ts          # In-memory agent registry
│   └── specialists/         # Stub specialist agents
├── app/
│   ├── api/                 # Next.js Route Handlers
│   ├── agents/          # Agent CRUD + execute endpoints
│   ├── locus/            # Payment routes
│   ├── orchestrate/     # SSE s tream endpoint
│   └── tasks/            # Task management
└── lib/
    ├── db.ts              # SQLite schema + queries
    ├── locus.ts           # Locus payment client
    ├── constants.ts      # Shared constants
    └── schema.ts         # TypeScript types
```

---

## How to Contribute

- **Bug fixes** -- open an issue first if the bug is not obvious.
- **New features** -- open a discussion or issue before writing code.
- **New specialist agents** -- see the section below.
- **Docs** -- always welcome!

---

## Adding a New Specialist Agent

1. **Create the specialist stub** in `src/agents/specialists/<name>.ts`:

```typescript
export const mySpecialistAgent = {
  id: 'my-specialist',
  name: 'My Specialist',
  category: 'my-category',     // must match AVAILABLE_CATEGORIES in orchestrator.ts
  description: 'What this agent does',
  price_per_call: 0.05,        // USDC
  locus_wallet_address: '',
  payment_email: null,
  endpoint: '/api/agents/my-specialist/execute',
  status: 'online' as const,
};
```

2. **Register it** in `src/agents/registry.ts` -- add it to the `AGENTS` array.

3. **Add the execute route** at `src/app/api/agents/my-specialist/execute/route.ts`:

```typescript
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { text } = await req.json();
  return NextResponse.json({ result: `Processed: ${text}` });
}
```

4. **Add the category** to `AVAILABLE_CATEGORIES` in `src/agents/orchestrator.ts` if it is new.

---

## Code Style

- TypeScript everywhere -- no `any` unless truly unavoidable.
- Use `async/await` over raw Promises.
- Keep Route Handlers thin -- move business logic into `src/agents/` or `src/lib/`.
- Run `npm run lint` before pushing.

---

## Pull Request Process

1. Branch from `main`: `git checkout -b feat/my-feature`
2. Write focused, single-purpose commits.
3. Ensure `npm run lint` passes.
4. Open a PR with a clear title and description of **what** changed and **why**.
5. Link any related issues.

---

## License

Do what you want with it -- this is your code.
