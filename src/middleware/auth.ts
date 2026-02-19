import { createMiddleware } from "hono/factory";
import { getCookie } from "hono/cookie";
import { getSessionUser } from "../lib/session.ts";
import type { Env } from "../types.ts";

export const authMiddleware = createMiddleware<Env>(async (c, next) => {
  const sessionId = getCookie(c, "session");
  if (!sessionId) {
    return c.redirect("/login");
  }

  const user = getSessionUser(sessionId);
  if (!user) {
    return c.redirect("/login");
  }

  c.set("user", user);
  await next();
});

export const memberMiddleware = createMiddleware<Env>(async (c, next) => {
  const user = c.get("user");
  if (user.role === "pending") {
    return c.redirect("/pending");
  }
  await next();
});

export const adminMiddleware = createMiddleware<Env>(async (c, next) => {
  const user = c.get("user");
  if (user.role !== "admin") {
    return c.redirect("/leaderboard");
  }
  await next();
});
