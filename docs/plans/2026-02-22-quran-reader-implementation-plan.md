# Quran Reader Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a new `/quran` in-app reader with full Quran text and single global per-user last-read bookmark.

**Architecture:** Add a dedicated Quran route/page pair, with static local Quran text files loaded per-surah and a `reading_bookmarks` table for one bookmark per user. Keep memorization progress isolated from reading state. Validate all bookmark writes against `quran-meta` surah/ayah bounds.

**Tech Stack:** Bun, Hono, SQLite, TSX server-rendered views, bun:test.

---

### Task 1: Reading Bookmark Input Validation (TDD)

**Files:**
- Create: `src/lib/reading-bookmark-input.test.ts`
- Create: `src/lib/reading-bookmark-input.ts`

**Step 1: Write failing tests**
- Add tests for valid bookmark input, invalid numeric parsing, and out-of-range ayah.

**Step 2: Run test to verify RED**
- Run: `bun test src/lib/reading-bookmark-input.test.ts`
- Expected: fail because implementation does not exist.

**Step 3: Write minimal implementation**
- Implement `resolveReadingBookmarkInput` returning typed success/error objects.

**Step 4: Run test to verify GREEN**
- Run: `bun test src/lib/reading-bookmark-input.test.ts`
- Expected: all tests pass.

### Task 2: Quran Text Loader (TDD)

**Files:**
- Create: `src/lib/quran-loader.test.ts`
- Create: `src/lib/quran-loader.ts`
- Create: `data/quran/surah-001.json` (shape reference for loader tests)

**Step 1: Write failing tests**
- Add tests ensuring loader reads the right file path, validates ayah count, and throws on missing file.

**Step 2: Run test to verify RED**
- Run: `bun test src/lib/quran-loader.test.ts`
- Expected: fail because loader does not exist.

**Step 3: Write minimal implementation**
- Implement `getSurahAyahs(surahNumber)` reading `data/quran/surah-XXX.json` and returning ayah list.

**Step 4: Run test to verify GREEN**
- Run: `bun test src/lib/quran-loader.test.ts`
- Expected: all tests pass.

### Task 3: Schema + Type Support for Bookmark

**Files:**
- Modify: `src/db/schema.ts`
- Modify: `src/types.ts`

**Step 1: Write migration-safe schema update**
- Add `reading_bookmarks` table with unique `user_id`.

**Step 2: Add TypeScript interface**
- Add `ReadingBookmark` type to `src/types.ts`.

**Step 3: Verify no regressions in tests**
- Run: `bun test`

### Task 4: Quran Route (GET + Bookmark POST)

**Files:**
- Create: `src/routes/quran.tsx`
- Modify: `src/index.tsx`

**Step 1: Wire GET route**
- Render page with user, bookmark, surah list, selected surah, and loaded ayahs.

**Step 2: Wire POST bookmark save**
- Validate via `resolveReadingBookmarkInput`, then upsert into `reading_bookmarks`.

**Step 3: Verify behavior**
- Run focused tests + `bun test`.

### Task 5: Quran Page UI + Navigation

**Files:**
- Create: `src/views/pages/QuranPage.tsx`
- Modify: `src/views/components/Header.tsx`

**Step 1: Build reader UI**
- Add continue card, surah list selector, ayah list with `Mark last read` buttons.

**Step 2: Add nav link**
- Add `/quran` in header nav with active-state highlighting.

**Step 3: Verify visual/flow smoke**
- Start app and confirm `/quran` renders and bookmark updates.

### Task 6: Quran Dataset Population

**Files:**
- Create: `scripts/build-quran-data.ts`
- Create: `data/quran/surah-001.json` ... `data/quran/surah-114.json`

**Step 1: Source local Quran text package**
- Install an npm package containing complete Arabic Quran text.

**Step 2: Build per-surah files**
- Generate normalized files with `{ surahNumber, ayahs: [{ number, text }] }`.

**Step 3: Verify file integrity**
- Run a script assertion that 114 files exist and ayah counts match `quran-meta`.

### Task 7: Final Verification

**Files:**
- Modify: none

**Step 1: Run full tests**
- Run: `bun test`

**Step 2: Run typecheck (best effort)**
- Run: `bunx tsc --noEmit`
- Note existing unrelated errors separately if present.

**Step 3: Manual acceptance checks**
- Open `/quran`, mark bookmark, refresh, and continue jump check.
