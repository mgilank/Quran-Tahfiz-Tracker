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

  return c.html(
    <QuranPage
      user={user}
      bookmark={bookmark}
      selectedSurah={selectedSurah}
      surahs={filteredSurahs}
      ayahs={ayahs}
      search={search}
      jumpAyah={jumpAyah}
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
  if (isNaN(surahNumber)) {
    return c.redirect("/quran?error=Invalid input. Please provide valid numbers.");
  }

  const surah = getSurah(surahNumber);
  if (!surah) {
    return c.redirect("/quran?error=Invalid Surah number.");
  }

  const resolvedInput = resolveReadingBookmarkInput({
    rawSurahNumber: body.surah_number as string | undefined,
    rawAyahNumber: body.ayah_number as string | undefined,
    surahName: surah.name,
    surahTotalAyahs: surah.totalAyahs,
  });

  if (!resolvedInput.ok) {
    return c.redirect(`/quran?surah=${surahNumber}&error=${encodeURIComponent(resolvedInput.error)}`);
  }

  db.prepare(
    `INSERT INTO reading_bookmarks (user_id, surah_number, ayah_number)
     VALUES (?, ?, ?)
     ON CONFLICT(user_id)
     DO UPDATE SET surah_number = ?, ayah_number = ?, updated_at = datetime('now')`
  ).run(
    user.id,
    resolvedInput.surahNumber,
    resolvedInput.ayahNumber,
    resolvedInput.surahNumber,
    resolvedInput.ayahNumber
  );

  const successMessage = encodeURIComponent(
    `Last read saved: ${surah.name} Ayah ${resolvedInput.ayahNumber}.`
  );
  return c.redirect(
    `/quran?surah=${resolvedInput.surahNumber}&ayah=${resolvedInput.ayahNumber}&success=${successMessage}#ayah-${resolvedInput.ayahNumber}`
  );
});

export { quran as quranRoutes };
