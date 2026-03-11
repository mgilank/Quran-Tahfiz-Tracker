import { describe, expect, test } from "bun:test";
import { resolveReadingBookmarkInput } from "./reading-bookmark-input.ts";

describe("resolveReadingBookmarkInput", () => {
  test("accepts valid bookmark input", () => {
    const result = resolveReadingBookmarkInput({
      rawSurahNumber: "2",
      rawAyahNumber: "255",
      surahTotalAyahs: 286,
      surahName: "Al-Baqarah",
    });

    expect(result).toEqual({
      ok: true,
      surahNumber: 2,
      ayahNumber: 255,
    });
  });

  test("rejects non-numeric inputs", () => {
    const result = resolveReadingBookmarkInput({
      rawSurahNumber: "abc",
      rawAyahNumber: "",
      surahTotalAyahs: 7,
      surahName: "Al-Fatihah",
    });

    expect(result).toEqual({
      ok: false,
      error: "Invalid input. Please provide valid numbers.",
    });
  });

  test("rejects ayah outside surah range", () => {
    const result = resolveReadingBookmarkInput({
      rawSurahNumber: "1",
      rawAyahNumber: "8",
      surahTotalAyahs: 7,
      surahName: "Al-Fatihah",
    });

    expect(result).toEqual({
      ok: false,
      error: "Ayah must be between 1 and 7 for Al-Fatihah.",
    });
  });
});
