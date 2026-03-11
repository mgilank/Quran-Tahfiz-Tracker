import { Hono } from "hono";
import { db } from "../db/connection.ts";
import { getSurah, SURAHS } from "../data/quran-meta.ts";
import { authMiddleware, memberMiddleware } from "../middleware/auth.ts";
import { resolveReadingBookmarkInput } from "../lib/reading-bookmark-input.ts";
import { getSurahAyahs } from "../lib/quran-loader.ts";
import type { Env, ReadingBookmark } from "../types.ts";
import { QuranPage } from "../views/pages/QuranPage.tsx";

const quran = new Hono<Env>();

quran.use("*", authMiddleware, memberMiddleware);

quran.get("/", (c) => {
  const user = c.get("user");
  const search = (c.req.query("q") || "").trim();
  const success = c.req.query("success");
  const error = c.req.query("error");
  const jumpAyahRaw = c.req.query("ayah");
  const jumpAyah = jumpAyahRaw ? parseInt(jumpAyahRaw, 10) : null;
  const pageRaw = c.req.query("page");
  let page = pageRaw ? parseInt(pageRaw, 10) : 1;

  const bookmark = db
    .prepare("SELECT * FROM reading_bookmarks WHERE user_id = ?")
    .get(user.id) as ReadingBookmark | null;

  const surahQuery = parseInt(c.req.query("surah") || "", 10);
  const selectedSurahNumber = Number.isFinite(surahQuery)
    ? surahQuery
    : (bookmark?.surah_number ?? 1);
  const selectedSurah = getSurah(selectedSurahNumber) || SURAHS[0]!;

  const filteredSurahs = search
    ? SURAHS.filter(
        (surah) =>
          surah.name.toLowerCase().includes(search.toLowerCase()) ||
          surah.number.toString() === search
      )
    : SURAHS;

  let ayahs = [] as ReturnType<typeof getSurahAyahs>;
  let loadError: string | undefined;
  try {
    ayahs = getSurahAyahs(selectedSurah.number);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load surah text.";
    loadError = message;
  }

  const limit = 5;
  const totalAyahs = ayahs.length;
  const totalPages = Math.ceil(totalAyahs / limit);

  // If jumping to an ayah, calculate its page
  if (jumpAyah && jumpAyah > 0 && jumpAyah <= totalAyahs) {
    page = Math.ceil(jumpAyah / limit);
  }

  // Ensure page is within bounds
  if (page < 1) page = 1;
  if (totalPages > 0 && page > totalPages) page = totalPages;

  const startIndex = (page - 1) * limit;
  const paginatedAyahs = ayahs.slice(startIndex, startIndex + limit);

  // Fetch all users progress for this surah
  const surahProgress = db
    .prepare(`
      SELECT p.last_ayah, u.name, u.avatar_url, u.id as user_id
      FROM progress_entries p
      JOIN users u ON p.user_id = u.id
      WHERE p.surah_number = ?
    `)
    .all(selectedSurah.number) as { last_ayah: number; name: string; avatar_url: string | null; user_id: number }[];

  return c.html(
    <QuranPage
      user={user}
      bookmark={bookmark}
      selectedSurah={selectedSurah}
      surahs={filteredSurahs}
      ayahs={paginatedAyahs}
      surahProgress={surahProgress}
      search={search}
      jumpAyah={jumpAyah}
      currentPage={page}
      totalPages={totalPages}
      success={success}
      error={error}
      loadError={loadError}
    />
  );
});

quran.post("/", async (c) => {
  const user = c.get("user");
  const body = await c.req.parseBody();

  const surahNumber = parseInt(body.surah_number as string, 10);
  const ayahNumber = parseInt(body.ayah_number as string, 10);

  if (isNaN(surahNumber) || isNaN(ayahNumber)) {
    return c.redirect("/quran?error=Invalid input. Please provide valid numbers.");
  }

  const surah = getSurah(surahNumber);
  if (!surah) {
    return c.redirect("/quran?error=Invalid Surah number.");
  }

  // Check if it's already bookmarked at this exact spot
  const existing = db
    .prepare("SELECT * FROM reading_bookmarks WHERE user_id = ?")
    .get(user.id) as ReadingBookmark | null;

  if (existing && existing.surah_number === surahNumber && existing.ayah_number === ayahNumber) {
    // UNMARK: Delete the bookmark
    db.prepare("DELETE FROM reading_bookmarks WHERE user_id = ?").run(user.id);
    return c.redirect(`/quran?surah=${surahNumber}&page=${Math.ceil(ayahNumber / 5)}&success=${encodeURIComponent("Bookmark removed.")}#ayah-${ayahNumber}`);
  }

  // MARK/UPDATE: Save the bookmark
  db.prepare(
    `INSERT INTO reading_bookmarks (user_id, surah_number, ayah_number)
     VALUES (?, ?, ?)
     ON CONFLICT(user_id)
     DO UPDATE SET surah_number = ?, ayah_number = ?, updated_at = datetime('now')`
  ).run(user.id, surahNumber, ayahNumber, surahNumber, ayahNumber);

  const successMessage = encodeURIComponent(
    `Last read saved: ${surah.name} Ayah ${ayahNumber}.`
  );
  return c.redirect(
    `/quran?surah=${surahNumber}&ayah=${ayahNumber}&success=${successMessage}#ayah-${ayahNumber}`
  );
});

export { quran as quranRoutes };
