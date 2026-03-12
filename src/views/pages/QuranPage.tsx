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
  surahProgress: { last_ayah: number; name: string; avatar_url: string | null; user_id: number }[];
  search: string;
  jumpAyah: number | null;
  currentPage: number;
  totalPages: number;
  success?: string;
  error?: string;
  loadError?: string;
}> = ({
  user,
  bookmark,
  selectedSurah,
  surahs,
  ayahs,
  surahProgress,
  search,
  jumpAyah,
  currentPage,
  totalPages,
  success,
  error,
  loadError,
}) => {
  const showContinueCard = Boolean(bookmark);
  const selectedBookmarkAyah = bookmark?.surah_number === selectedSurah.number ? bookmark.ayah_number : null;
  const bookmarkSurahName = bookmark ? getSurah(bookmark.surah_number)?.name || `Surah ${bookmark.surah_number}` : null;

  // Group progress by ayah number
  const progressMap = new Map<number, typeof surahProgress>();
  for (const p of surahProgress) {
    const list = progressMap.get(p.last_ayah) || [];
    list.push(p);
    progressMap.set(p.last_ayah, list);
  }

  return (
    <Layout title={`Al Quran - ${APP_NAME}`}>
      <Header user={user} currentPath="/quran" />
      <main class="flex-1 flex flex-col items-center w-full px-4 sm:px-6 lg:px-8 pt-8 pb-24 sm:pb-8 max-w-7xl mx-auto">
        <div class="w-full flex flex-col gap-2 mb-6">
          <h1 class="text-text-main dark:text-text-main-dark text-3xl font-black leading-tight tracking-[-0.033em]">Al Quran</h1>
          <p class="text-text-secondary dark:text-text-secondary-dark text-base">
            Read in app and save one global last-read bookmark.
          </p>
        </div>

        {showContinueCard && bookmark && (
          <div class="w-full bg-primary-light dark:bg-primary-dark/20 border border-primary/20 rounded-xl px-5 py-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-sm">
            <p class="text-text-main dark:text-text-main-dark text-sm">
              Continue from <span class="font-bold">{bookmarkSurahName}</span> (Surah {bookmark.surah_number}), Ayah{" "}
              <span class="font-bold">{bookmark.ayah_number}</span>
            </p>
            <a
              href={`/quran?surah=${bookmark.surah_number}&ayah=${bookmark.ayah_number}#ayah-${bookmark.ayah_number}`}
              class="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary-dark transition-colors shadow-sm"
            >
              Continue
            </a>
          </div>
        )}

        {!showContinueCard && (
          <div class="w-full bg-slate-50 dark:bg-slate-800/50 border border-border-light dark:border-border-light-dark rounded-xl px-5 py-4 mb-6 text-sm text-text-secondary dark:text-text-secondary-dark shadow-sm">
            No bookmark yet. Tap <span class="font-semibold text-text-main dark:text-text-main-dark">Mark last read</span> on any ayah to save your current location.
          </div>
        )}

        {success && (
          <div class="w-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-sm px-4 py-3 rounded-lg mb-4 border border-emerald-200 dark:border-emerald-800/50 shadow-sm animate-in fade-in slide-in-from-top-1 duration-200">
            {success}
          </div>
        )}

        {error && (
          <div class="w-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-lg mb-4 border border-red-200 dark:border-red-800/50 shadow-sm animate-in fade-in slide-in-from-top-1 duration-200">
            {error}
          </div>
        )}

        <div class="w-full grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-6">
          <aside id="quran-sidebar" class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-light-dark rounded-xl shadow-sm h-fit static lg:sticky lg:top-24 overflow-hidden transition-all duration-300">
            {/* Mobile Toggle Header */}
            <button 
              id="sidebar-toggle"
              class="lg:hidden w-full flex items-center justify-between p-4 text-text-main dark:text-text-main-dark font-bold border-b border-border-light dark:border-border-light-dark bg-slate-50/50 dark:bg-slate-800/50"
            >
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-primary">search</span>
                <span>Search & Surah List</span>
              </div>
              <span id="sidebar-toggle-icon" class="material-symbols-outlined transition-transform">expand_more</span>
            </button>

            <div id="sidebar-content" class="hidden lg:block p-4">
              <div class="flex flex-col gap-3">
                <form method="get" action="/quran" class="my-0">
                  <label class="text-xs font-bold text-text-secondary dark:text-text-secondary-dark uppercase tracking-wider mb-1 block">Search Surah</label>
                  <div class="relative">
                    <input
                      type="text"
                      name="q"
                      value={search}
                      placeholder="Name or number"
                      class="w-full bg-slate-50 dark:bg-slate-800/50 text-text-main dark:text-text-main-dark text-sm rounded-lg border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-1 focus:ring-primary py-2.5 pl-3"
                    />
                    <span class="absolute right-3 top-2.5 material-symbols-outlined text-text-secondary text-xl">search</span>
                  </div>
                </form>
                <form method="get" action="/quran" class="my-0 pt-2 border-t border-border-light dark:border-border-light-dark">
                  <input type="hidden" name="surah" value={selectedSurah.number.toString()} />
                  <label class="text-xs font-bold text-text-secondary dark:text-text-secondary-dark uppercase tracking-wider mb-1 block">Jump to Ayah</label>
                  <div class="flex gap-2">
                    <input
                      type="number"
                      name="ayah"
                      placeholder={`1-${selectedSurah.totalAyahs}`}
                      min="1"
                      max={selectedSurah.totalAyahs}
                      class="w-full bg-slate-50 dark:bg-slate-800/50 text-text-main dark:text-text-main-dark text-sm rounded-lg border-slate-200 dark:border-slate-700 focus:border-primary focus:ring-1 focus:ring-primary py-2 pr-2 pl-3"
                    />
                    <button type="submit" class="bg-primary hover:bg-primary-dark text-white px-3 rounded-lg text-sm font-bold transition-colors shadow-sm">Go</button>
                  </div>
                </form>
              </div>
              <div class="mt-4 max-h-[480px] overflow-y-auto pr-1 space-y-1">
                <label class="text-xs font-bold text-text-secondary dark:text-text-secondary-dark uppercase tracking-wider mb-2 block px-2">Surah List</label>
                {surahs.map((surah) => (
                  <a
                    href={`/quran?surah=${surah.number}`}
                    class={
                      surah.number === selectedSurah.number
                        ? "block px-3 py-2.5 rounded-lg bg-primary-light dark:bg-primary/10 border border-primary/20 shadow-sm transition-all"
                        : "block px-3 py-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent transition-all"
                    }
                  >
                    <div class="flex items-center justify-between gap-3">
                      <p class="text-sm font-semibold text-text-main dark:text-text-main-dark">
                        {surah.number}. {surah.name}
                      </p>
                      <span class="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-text-secondary dark:text-text-secondary-dark px-1.5 py-0.5 rounded-full">{surah.totalAyahs}</span>
                    </div>
                    <p class="text-[11px] text-text-secondary dark:text-text-secondary-dark mt-0.5 opacity-80">{surah.nameArabic}</p>
                  </a>
                ))}
              </div>
            </div>
          </aside>

          <section class="bg-surface dark:bg-surface-dark border border-border-light dark:border-border-light-dark rounded-xl p-6 shadow-sm flex flex-col">
            <div class="flex items-center justify-between mb-6 pb-4 border-b border-border-light dark:border-border-light-dark">
              <div>
                <h2 class="text-text-main dark:text-text-main-dark text-2xl font-black tracking-tight">
                  {selectedSurah.number}. {selectedSurah.name}
                </h2>
                <p class="text-text-secondary dark:text-text-secondary-dark text-sm flex items-center gap-2">
                  <span>{selectedSurah.nameArabic}</span>
                  <span class="size-1 bg-slate-300 rounded-full" />
                  <span>{selectedSurah.totalAyahs} Ayahs</span>
                </p>
              </div>
              <div class="flex items-center gap-3">
                <button
                  id="toggle-translation"
                  class="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-text-secondary dark:text-text-secondary-dark rounded-lg text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-border-light dark:border-border-light-dark"
                >
                  <span class="material-symbols-outlined text-lg">translate</span>
                  <span id="translation-status">Show Translation</span>
                </button>
                {jumpAyah && jumpAyah > 0 && (
                  <div class="bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-xs font-bold border border-primary/20 animate-pulse">
                    Viewing Ayah {jumpAyah}
                  </div>
                )}
              </div>
            </div>

            {loadError ? (
              <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg text-red-600 dark:text-red-400 text-sm px-4 py-3 shadow-sm">
                {loadError}
              </div>
            ) : (
              <div id="ayahs-container" class="flex-1 space-y-4 hide-translation">
                {ayahs.map((ayah) => {
                  const isBookmarked = selectedBookmarkAyah === ayah.number;
                  const isJumpTarget = jumpAyah === ayah.number;
                  const usersHere = progressMap.get(ayah.number) || [];

                  return (
                    <article
                      id={`ayah-${ayah.number}`}
                      class={`border rounded-xl px-5 py-6 transition-all duration-300 ${
                        isBookmarked 
                          ? "border-primary/40 bg-primary-light/30 dark:bg-primary/10 shadow-sm" 
                          : isJumpTarget
                          ? "border-amber-400/50 bg-amber-50/30 dark:bg-amber-900/10 shadow-sm ring-2 ring-amber-400/20"
                          : "border-border-light dark:border-border-light-dark hover:border-slate-300 dark:hover:border-slate-600"
                      }`}
                    >
                      <div class="flex flex-col sm:flex-row sm:items-start gap-4">
                        <div class="flex flex-row sm:flex-col items-center justify-between sm:justify-start gap-4 sm:gap-3 flex-shrink-0 w-full sm:w-auto mb-2 sm:mb-0 pb-3 sm:pb-0 border-b sm:border-b-0 border-border-light/50 dark:border-border-light-dark/50">
                          <div class="flex items-center gap-3">
                            <div class={`w-10 h-10 rounded-full text-sm font-black flex items-center justify-center transition-colors ${
                              isBookmarked || isJumpTarget 
                              ? "bg-primary text-white shadow-md" 
                              : "bg-slate-100 dark:bg-slate-800 text-text-main dark:text-text-main-dark shadow-sm"
                            }`}>
                              {ayah.number}
                            </div>
                            
                            <div class="flex flex-row sm:flex-col items-center gap-2">
                              <form method="post" action="/quran" class="my-0">
                                <input type="hidden" name="surah_number" value={selectedSurah.number.toString()} />
                                <input type="hidden" name="ayah_number" value={ayah.number.toString()} />
                                <button
                                  type="submit"
                                  title={isBookmarked ? "Remove bookmark" : "Bookmark this ayah"}
                                  class={`p-2 rounded-full transition-all active:scale-90 shadow-sm group ${
                                    isBookmarked 
                                      ? "bg-primary text-white ring-2 ring-primary/20" 
                                      : "bg-slate-100 dark:bg-slate-800 text-text-secondary dark:text-text-secondary-dark hover:bg-primary hover:text-white"
                                  }`}
                                >
                                  <span class="material-symbols-outlined text-xl block transition-transform group-hover:scale-110">
                                    {isBookmarked ? "bookmark_remove" : "bookmark"}
                                  </span>
                                </button>
                              </form>

                              <form method="post" action="/progress" class="my-0">
                                <input type="hidden" name="surah_number" value={selectedSurah.number.toString()} />
                                <input type="hidden" name="last_ayah" value={ayah.number.toString()} />
                                <input type="hidden" name="mode" value="set" />
                                <button
                                  type="submit"
                                  title="Update progress to this ayah"
                                  class="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-text-secondary dark:text-text-secondary-dark hover:bg-emerald-500 hover:text-white transition-all active:scale-90 shadow-sm group"
                                >
                                  <span class="material-symbols-outlined text-xl block transition-transform group-hover:rotate-12">
                                    task_alt
                                  </span>
                                </button>
                              </form>
                            </div>
                          </div>

                          {/* Member progress avatars */}
                          {usersHere.length > 0 && (
                            <div class="flex flex-row sm:flex-col items-center gap-1.5 sm:mt-2">
                              <div class="flex -space-x-2">
                                {usersHere.slice(0, 3).map((p) => (
                                  <div class="relative group/avatar">
                                    {p.avatar_url ? (
                                      <img
                                        src={p.avatar_url}
                                        alt={p.name}
                                        class="inline-block size-6 rounded-full ring-2 ring-white dark:ring-slate-900 object-cover"
                                      />
                                    ) : (
                                      <div 
                                        class="inline-block size-6 rounded-full ring-2 ring-white dark:ring-slate-900 bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[8px] font-bold text-text-secondary dark:text-text-secondary-dark"
                                      >
                                        {p.name.charAt(0)}
                                      </div>
                                    )}
                                    {/* Custom Tooltip */}
                                    <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 dark:bg-slate-700 text-white text-[10px] rounded whitespace-nowrap opacity-0 invisible group-hover/avatar:opacity-100 group-hover/avatar:visible transition-all z-10 font-bold">
                                      {p.name}
                                      <div class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900 dark:border-t-slate-700"></div>
                                    </div>
                                  </div>
                                ))}
                                {usersHere.length > 3 && (
                                  <div class="flex items-center justify-center size-6 rounded-full ring-2 ring-white dark:ring-slate-900 bg-slate-100 dark:bg-slate-800 text-[8px] font-bold text-text-secondary">
                                    +{usersHere.length - 3}
                                  </div>
                                )}
                              </div>
                              <span class="hidden sm:block text-[8px] font-bold text-text-secondary dark:text-text-secondary-dark uppercase tracking-tighter">Progress</span>
                            </div>
                          )}
                        </div>

                        <div class="flex-1 flex flex-col gap-4">
                          <p class="text-right text-3xl leading-[3.5rem] text-text-main dark:text-text-main-dark font-display tracking-wide" dir="rtl">
                            {ayah.text}
                          </p>
                          <p class="translation-text text-text-secondary dark:text-text-secondary-dark text-sm leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3 italic">
                            {ayah.translation}
                          </p>
                        </div>
                      </div>
                    </article>
                  );
                })}

                {/* Pagination controls */}
                <div class="mt-8 pt-4 sm:pt-8 border-t border-border-light dark:border-border-light-dark sticky bottom-0 sm:static bg-surface/95 dark:bg-surface-dark/95 sm:bg-transparent backdrop-blur-md sm:backdrop-blur-none -mx-6 px-6 py-4 sm:p-0 z-30">
                  <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div class="flex items-center justify-center sm:justify-start gap-2 w-full sm:w-auto">
                      <a
                        href={`/quran?surah=${selectedSurah.number}&page=${currentPage - 1}`}
                        class={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                          currentPage > 1
                            ? "bg-white dark:bg-slate-800 text-text-main dark:text-text-main-dark border border-border-light dark:border-border-light-dark hover:border-primary hover:text-primary shadow-sm"
                            : "bg-slate-50 dark:bg-slate-900/50 text-slate-400 dark:text-slate-600 border border-transparent cursor-not-allowed"
                        }`}
                        {...(currentPage <= 1 ? { onClick: (e: any) => e.preventDefault() } : {})}
                      >
                        <span class="material-symbols-outlined text-lg">chevron_left</span>
                        Prev
                      </a>
                      
                      <div class="flex items-center gap-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-border-light dark:border-border-light-dark rounded-lg">
                        <span class="text-sm font-black text-text-main dark:text-text-main-dark">{currentPage}</span>
                        <span class="text-xs text-text-secondary dark:text-text-secondary-dark">of {totalPages}</span>
                      </div>

                      <a
                        href={`/quran?surah=${selectedSurah.number}&page=${currentPage + 1}`}
                        class={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                          currentPage < totalPages
                            ? "bg-white dark:bg-slate-800 text-text-main dark:text-text-main-dark border border-border-light dark:border-border-light-dark hover:border-primary hover:text-primary shadow-sm"
                            : "bg-slate-50 dark:bg-slate-900/50 text-slate-400 dark:text-slate-600 border border-transparent cursor-not-allowed"
                        }`}
                        {...(currentPage >= totalPages ? { onClick: (e: any) => e.preventDefault() } : {})}
                      >
                        Next
                        <span class="material-symbols-outlined text-lg">chevron_right</span>
                      </a>
                    </div>
                    
                    <p class="hidden sm:block text-xs text-text-secondary dark:text-text-secondary-dark font-medium italic">
                      Displaying {ayahs.length} ayahs per page
                    </p>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
      <script dangerouslySetInnerHTML={{ __html: `
        const toggleBtn = document.getElementById('toggle-translation');
        const ayahsContainer = document.getElementById('ayahs-container');
        const statusText = document.getElementById('translation-status');
        
        // Initialize from localStorage
        const showTranslation = localStorage.getItem('showTranslation') === 'true';
        if (showTranslation) {
          ayahsContainer.classList.remove('hide-translation');
          statusText.textContent = 'Hide Translation';
        }

        toggleBtn.addEventListener('click', () => {
          const isHidden = ayahsContainer.classList.toggle('hide-translation');
          localStorage.setItem('showTranslation', (!isHidden).toString());
          statusText.textContent = isHidden ? 'Show Translation' : 'Hide Translation';
        });

        // Sidebar mobile toggle
        const sidebarToggle = document.getElementById('sidebar-toggle');
        const sidebarContent = document.getElementById('sidebar-content');
        const sidebarIcon = document.getElementById('sidebar-toggle-icon');

        if (sidebarToggle && sidebarContent && sidebarIcon) {
          sidebarToggle.addEventListener('click', () => {
            const isHidden = sidebarContent.classList.toggle('hidden');
            sidebarIcon.style.transform = isHidden ? 'rotate(0deg)' : 'rotate(180deg)';
          });
        }
      ` }} />
      <style dangerouslySetInnerHTML={{ __html: `
        .hide-translation .translation-text {
          display: none;
        }
      ` }} />
    </Layout>
  );
};
