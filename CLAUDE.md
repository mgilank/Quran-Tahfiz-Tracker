# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```sh
# Development (hot reload)
bun run dev        # bun --hot src/index.tsx

# Production
bun run start      # bun src/index.tsx

# Tests
bun test
```

## Bun-specific conventions

- Use `bun <file>` instead of `node` or `ts-node`
- Use `bun:sqlite` (not `better-sqlite3`), `Bun.file` (not `fs`), `Bun.serve()` (not `express`)
- Bun auto-loads `.env` — no dotenv needed

## Required environment variables

```
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
APP_URL=http://localhost:3000    # used to build OAuth redirect_uri
PORT=3000                        # optional, defaults to 3000
```

## Architecture

**Stack:** Bun + Hono (JSX SSR) + SQLite (`bun:sqlite`) + TailwindCSS (CDN, no build step)

**Entry point:** `src/index.tsx` — initializes DB, mounts all routes, exports `{ port, fetch }` for `Bun.serve()`.

**Request lifecycle:**
1. `src/middleware/auth.ts` — three middleware layers:
   - `authMiddleware`: reads `session` cookie → resolves `User` from DB → sets `c.get("user")`
   - `memberMiddleware`: blocks `pending` users (requires `authMiddleware` first)
   - `adminMiddleware`: blocks non-admins
2. Routes in `src/routes/` render JSX pages from `src/views/pages/` via `c.html(...)`

**Data flow for progress:**
- `src/data/quran-meta.ts` — static Quran metadata (114 surahs, juz boundaries)
- `src/lib/progress-calc.ts` — all progress calculations: `getRankedMembers()`, `getUserProgress()`, juz completion, trend (7-day window from `progress_log`)
- DB tables: `users`, `sessions`, `progress_entries` (upserted per surah), `progress_log` (append-only history)

**Database:** SQLite at `data/ngaji.db`. WAL mode + foreign keys enabled. Schema initialised in `src/db/schema.ts` via `initializeDatabase()` called on startup. All queries use `bun:sqlite` prepared statements with manual type casts (`.get() as Type | null`).

**Auth:** Google OAuth 2.0. First registered user auto-promoted to `admin`. New users get role `pending` until an admin approves them. Sessions expire after 7 days.

**Styling:** TailwindCSS loaded from CDN with `?plugins=forms,container-queries`. Custom theme (colors, fonts) is configured inline in `src/views/Layout.tsx` via a `<script>` block — **not** a `tailwind.config.js` file.

## Key file locations

| Concern | File |
|---|---|
| DB connection | `src/db/connection.ts` |
| DB schema | `src/db/schema.ts` |
| Session + user upsert | `src/lib/session.ts` |
| Progress calculation | `src/lib/progress-calc.ts` |
| Quran metadata | `src/data/quran-meta.ts` |
| Shared types | `src/types.ts` |
| Auth middleware | `src/middleware/auth.ts` |
| Tailwind theme | `src/views/Layout.tsx` |

## JSX / TypeScript notes

- Route files that use JSX **must** use `.tsx` extension
- `tsconfig.json` sets `"jsxImportSource": "hono/jsx"` — use `hono/jsx` types (`FC`, `Child`), not React
- `db.prepare().get()` returns `unknown`; always cast: `.get(...) as MyType | null`
- `Env` type (`src/types.ts`) parameterises `Hono<Env>` so `c.get("user")` is typed as `User`
