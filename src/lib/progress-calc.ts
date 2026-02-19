import { db } from "../db/connection.ts";
import {
  SURAHS,
  TOTAL_AYAHS,
  JUZ_BOUNDARIES,
  getSurah,
  getJuzForPosition,
} from "../data/quran-meta.ts";
import type { ProgressEntry, RankedUser } from "../types.ts";

interface ProgressMap {
  [surahNumber: number]: number;
}

function buildProgressMap(entries: ProgressEntry[]): ProgressMap {
  const map: ProgressMap = {};
  for (const e of entries) {
    map[e.surah_number] = e.last_ayah;
  }
  return map;
}

export function totalAyahsMemorized(entries: ProgressEntry[]): number {
  let total = 0;
  for (const e of entries) {
    total += e.last_ayah;
  }
  return total;
}

export function overallProgressPercent(entries: ProgressEntry[]): number {
  const memorized = totalAyahsMemorized(entries);
  return Math.round((memorized / TOTAL_AYAHS) * 100);
}

export function juzCompletedCount(entries: ProgressEntry[]): number {
  const map = buildProgressMap(entries);
  let count = 0;

  for (const juz of JUZ_BOUNDARIES) {
    if (isJuzComplete(juz, map)) {
      count++;
    }
  }
  return count;
}

function isJuzComplete(
  juz: (typeof JUZ_BOUNDARIES)[0],
  progressMap: ProgressMap
): boolean {
  for (
    let surahNum = juz.startSurah;
    surahNum <= juz.endSurah;
    surahNum++
  ) {
    const surah = getSurah(surahNum);
    if (!surah) return false;

    const memorizedUpTo = progressMap[surahNum] || 0;
    const ayahEnd =
      surahNum === juz.endSurah ? juz.endAyah : surah.totalAyahs;

    if (memorizedUpTo < ayahEnd) {
      return false;
    }
  }
  return true;
}

function getCurrentLocation(entries: ProgressEntry[]): {
  juz: number;
  surahName: string;
  surahNumber: number;
  ayah: number;
} {
  if (entries.length === 0) {
    return { juz: 0, surahName: "Not started", surahNumber: 0, ayah: 0 };
  }

  // Sort by most recently updated
  const sorted = [...entries].sort(
    (a, b) =>
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );
  const latest = sorted[0]!;
  const surah = getSurah(latest.surah_number);

  return {
    juz: getJuzForPosition(latest.surah_number, latest.last_ayah),
    surahName: surah?.name || "Unknown",
    surahNumber: latest.surah_number,
    ayah: latest.last_ayah,
  };
}

function calculateTrend(userId: number): number {
  const result = db
    .prepare(
      `SELECT COALESCE(SUM(ayah_to - ayah_from), 0) as delta
       FROM progress_log
       WHERE user_id = ? AND logged_at >= datetime('now', '-7 days')`
    )
    .get(userId) as { delta: number };

  return result.delta;
}

function getJoinedLabel(createdAt: string): string {
  const created = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - created.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Joined today";
  if (diffDays === 1) return "Joined yesterday";
  if (diffDays < 7) return `Joined ${diffDays} days ago`;
  if (diffDays < 30) return `Joined ${Math.floor(diffDays / 7)} weeks ago`;
  return `Joined ${Math.floor(diffDays / 30)} months ago`;
}

export function getRankedMembers(params: {
  search?: string;
  sort?: string;
  page?: number;
  perPage?: number;
}): { members: RankedUser[]; total: number } {
  const { search, sort = "juz", page = 1, perPage = 20 } = params;

  // Get all approved members
  let whereClause = "WHERE u.role IN ('member', 'admin')";
  const queryParams: (string | number)[] = [];

  if (search) {
    whereClause += " AND u.name LIKE ?";
    queryParams.push(`%${search}%`);
  }

  // Count total
  const countRow = db
    .prepare(`SELECT COUNT(*) as c FROM users u ${whereClause}`)
    .get(...queryParams) as { c: number };
  const total = countRow.c;

  // Get users with their total memorized ayahs
  const users = db
    .prepare(
      `SELECT u.id, u.name, u.avatar_url, u.created_at,
              COALESCE(SUM(pe.last_ayah), 0) as total_memorized
       FROM users u
       LEFT JOIN progress_entries pe ON pe.user_id = u.id
       ${whereClause}
       GROUP BY u.id
       ORDER BY ${sort === "name" ? "u.name ASC" : "total_memorized DESC, u.created_at ASC"}
       LIMIT ? OFFSET ?`
    )
    .all(...queryParams, perPage, (page - 1) * perPage) as Array<{
    id: number;
    name: string;
    avatar_url: string | null;
    created_at: string;
    total_memorized: number;
  }>;

  // Build ranked users with full details
  const members: RankedUser[] = [];

  // For ranking, we need the global rank offset
  const allRanked = db
    .prepare(
      `SELECT u.id, COALESCE(SUM(pe.last_ayah), 0) as total_memorized
       FROM users u
       LEFT JOIN progress_entries pe ON pe.user_id = u.id
       WHERE u.role IN ('member', 'admin')
       GROUP BY u.id
       ORDER BY total_memorized DESC, u.created_at ASC`
    )
    .all() as Array<{ id: number; total_memorized: number }>;

  const rankMap = new Map<number, number>();
  allRanked.forEach((u, i) => rankMap.set(u.id, i + 1));

  for (const u of users) {
    const entries = db
      .prepare("SELECT * FROM progress_entries WHERE user_id = ?")
      .all(u.id) as ProgressEntry[];

    const location = getCurrentLocation(entries);
    const trend = calculateTrend(u.id);

    members.push({
      id: u.id,
      name: u.name,
      avatar_url: u.avatar_url,
      rank: rankMap.get(u.id) || 0,
      total_memorized: u.total_memorized,
      juz_completed: juzCompletedCount(entries),
      progress_percent: overallProgressPercent(entries),
      current_surah: location.surahName,
      current_surah_number: location.surahNumber,
      current_ayah: location.ayah,
      current_juz: location.juz,
      trend,
      streak_days: 0,
      joined_label: getJoinedLabel(u.created_at),
    });
  }

  return { members, total };
}

export function getUserProgress(userId: number): {
  entries: ProgressEntry[];
  totalMemorized: number;
  progressPercent: number;
  juzCompleted: number;
  currentLocation: ReturnType<typeof getCurrentLocation>;
} {
  const entries = db
    .prepare(
      "SELECT * FROM progress_entries WHERE user_id = ? ORDER BY surah_number ASC"
    )
    .all(userId) as ProgressEntry[];

  return {
    entries,
    totalMemorized: totalAyahsMemorized(entries),
    progressPercent: overallProgressPercent(entries),
    juzCompleted: juzCompletedCount(entries),
    currentLocation: getCurrentLocation(entries),
  };
}
