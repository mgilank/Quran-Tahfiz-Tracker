import type { FC } from "hono/jsx";
import type { ReadingBookmark, User } from "../../types.ts";
import { getSurah, type SurahMeta } from "../../data/quran-meta.ts";
import type { QuranAyah } from "../../lib/quran-loader.ts";
import { Layout } from "../Layout.tsx";
import { Header } from "../components/Header.tsx";
import { APP_NAME } from "../../config.ts";

export const QuranPage: FC<{
  user: User;
  bookmark: ReadingBookmark | null;
  selectedSurah: SurahMeta;
  surahs: SurahMeta[];
  ayahs: QuranAyah[];
  search: string;
  jumpAyah: number | null;
  success?: string;
  error?: string;
  loadError?: string;
}> = ({
  user,
  bookmark,
  selectedSurah,
  surahs,
  ayahs,
  search,
  jumpAyah,
  success,
  error,
  loadError,
}) => {
  const showContinueCard = Boolean(bookmark);
  const selectedBookmarkAyah = bookmark?.surah_number === selectedSurah.number ? bookmark.ayah_number : null;
  const bookmarkSurahName = bookmark ? getSurah(bookmark.surah_number)?.name || `Surah ${bookmark.surah_number}` : null;

  return (
    <Layout title={`Al Quran - ${APP_NAME}`}>
      <Header user={user} currentPath="/quran" />
      <main class="flex-1 flex flex-col items-center w-full px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        <div class="w-full flex flex-col gap-2 mb-6">
          <h1 class="text-text-main text-3xl font-black leading-tight tracking-[-0.033em]">Al Quran</h1>
          <p class="text-text-secondary text-base">
            Read in app and save one global last-read bookmark.
          </p>
        </div>

        {showContinueCard && bookmark && (
          <div class="w-full bg-primary-light border border-primary/20 rounded-xl px-5 py-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p class="text-text-main text-sm">
              Continue from <span class="font-bold">{bookmarkSurahName}</span> (Surah {bookmark.surah_number}), Ayah{" "}
              <span class="font-bold">{bookmark.ayah_number}</span>
            </p>
            <a
              href={`/quran?surah=${bookmark.surah_number}&ayah=${bookmark.ayah_number}#ayah-${bookmark.ayah_number}`}
              class="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary-dark transition-colors"
            >
              Continue
            </a>
          </div>
        )}

        {!showContinueCard && (
          <div class="w-full bg-slate-50 border border-border-light rounded-xl px-5 py-4 mb-6 text-sm text-text-secondary">
            No bookmark yet. Tap <span class="font-semibold text-text-main">Mark last read</span> on any ayah to save your current location.
          </div>
        )}

        {success && (
          <div class="w-full bg-emerald-50 text-emerald-700 text-sm px-4 py-3 rounded-lg mb-4 border border-emerald-200">
            {success}
          </div>
        )}

        {error && (
          <div class="w-full bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4 border border-red-200">
            {error}
          </div>
        )}

        <div class="w-full grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-6">
          <aside class="bg-white border border-border-light rounded-xl p-4 shadow-sm h-fit">
            <form method="get" action="/quran" class="mb-3">
              <input
                type="text"
                name="q"
                value={search}
                placeholder="Search surah by name/number"
                class="w-full bg-slate-50 text-text-main text-sm rounded-lg border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary py-2.5"
              />
            </form>
            <div class="max-h-[480px] overflow-y-auto pr-1 space-y-1">
              {surahs.map((surah) => (
                <a
                  href={`/quran?surah=${surah.number}`}
                  class={
                    surah.number === selectedSurah.number
                      ? "block px-3 py-2.5 rounded-lg bg-primary-light border border-primary/20"
                      : "block px-3 py-2.5 rounded-lg hover:bg-slate-50 border border-transparent"
                  }
                >
                  <div class="flex items-center justify-between gap-3">
                    <p class="text-sm font-semibold text-text-main">
                      {surah.number}. {surah.name}
                    </p>
                    <span class="text-xs text-text-secondary">{surah.totalAyahs}</span>
                  </div>
                  <p class="text-xs text-text-secondary mt-0.5">{surah.nameArabic}</p>
                </a>
              ))}
            </div>
          </aside>

          <section class="bg-white border border-border-light rounded-xl p-6 shadow-sm">
            <div class="mb-4">
              <h2 class="text-text-main text-xl font-bold">
                {selectedSurah.number}. {selectedSurah.name}
              </h2>
              <p class="text-text-secondary text-sm">{selectedSurah.nameArabic} · {selectedSurah.totalAyahs} ayahs</p>
              {jumpAyah && jumpAyah > 0 && (
                <p class="text-primary text-xs font-semibold mt-1">Jumped to ayah {jumpAyah}</p>
              )}
            </div>

            {loadError ? (
              <div class="bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm px-4 py-3">
                {loadError}
              </div>
            ) : (
              <div class="space-y-3">
                {ayahs.map((ayah) => {
                  const isBookmarked = selectedBookmarkAyah === ayah.number;
                  return (
                    <article
                      id={`ayah-${ayah.number}`}
                      class={`border rounded-lg px-4 py-4 ${isBookmarked ? "border-primary/40 bg-primary-light/40" : "border-border-light"}`}
                    >
                      <div class="flex flex-col sm:flex-row sm:items-start gap-3">
                        <div class="w-8 h-8 rounded-full bg-slate-100 text-text-main text-xs font-bold flex items-center justify-center flex-shrink-0">
                          {ayah.number}
                        </div>
                        <div class="flex-1">
                          <p class="text-right text-2xl leading-[2.5rem] text-text-main" dir="rtl">
                            {ayah.text}
                          </p>
                          <div class="mt-3 flex items-center gap-3">
                            <form method="post" action="/quran">
                              <input type="hidden" name="surah_number" value={selectedSurah.number.toString()} />
                              <input type="hidden" name="ayah_number" value={ayah.number.toString()} />
                              <button
                                type="submit"
                                class="px-3 py-1.5 bg-primary text-white rounded-md text-xs font-bold hover:bg-primary-dark transition-colors"
                              >
                                Mark last read
                              </button>
                            </form>
                            {isBookmarked && <span class="text-xs font-semibold text-primary">Last read</span>}
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>
    </Layout>
  );
};
