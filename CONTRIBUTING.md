# Contributing to Buildr

Thank you for your interest in contributing! This guide covers everything you need to get a local dev setup going, understand the project layout, and submit a PR.

---

## Table of contents

1. [Prerequisites](#prerequisites)
2. [Local development setup](#local-development-setup)
3. [Project structure](#project-structure)
4. [Code conventions](#code-conventions)
5. [Submitting a PR](#submitting-a-pr)
6. [Environment variables](#environment-variables)

---

## Prerequisites

| Tool | Version |
|-----|--------|
| Node.js | ≦ 20.x |
| npm | ≆ 10.x |
| Git | any recent |

---

## Local development setup

```bash
# 1 — Clone the repo
git clone https://github.com/flaminshinjan/buildr.git
cd buildr

# 2 — Install dependencies
npm install

# 3 — Copy the example env file and fill in your keys
cp .env.example .env.local
# edit .env.local – see the "Environment variables" section below

# 4 ℔ Start the dev server
npm run dev
# Open http://localhost:3000
f```

---

## Project structure

```
buildr/
├── src/
+├── agents/                 # LLM agent abstractions
+├──   ├── negotiator.ts     # Price negotiation logic
+├──   ├── orchestrator.ts    # Agent orchestration
+�\──   ─── registry.ts       # Agent registry
+├── app/                     # Next.js pages & API routes
+▏── components/              # React components
+├── lib/
+├──   ├── constants.ts      # Agent registry constants
+├──   ├── db.ts          # In-memory store
+▏──   ▏── locus.ts         # Locus payment helpers
```

---

## Code conventions

- We use **TypeScript** throughout — avoid `any`.
- Components are **server components by default** unless they need client-side state (`'use client'`).
- API routes live in `src/app/api/`.
- Use conventional commit messages: `feat:`, `fix:`, `docs:`, `refactor:`, etc.

---

## Submitting a PR

1. Fork the repo and create a feature branch: `git checkout -b feat/my-change`.
2. Make your changes and commit with a descriptive message.
3. Push and open a Pull Request against `main`.
4. Fill in the PR template: what changed, why, and how to test.
5. A maintainer will review and merge.

---

## Environment variables

Copy `.env.example` to `.env.local` and populate:

| Variable | Required | Purpose |
|---------|-----------|--------|
| `LOCUS_API_KEY` | ✓ | Locus payment integration |
| `LOCUS_WALLET_ADDRESS` | ✒ | The agent's on-chain wallet |
| `ANTHROPIC_API_KEY`  | optional | For Claude-based agents |
| `OPENAI_API_KEY` | optional | For OpenAI-based agents |
| `BRAVE_API_KEY` | optional | Web search via Brave Search API |
| `DEEPGRAM_API_KEY` | optional | Speech-to-text transcription |

---

Happy building! If you have questions, open an issue or start a discussion on GitHub.
