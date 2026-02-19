# Quran Tahfiz Tracker

A Quran memorization (tahfiz) and reading (iqra) progress tracking app for communities. Members log their hafalan progress surah by surah, and a leaderboard keeps everyone motivated.

![Quran Tahfiz Tracker](https://imgmu.id/f/ae0c0cc.png)

## Features

- **Google OAuth** — sign in with Google; new accounts go into a pending state until an admin approves them
- **Progress tracking** — log how far you've memorized in each surah (by ayah), with full history in a progress log
- **Juz completion** — automatically computed from surah/ayah progress across all 30 juz
- **Leaderboard** — ranked by juz completed or total ayahs memorized, with top-3 podium cards, search, and pagination
- **Personal dashboard** — see your overall percentage, juz count, current location in the Quran, and your rank
- **Admin panel** — approve/reject pending users and change member roles

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | [Bun](https://bun.sh) |
| Framework | [Hono](https://hono.dev) (JSX SSR) |
| Database | SQLite via `bun:sqlite` |
| Styling | TailwindCSS (CDN) |
| Auth | Google OAuth 2.0 |

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) v1.0+
- A Google Cloud project with OAuth 2.0 credentials

### 1. Clone and install

```bash
git clone <repo-url>
cd ngaji
bun install
```

### 2. Configure environment

Create a `.env` file in the project root:

```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
APP_URL=http://localhost:3000
PORT=3000
```

Set the authorized redirect URI in your Google Cloud Console to:

```
http://localhost:3000/auth/google/callback
```

### 3. Run

```bash
# Development (hot reload)
bun run dev

# Production
bun run start
```

The app will be available at `http://localhost:3000`.

> **No build step required.** Bun executes TypeScript directly, and TailwindCSS is loaded from CDN. `bun run start` is the production command — there is no `bun run build`.

## Deploying to Production

Since there is no build step, deploying is just running `bun run start` with the right environment variables set.

### Environment variables for production

```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
APP_URL=https://your-domain.com
PORT=3000
NODE_ENV=production
```

Update the authorized redirect URI in Google Cloud Console to match your domain:

```
https://your-domain.com/auth/google/callback
```

### PM2 (Linux VPS)

Use the included `ecosystem.config.cjs` to avoid Bun/PM2 compatibility issues:

```bash
npm install -g pm2

# Start using the ecosystem config
pm2 start ecosystem.config.cjs

# Auto-restart on server reboot
pm2 save
pm2 startup
```

Common PM2 commands:

```bash
pm2 status          # Check running processes
pm2 logs ngaji      # Tail logs
pm2 restart ngaji   # Restart
pm2 stop ngaji      # Stop
```

### Nginx (reverse proxy)

A sample config is provided in `nginx.conf.example`. Copy and adapt it:

```bash
sudo cp nginx.conf.example /etc/nginx/sites-available/ngaji
# Edit: replace your-domain.com, adjust PORT if needed
sudo ln -s /etc/nginx/sites-available/ngaji /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

The config handles HTTP → HTTPS redirect, SSL termination, and proxying to the Bun app on `PORT`.

### Docker

```dockerfile
FROM oven/bun:1
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile
COPY . .
EXPOSE 3000
CMD ["bun", "run", "start"]
```

```bash
docker build -t ngaji .
docker run -d -p 3000:3000 --env-file .env -v $(pwd)/data:/app/data ngaji
```

> Mount the `data/` directory as a volume so the SQLite database persists across container restarts.

## User Roles

| Role | Description |
|---|---|
| `pending` | Newly registered; can only see the waiting page |
| `member` | Approved; can log progress and view the leaderboard |
| `admin` | Can approve/reject users and manage roles |

The **first user** to sign in is automatically granted the `admin` role.

## Project Structure

```
src/
├── index.tsx           # Entry point, route mounting
├── types.ts            # Shared TypeScript types
├── data/
│   └── quran-meta.ts   # Static data: 114 surahs, 30 juz boundaries
├── db/
│   ├── connection.ts   # SQLite connection
│   └── schema.ts       # Table definitions & initialization
├── lib/
│   ├── session.ts      # Session management
│   └── progress-calc.ts# Juz/ayah progress calculations
├── middleware/
│   └── auth.ts         # authMiddleware, memberMiddleware, adminMiddleware
├── routes/
│   ├── auth.ts         # Google OAuth flow & logout
│   ├── dashboard.tsx   # Personal stats page
│   ├── leaderboard.tsx # Community rankings
│   ├── progress.tsx    # Log & view memorization progress
│   └── admin.tsx       # User management
└── views/
    ├── Layout.tsx      # Base HTML layout with Tailwind config
    ├── components/     # Shared UI components
    └── pages/          # Full page components
data/
└── ngaji.db            # SQLite database (auto-created)
```

## Database Schema

- **`users`** — Google profile, role, timestamps
- **`sessions`** — session tokens with expiry (7-day TTL)
- **`progress_entries`** — latest `last_ayah` per user per surah (upserted on update)
- **`progress_log`** — append-only history of every progress change
