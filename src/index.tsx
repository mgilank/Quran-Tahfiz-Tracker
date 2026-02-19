import { Hono } from "hono";
import { getCookie } from "hono/cookie";
import { initializeDatabase } from "./db/schema.ts";
import { getSessionUser, cleanExpiredSessions } from "./lib/session.ts";
import { authRoutes } from "./routes/auth.ts";
import { leaderboardRoutes } from "./routes/leaderboard.tsx";
import { progressRoutes } from "./routes/progress.tsx";
import { adminRoutes } from "./routes/admin.tsx";
import { dashboardRoutes } from "./routes/dashboard.tsx";
import { LoginPage } from "./views/pages/LoginPage.tsx";
import { PendingPage } from "./views/pages/PendingPage.tsx";
import { Layout } from "./views/Layout.tsx";
import { authMiddleware } from "./middleware/auth.ts";
import type { Env } from "./types.ts";

// Initialize database tables
initializeDatabase();

// Clean expired sessions on startup
cleanExpiredSessions();

const app = new Hono<Env>();

// Root route - redirect based on auth state
app.get("/", (c) => {
  const sessionId = getCookie(c, "session");
  if (sessionId) {
    const user = getSessionUser(sessionId);
    if (user) {
      if (user.role === "pending") return c.redirect("/pending");
      return c.redirect("/leaderboard");
    }
  }
  return c.redirect("/login");
});

// Login page
app.get("/login", (c) => {
  const sessionId = getCookie(c, "session");
  if (sessionId) {
    const user = getSessionUser(sessionId);
    if (user && user.role !== "pending") return c.redirect("/leaderboard");
  }
  const error = c.req.query("error");
  return c.html(<LoginPage error={error} />);
});

// Pending page
app.get("/pending", authMiddleware, (c) => {
  const user = c.get("user");
  if (user.role !== "pending") return c.redirect("/leaderboard");
  return c.html(<PendingPage user={user} />);
});

// Mount routes
app.route("/auth", authRoutes);
app.route("/leaderboard", leaderboardRoutes);
app.route("/progress", progressRoutes);
app.route("/admin", adminRoutes);
app.route("/dashboard", dashboardRoutes);

// 404
app.notFound((c) => {
  return c.html(
    <Layout title="Not Found - Tahfiz Community">
      <div class="flex-1 flex items-center justify-center">
        <div class="text-center">
          <h1 class="text-6xl font-black text-text-secondary mb-4">404</h1>
          <p class="text-text-secondary mb-6">Page not found</p>
          <a href="/" class="text-primary font-bold hover:underline">
            Go Home
          </a>
        </div>
      </div>
    </Layout>,
    404
  );
});

const port = parseInt(process.env.PORT || "3000", 10);
console.log(`Tahfiz Community running at http://localhost:${port}`);

export default {
  port,
  fetch: app.fetch,
};
