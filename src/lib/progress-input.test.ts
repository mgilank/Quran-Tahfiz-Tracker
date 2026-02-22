import { describe, expect, test } from "bun:test";
import { resolveProgressUpdateInput } from "./progress-input.ts";

describe("resolveProgressUpdateInput", () => {
  test("set mode accepts valid last ayah", () => {
    const result = resolveProgressUpdateInput({
      mode: "set",
      rawLastAyah: "30",
      rawIncrement: undefined,
      existingLastAyah: 10,
      hasExistingEntry: true,
      surahName: "Al-Baqarah",
      surahTotalAyahs: 286,
    });

    expect(result).toEqual({
      ok: true,
      lastAyah: 30,
      usedMode: "set",
      appliedIncrement: 0,
    });
  });

  test("increment mode adds ayah to existing surah", () => {
    const result = resolveProgressUpdateInput({
      mode: "increment",
      rawLastAyah: undefined,
      rawIncrement: "3",
      existingLastAyah: 51,
      hasExistingEntry: true,
      surahName: "Al-Ankabut",
      surahTotalAyahs: 69,
    });

    expect(result).toEqual({
      ok: true,
      lastAyah: 54,
      usedMode: "increment",
      appliedIncrement: 3,
    });
  });

  test("increment mode caps at end of surah", () => {
    const result = resolveProgressUpdateInput({
      mode: "increment",
      rawLastAyah: undefined,
      rawIncrement: "10",
      existingLastAyah: 65,
      hasExistingEntry: true,
      surahName: "Al-Ankabut",
      surahTotalAyahs: 69,
    });

    expect(result).toEqual({
      ok: true,
      lastAyah: 69,
      usedMode: "increment",
      appliedIncrement: 4,
    });
  });

  test("increment mode requires existing surah entry", () => {
    const result = resolveProgressUpdateInput({
      mode: "increment",
      rawLastAyah: undefined,
      rawIncrement: "2",
      existingLastAyah: 0,
      hasExistingEntry: false,
      surahName: "Al-Ankabut",
      surahTotalAyahs: 69,
    });

    expect(result).toEqual({
      ok: false,
      error: "Please add this surah first using Last Ayah Memorized.",
    });
  });

  test("increment mode validates increment value", () => {
    const result = resolveProgressUpdateInput({
      mode: "increment",
      rawLastAyah: undefined,
      rawIncrement: "0",
      existingLastAyah: 30,
      hasExistingEntry: true,
      surahName: "Al-Ankabut",
      surahTotalAyahs: 69,
    });

    expect(result).toEqual({
      ok: false,
      error: "Ayah increment must be at least 1.",
    });
  });

  test("advance mode starts from existing ayah and accepts equal value", () => {
    const result = resolveProgressUpdateInput({
      mode: "advance",
      rawLastAyah: "51",
      rawIncrement: undefined,
      existingLastAyah: 51,
      hasExistingEntry: true,
      surahName: "Al-Ankabut",
      surahTotalAyahs: 69,
    });

    expect(result).toEqual({
      ok: true,
      lastAyah: 51,
      usedMode: "advance",
      appliedIncrement: 0,
    });
  });

  test("advance mode rejects ayah lower than existing", () => {
    const result = resolveProgressUpdateInput({
      mode: "advance",
      rawLastAyah: "50",
      rawIncrement: undefined,
      existingLastAyah: 51,
      hasExistingEntry: true,
      surahName: "Al-Ankabut",
      surahTotalAyahs: 69,
    });

    expect(result).toEqual({
      ok: false,
      error: "Ayah must be at least 51 for Al-Ankabut.",
    });
  });

  test("complete mode marks surah to final ayah", () => {
    const result = resolveProgressUpdateInput({
      mode: "complete",
      rawLastAyah: undefined,
      rawIncrement: undefined,
      existingLastAyah: 65,
      hasExistingEntry: true,
      surahName: "Ta-Ha",
      surahTotalAyahs: 200,
    });

    expect(result).toEqual({
      ok: true,
      lastAyah: 200,
      usedMode: "complete",
      appliedIncrement: 135,
    });
  });
});
