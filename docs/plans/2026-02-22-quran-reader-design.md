# Quran Reader Design

**Date:** 2026-02-22  
**Status:** Approved for implementation planning  
**Scope:** MVP only (no translation/audio)

## Goal

Add a new in-app **Al Quran reading page** at `/quran` where users can:
- read Quran content directly in the app,
- navigate by surah,
- save one global **last-read** bookmark by tapping an ayah,
- continue later from the saved bookmark.

## Confirmed Product Decisions

- Quran is a **separate page** from progress/memorization.
- Bookmark model is **single global bookmark per user**.
- Data source is **local static data in repository** (no external API).
- Bookmark action is **tap on ayah** (no manual input for MVP).
- MVP excludes translation, audio, tafsir, and multi-bookmarks.

## Architecture

### 1) Static Quran Content

Use local files:
- Surah index metadata (number, name, total ayahs) for fast navigator rendering.
- Per-surah ayah files (lazy loaded) for better first-load performance than one huge JSON.

### 2) User Reading State

Store one bookmark row per user:
- `user_id` (unique)
- `surah_number`
- `ayah_number`
- `created_at`
- `updated_at`

This reading bookmark is isolated from memorization progress.

## Route and Data Flow

### GET `/quran`

Loads:
- authenticated user,
- surah index,
- user bookmark (if any),
- selected surah ayahs (default = bookmarked surah, otherwise Surah 1).

Renders:
- Surah navigator,
- reading panel,
- continue card if bookmark exists.

### POST `/quran` (bookmark action)

Receives:
- `surah_number`
- `ayah_number`
- action from ayah tap: `Mark last read`

Validates:
- both values are integers,
- surah exists,
- ayah is within `1..totalAyahs` for that surah.

Writes:
- upsert single bookmark row per user.

Returns:
- success/error feedback and refreshed state.

## UI/UX

### Page Layout

- Header: title + short helper text.
- Continue card: `Continue from Surah X, Ayah Y` when bookmark exists.
- Surah navigator: searchable list of surahs.
- Reading panel: ayah list for selected surah.

### Ayah Interaction

Each ayah row includes:
- ayah number marker,
- Arabic text,
- `Mark last read` action.

If the ayah matches saved bookmark, show `Last read` indicator.

### States

- Empty bookmark state: prompt user to mark any ayah.
- Error state: invalid input/surah load issue shown clearly without breaking full page.
- Success state: confirmation banner/toast and updated continue card.

## Testing Plan

### Unit Tests

- bookmark input accepts valid surah/ayah.
- rejects NaN/empty values.
- rejects ayah outside surah range.

### Route Tests

- creates bookmark if none exists.
- updates bookmark if row already exists.
- rejects invalid params with user-friendly error.

### Manual QA

- open `/quran`, pick surah, mark ayah.
- refresh and verify continue card points to saved location.
- click continue and verify jump to surah/ayah anchor.
- ensure existing `/progress` memorization behavior remains unchanged.

## Non-Goals (MVP)

- Translation display.
- Audio playback.
- Multiple named bookmarks.
- Tafsir and advanced Quran search.

## Acceptance Criteria

- Authenticated member/admin can read Quran content in app at `/quran`.
- User can mark any ayah as last read with one tap.
- One latest bookmark per user is persisted and updated correctly.
- Reopening page shows accurate continue location.
- Reading bookmark does not affect memorization progress data.
