import { Hono } from "hono";
import { authMiddleware, memberMiddleware } from "../middleware/auth.ts";
import { getUserProgress, getRankedMembers } from "../lib/progress-calc.ts";
import { DashboardPage } from "../views/pages/DashboardPage.tsx";
import type { Env } from "../types.ts";

const dashboard = new Hono<Env>();

dashboard.use("*", authMiddleware, memberMiddleware);

dashboard.get("/", (c) => {
  const user = c.get("user");
  const userProgress = getUserProgress(user.id);

  // Get user's rank
  const { members } = getRankedMembers({ perPage: 999 });
  const rank = members.find((m) => m.id === user.id) || null;

  return c.html(
    <DashboardPage
      user={user}
      entries={userProgress.entries}
      juzCompleted={userProgress.juzCompleted}
      progressPercent={userProgress.progressPercent}
      totalMemorized={userProgress.totalMemorized}
      rank={rank}
      currentLocation={userProgress.currentLocation}
    />
  );
});

export { dashboard as dashboardRoutes };
