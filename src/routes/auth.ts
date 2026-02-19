import { Hono } from "hono";
import { setCookie, getCookie, deleteCookie } from "hono/cookie";
import { upsertUser, createSession, deleteSession } from "../lib/session.ts";
import { GOOGLE_REDIRECT_URI } from "../config.ts";

const auth = new Hono();

auth.get("/google", (c) => {
  const state = crypto.randomUUID();
  setCookie(c, "oauth_state", state, {
    httpOnly: true,
    maxAge: 300,
    sameSite: "Lax",
    path: "/",
  });

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID || "",
    redirect_uri: GOOGLE_REDIRECT_URI,
    response_type: "code",
    scope: "openid email profile",
    state,
    access_type: "online",
    prompt: "consent",
  });

  return c.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
});

auth.get("/google/callback", async (c) => {
  const code = c.req.query("code");
  const state = c.req.query("state");
  const savedState = getCookie(c, "oauth_state");
  deleteCookie(c, "oauth_state", { path: "/" });

  if (!code || state !== savedState) {
    return c.redirect("/login?error=invalid_state");
  }

  // Exchange code for tokens
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID || "",
      client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
      redirect_uri: GOOGLE_REDIRECT_URI,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenRes.ok) {
    return c.redirect("/login?error=token_exchange_failed");
  }

  const tokens = (await tokenRes.json()) as { access_token: string };

  // Get user info
  const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });

  if (!userRes.ok) {
    return c.redirect("/login?error=user_info_failed");
  }

  const googleUser = (await userRes.json()) as {
    id: string;
    email: string;
    name: string;
    picture: string;
  };

  // Upsert user in DB
  const user = upsertUser({
    googleId: googleUser.id,
    email: googleUser.email,
    name: googleUser.name,
    avatarUrl: googleUser.picture,
  });

  // Create session
  const sessionId = createSession(user.id);

  setCookie(c, "session", sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  if (user.role === "pending") return c.redirect("/pending");
  return c.redirect("/leaderboard");
});

auth.post("/logout", (c) => {
  const sessionId = getCookie(c, "session");
  if (sessionId) deleteSession(sessionId);
  deleteCookie(c, "session", { path: "/" });
  return c.redirect("/login");
});

export { auth as authRoutes };
