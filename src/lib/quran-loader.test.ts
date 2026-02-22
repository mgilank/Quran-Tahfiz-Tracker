import { describe, expect, test } from "bun:test";
import { getSurahAyahs } from "./quran-loader.ts";

describe("getSurahAyahs", () => {
  test("loads ayahs from per-surah local file", () => {
    const ayahs = getSurahAyahs(1);

    expect(ayahs).toHaveLength(7);
    expect(ayahs[0]).toEqual({
      number: 1,
      text: "بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ",
    });
  });

  test("throws when surah number is invalid", () => {
    expect(() => getSurahAyahs(115)).toThrow("Invalid Surah number.");
  });
});
