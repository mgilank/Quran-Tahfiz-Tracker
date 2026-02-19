import type { FC } from "hono/jsx";
import { Layout } from "../Layout.tsx";
import { Header } from "../components/Header.tsx";
import type { User, ProgressEntry, RankedUser } from "../../types.ts";
import { SURAHS, JUZ_BOUNDARIES, getSurah, getJuzForPosition } from "../../data/quran-meta.ts";
import { APP_NAME } from "../../config.ts";

export const DashboardPage: FC<{
  user: User;
  entries: ProgressEntry[];
  juzCompleted: number;
  progressPercent: number;
  totalMemorized: number;
  rank: RankedUser | null;
  currentLocation: { juz: number; surahName: string; surahNumber: number; ayah: number };
}> = ({ user, entries, juzCompleted, progressPercent, totalMemorized, rank, currentLocation }) => {
  // Build a set of completed surah numbers
  const completedSurahs = new Set<number>();
  const entryMap = new Map<number, ProgressEntry>();
  for (const e of entries) {
    entryMap.set(e.surah_number, e);
    if (e.completed) completedSurahs.add(e.surah_number);
  }

  return (
    <Layout title={`Dashboard - ${APP_NAME}`}>
      <Header user={user} currentPath="/dashboard" />
      <main class="flex-1 flex flex-col items-center w-full px-4 sm:px-6 lg:px-8 py-8 max-w-5xl mx-auto">
        {/* Welcome */}
        <div class="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 class="text-text-main text-3xl font-black leading-tight tracking-[-0.033em]">
              Assalamu'alaikum, {user.name.split(" ")[0]}!
            </h1>
            <p class="text-text-secondary text-base">Your Quran memorization journey at a glance.</p>
          </div>
          <a
            href="/progress"
            class="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg font-bold text-sm hover:bg-primary-dark transition-colors shadow-sm"
          >
            <span class="material-symbols-outlined text-lg">add</span>
            Submit Progress
          </a>
        </div>

        {/* Stats grid */}
        <div class="w-full grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div class="bg-white border border-border-light rounded-xl p-5 text-center">
            <p class="text-text-secondary text-xs font-medium mb-1">Your Rank</p>
            <p class="text-3xl font-black text-primary">#{rank?.rank || "-"}</p>
          </div>
          <div class="bg-white border border-border-light rounded-xl p-5 text-center">
            <p class="text-text-secondary text-xs font-medium mb-1">Juz Completed</p>
            <p class="text-3xl font-black text-text-main">{juzCompleted}/30</p>
          </div>
          <div class="bg-white border border-border-light rounded-xl p-5 text-center">
            <p class="text-text-secondary text-xs font-medium mb-1">Progress</p>
            <p class="text-3xl font-black text-text-main">{progressPercent}%</p>
          </div>
          <div class="bg-white border border-border-light rounded-xl p-5 text-center">
            <p class="text-text-secondary text-xs font-medium mb-1">Ayahs</p>
            <p class="text-3xl font-black text-text-main">{totalMemorized.toLocaleString()}</p>
          </div>
          <div class="bg-white border border-border-light rounded-xl p-5 text-center col-span-2 md:col-span-1">
            <p class="text-text-secondary text-xs font-medium mb-1">Weekly Trend</p>
            <p class="text-3xl font-black text-primary">+{rank?.trend || 0}</p>
          </div>
        </div>

        {/* Current location */}
        {currentLocation.juz > 0 && (
          <div class="w-full bg-white border-2 border-primary/20 rounded-xl p-6 mb-8 shadow-sm">
            <div class="flex items-center gap-3 mb-3">
              <span class="material-symbols-outlined text-primary text-2xl">my_location</span>
              <h2 class="text-text-main text-lg font-bold">Current Location</h2>
            </div>
            <div class="flex flex-wrap gap-6 text-sm">
              <div>
                <span class="text-text-secondary">Juz</span>
                <p class="text-text-main font-bold text-lg">{currentLocation.juz}</p>
              </div>
              <div>
                <span class="text-text-secondary">Surah</span>
                <p class="text-text-main font-bold text-lg">{currentLocation.surahName}</p>
              </div>
              <div>
                <span class="text-text-secondary">Ayah</span>
                <p class="text-text-main font-bold text-lg">{currentLocation.ayah}</p>
              </div>
            </div>
          </div>
        )}

        {/* Overall progress bar */}
        <div class="w-full bg-white border border-border-light rounded-xl p-6 mb-8 shadow-sm">
          <h2 class="text-text-main text-lg font-bold mb-4 flex items-center gap-2">
            <span class="material-symbols-outlined text-primary">bar_chart</span>
            Overall Progress to 30 Juz
          </h2>
          <div class="w-full bg-slate-100 rounded-full h-4 overflow-hidden border border-slate-200 mb-2">
            <div
              class="bg-primary h-4 rounded-full relative overflow-hidden transition-all duration-500"
              style={`width: ${progressPercent}%`}
            >
              {progressPercent > 5 && (
                <span class="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
                  {progressPercent}%
                </span>
              )}
            </div>
          </div>
          <p class="text-text-secondary text-xs">
            {juzCompleted} of 30 Juz completed &bull; {totalMemorized.toLocaleString()} of 6,236
            total ayahs memorized
          </p>
        </div>

        {/* Juz grid */}
        <div class="w-full bg-white border border-border-light rounded-xl p-6 shadow-sm">
          <h2 class="text-text-main text-lg font-bold mb-4 flex items-center gap-2">
            <span class="material-symbols-outlined text-primary">grid_view</span>
            Juz Overview
          </h2>
          <div class="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-2">
            {JUZ_BOUNDARIES.map((juz) => {
              // Check if this juz is complete, partial, or not started
              let status: "complete" | "partial" | "empty" = "empty";
              let hasAnyProgress = false;

              for (let s = juz.startSurah; s <= juz.endSurah; s++) {
                const entry = entryMap.get(s);
                if (entry && entry.last_ayah > 0) {
                  hasAnyProgress = true;
                }
              }

              // Simplified: check if all surahs in this juz are sufficiently memorized
              let allComplete = true;
              for (let s = juz.startSurah; s <= juz.endSurah; s++) {
                const surah = getSurah(s);
                if (!surah) { allComplete = false; break; }
                const entry = entryMap.get(s);
                const neededEnd = s === juz.endSurah ? juz.endAyah : surah.totalAyahs;
                if (!entry || entry.last_ayah < neededEnd) {
                  allComplete = false;
                  break;
                }
              }

              if (allComplete) status = "complete";
              else if (hasAnyProgress) status = "partial";

              return (
                <div
                  class={`aspect-square rounded-lg flex items-center justify-center text-sm font-bold border transition-all ${status === "complete"
                      ? "bg-primary text-white border-primary shadow-sm"
                      : status === "partial"
                        ? "bg-primary/10 text-primary border-primary/30"
                        : "bg-slate-50 text-text-secondary border-border-light"
                    }`}
                  title={`Juz ${juz.juzNumber}`}
                >
                  {juz.juzNumber}
                </div>
              );
            })}
          </div>
          <div class="flex items-center gap-4 mt-4 text-xs text-text-secondary">
            <div class="flex items-center gap-1.5">
              <div class="w-3 h-3 rounded bg-primary" />
              <span>Completed</span>
            </div>
            <div class="flex items-center gap-1.5">
              <div class="w-3 h-3 rounded bg-primary/10 border border-primary/30" />
              <span>In Progress</span>
            </div>
            <div class="flex items-center gap-1.5">
              <div class="w-3 h-3 rounded bg-slate-50 border border-border-light" />
              <span>Not Started</span>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};
