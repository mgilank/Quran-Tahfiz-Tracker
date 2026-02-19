import type { FC } from "hono/jsx";
import { Layout } from "../Layout.tsx";
import { Header } from "../components/Header.tsx";
import type { User, ProgressEntry } from "../../types.ts";
import { SURAHS, getSurah, getJuzForPosition } from "../../data/quran-meta.ts";
import { APP_NAME } from "../../config.ts";

export const ProgressPage: FC<{
  user: User;
  entries: ProgressEntry[];
  juzCompleted: number;
  progressPercent: number;
  success?: string;
  error?: string;
}> = ({ user, entries, juzCompleted, progressPercent, success, error }) => {
  // Build a map of existing entries for display
  const entryMap = new Map<number, ProgressEntry>();
  for (const e of entries) {
    entryMap.set(e.surah_number, e);
  }

  return (
    <Layout title={`Submit Progress - ${APP_NAME}`}>
      <Header user={user} currentPath="/progress" />
      <main class="flex-1 flex flex-col items-center w-full px-4 sm:px-6 lg:px-8 py-8 max-w-4xl mx-auto">
        <div class="w-full flex flex-col gap-2 mb-8">
          <h1 class="text-text-main text-3xl font-black leading-tight tracking-[-0.033em]">
            Submit Progress
          </h1>
          <p class="text-text-secondary text-base font-normal leading-normal">
            Record your Quran memorization progress. Select a Surah and the last Ayah you've
            memorized.
          </p>
        </div>

        {/* Summary cards */}
        <div class="w-full grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div class="bg-white border border-border-light rounded-xl p-4 text-center">
            <p class="text-text-secondary text-xs font-medium mb-1">Juz Completed</p>
            <p class="text-2xl font-black text-primary">{juzCompleted}/30</p>
          </div>
          <div class="bg-white border border-border-light rounded-xl p-4 text-center">
            <p class="text-text-secondary text-xs font-medium mb-1">Overall Progress</p>
            <p class="text-2xl font-black text-text-main">{progressPercent}%</p>
          </div>
          <div class="bg-white border border-border-light rounded-xl p-4 text-center">
            <p class="text-text-secondary text-xs font-medium mb-1">Surahs Started</p>
            <p class="text-2xl font-black text-text-main">{entries.length}/114</p>
          </div>
          <div class="bg-white border border-border-light rounded-xl p-4 text-center">
            <p class="text-text-secondary text-xs font-medium mb-1">Goal</p>
            <p class="text-2xl font-black text-primary-dark">30 Juz</p>
          </div>
        </div>

        {success && (
          <div class="w-full bg-emerald-50 text-emerald-700 text-sm px-4 py-3 rounded-lg mb-6 border border-emerald-200 flex items-center gap-2">
            <span class="material-symbols-outlined text-lg">check_circle</span>
            {success}
          </div>
        )}

        {error && (
          <div class="w-full bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-6 border border-red-200 flex items-center gap-2">
            <span class="material-symbols-outlined text-lg">error</span>
            {error}
          </div>
        )}

        {/* Submit form */}
        <div class="w-full bg-white border border-border-light rounded-xl p-6 shadow-sm mb-8">
          <h2 class="text-text-main text-lg font-bold mb-4 flex items-center gap-2">
            <span class="material-symbols-outlined text-primary">add_circle</span>
            Record New Progress
          </h2>
          <form method="POST" action="/progress" class="flex flex-col sm:flex-row gap-4">
            <div class="flex-1">
              <label class="block text-text-secondary text-xs font-bold mb-1 uppercase tracking-wider">
                Surah
              </label>
              <select
                name="surah_number"
                class="w-full bg-slate-50 text-text-main text-sm rounded-lg border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary py-2.5 transition-all"
                required
              >
                <option value="">Select a Surah...</option>
                {SURAHS.map((s) => {
                  const existing = entryMap.get(s.number);
                  return (
                    <option value={s.number}>
                      {s.number}. {s.name} ({s.totalAyahs} ayahs)
                      {existing ? ` - currently at ayah ${existing.last_ayah}` : ""}
                    </option>
                  );
                })}
              </select>
            </div>
            <div class="w-full sm:w-40">
              <label class="block text-text-secondary text-xs font-bold mb-1 uppercase tracking-wider">
                Last Ayah Memorized
              </label>
              <input
                type="number"
                name="last_ayah"
                min="1"
                placeholder="e.g. 141"
                class="w-full bg-slate-50 text-text-main text-sm rounded-lg border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary py-2.5 transition-all"
                required
              />
            </div>
            <div class="flex items-end">
              <button
                type="submit"
                class="w-full sm:w-auto px-6 py-2.5 bg-primary text-white rounded-lg font-bold text-sm hover:bg-primary-dark transition-colors shadow-sm"
              >
                Submit
              </button>
            </div>
          </form>
        </div>

        {/* Existing entries */}
        <div class="w-full bg-white border border-border-light rounded-xl overflow-hidden shadow-sm">
          <div class="px-6 py-4 border-b border-border-light bg-slate-50/50">
            <h2 class="text-text-main text-lg font-bold flex items-center gap-2">
              <span class="material-symbols-outlined text-primary">menu_book</span>
              Your Progress by Surah
            </h2>
          </div>
          <div class="divide-y divide-border-light">
            {entries.length === 0 ? (
              <div class="px-6 py-12 text-center text-text-secondary">
                <span class="material-symbols-outlined text-3xl mb-2">book</span>
                <p>No progress recorded yet. Start by submitting your first entry above!</p>
              </div>
            ) : (
              entries.map((entry) => {
                const surah = getSurah(entry.surah_number);
                if (!surah) return null;
                const percent = Math.round((entry.last_ayah / surah.totalAyahs) * 100);
                const juz = getJuzForPosition(entry.surah_number, entry.last_ayah);

                return (
                  <div class="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors">
                    <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
                      {entry.surah_number}
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center justify-between mb-1">
                        <p class="text-text-main text-sm font-bold truncate">
                          {surah.name}{" "}
                          <span class="text-text-secondary font-normal">({surah.nameArabic})</span>
                        </p>
                        <span class="text-text-secondary text-xs ml-2 flex-shrink-0">Juz {juz}</span>
                      </div>
                      <div class="flex items-center gap-3">
                        <div class="flex-1 bg-slate-100 rounded-full h-1.5">
                          <div
                            class={`h-1.5 rounded-full ${entry.completed ? "bg-primary" : "bg-primary/60"}`}
                            style={`width: ${percent}%`}
                          />
                        </div>
                        <span class="text-text-main text-xs font-medium flex-shrink-0">
                          {entry.last_ayah}/{surah.totalAyahs} ({percent}%)
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
    </Layout>
  );
};
