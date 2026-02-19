import { Hono } from "hono";
import { authMiddleware, memberMiddleware } from "../middleware/auth.ts";
import { getRankedMembers, getUserProgress } from "../lib/progress-calc.ts";
import { LeaderboardPage } from "../views/pages/LeaderboardPage.tsx";
import type { Env } from "../types.ts";

const leaderboard = new Hono<Env>();

leaderboard.use("*", authMiddleware, memberMiddleware);

leaderboard.get("/", (c) => {
  const user = c.get("user");
  const search = c.req.query("search") || undefined;
  const sort = c.req.query("sort") || "juz";
  const page = parseInt(c.req.query("page") || "1", 10);
  const perPage = 20;

  // Get top 3 for the podium cards
  const { members: allTop } = getRankedMembers({ sort: "juz", perPage: 3 });

  // Get paginated members (skip top 3 on page 1)
  const { members, total } = getRankedMembers({ search, sort, page, perPage });

  // Get current user's rank info
  const { members: userRankList } = getRankedMembers({ perPage: 999 });
  const currentUserRank = userRankList.find((m) => m.id === user.id) || null;

  return c.html(
    <LeaderboardPage
      user={user}
      topThree={allTop}
      members={members}
      currentUserRank={currentUserRank}
      page={page}
      totalMembers={total}
      perPage={perPage}
      search={search}
      sort={sort}
    />
  );
});

export { leaderboard as leaderboardRoutes };
