import { Hono } from "hono";
import { authMiddleware, memberMiddleware } from "../middleware/auth.ts";
import { getUserProgress } from "../lib/progress-calc.ts";
import { getSurah } from "../data/quran-meta.ts";
import { resolveProgressUpdateInput } from "../lib/progress-input.ts";
import { db } from "../db/connection.ts";
import { ProgressPage } from "../views/pages/ProgressPage.tsx";
import type { Env } from "../types.ts";

const progress = new Hono<Env>();

progress.use("*", authMiddleware, memberMiddleware);

progress.get("/", (c) => {
  const user = c.get("user");
  const success = c.req.query("success");
  const error = c.req.query("error");
  const userProgress = getUserProgress(user.id);

  return c.html(
    <ProgressPage
      user={user}
      entries={userProgress.entries}
      juzCompleted={userProgress.juzCompleted}
      progressPercent={userProgress.progressPercent}
      success={success}
      error={error}
    />
  );
});

progress.post("/", async (c) => {
  const user = c.get("user");
  const body = await c.req.parseBody();

  const mode =
    body.mode === "increment" || body.mode === "advance" || body.mode === "complete"
      ? body.mode
      : "set";
  const surahNumber = parseInt(body.surah_number as string, 10);

  // Validate
  if (isNaN(surahNumber)) {
    return c.redirect("/progress?error=Invalid input. Please provide valid numbers.");
  }

  const surah = getSurah(surahNumber);
  if (!surah) {
    return c.redirect("/progress?error=Invalid Surah number.");
  }

  // Get existing entry for progress log
  const existing = db
    .prepare("SELECT last_ayah FROM progress_entries WHERE user_id = ? AND surah_number = ?")
    .get(user.id, surahNumber) as { last_ayah: number } | null;

  const previousAyah = existing?.last_ayah || 0;
  const resolvedInput = resolveProgressUpdateInput({
    mode,
    rawLastAyah: body.last_ayah as string | undefined,
    rawIncrement: body.ayah_increment as string | undefined,
    existingLastAyah: previousAyah,
    hasExistingEntry: Boolean(existing),
    surahName: surah.name,
    surahTotalAyahs: surah.totalAyahs,
  });

  if (!resolvedInput.ok) {
    return c.redirect(`/progress?error=${resolvedInput.error}`);
  }

  const lastAyah = resolvedInput.lastAyah;
  const completed = lastAyah === surah.totalAyahs ? 1 : 0;

  // Upsert progress entry
  db.prepare(
    `INSERT INTO progress_entries (user_id, surah_number, last_ayah, completed)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(user_id, surah_number)
     DO UPDATE SET last_ayah = ?, completed = ?, updated_at = datetime('now')`
  ).run(user.id, surahNumber, lastAyah, completed, lastAyah, completed);

  // Log progress change
  if (lastAyah !== previousAyah) {
    db.prepare(
      "INSERT INTO progress_log (user_id, surah_number, ayah_from, ayah_to) VALUES (?, ?, ?, ?)"
    ).run(user.id, surahNumber, previousAyah, lastAyah);
  }

  const incrementLabel =
    resolvedInput.usedMode !== "set" && resolvedInput.appliedIncrement > 0
      ? ` (+${resolvedInput.appliedIncrement} ayah)`
      : "";

  return c.redirect(
    `/progress?success=Progress updated: ${surah.name} - Ayah ${lastAyah}/${surah.totalAyahs}${incrementLabel}${completed ? " (Completed!)" : ""}`
  );
});

export { progress as progressRoutes };
