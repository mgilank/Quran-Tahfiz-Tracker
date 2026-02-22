export type ProgressInputMode = "set" | "increment" | "advance" | "complete";

type ResolveProgressUpdateInputParams = {
  mode?: string;
  rawLastAyah?: string;
  rawIncrement?: string;
  existingLastAyah: number;
  hasExistingEntry: boolean;
  surahName: string;
  surahTotalAyahs: number;
};

type ProgressInputError = {
  ok: false;
  error: string;
};

type ProgressInputSuccess = {
  ok: true;
  lastAyah: number;
  usedMode: ProgressInputMode;
  appliedIncrement: number;
};

export function resolveProgressUpdateInput(
  params: ResolveProgressUpdateInputParams
): ProgressInputError | ProgressInputSuccess {
  const {
    mode,
    rawLastAyah,
    rawIncrement,
    existingLastAyah,
    hasExistingEntry,
    surahName,
    surahTotalAyahs,
  } = params;

  if (mode === "increment") {
    if (!hasExistingEntry) {
      return {
        ok: false,
        error: "Please add this surah first using Last Ayah Memorized.",
      };
    }

    if (existingLastAyah >= surahTotalAyahs) {
      return {
        ok: false,
        error: `${surahName} is already completed.`,
      };
    }

    const increment = parseInt(rawIncrement || "", 10);

    if (isNaN(increment)) {
      return {
        ok: false,
        error: "Invalid input. Please provide valid numbers.",
      };
    }

    if (increment < 1) {
      return {
        ok: false,
        error: "Ayah increment must be at least 1.",
      };
    }

    const nextAyah = Math.min(existingLastAyah + increment, surahTotalAyahs);

    return {
      ok: true,
      lastAyah: nextAyah,
      usedMode: "increment",
      appliedIncrement: nextAyah - existingLastAyah,
    };
  }

  if (mode === "advance") {
    if (!hasExistingEntry) {
      return {
        ok: false,
        error: "Please add this surah first using Last Ayah Memorized.",
      };
    }

    const lastAyah = parseInt(rawLastAyah || "", 10);

    if (isNaN(lastAyah)) {
      return {
        ok: false,
        error: "Invalid input. Please provide valid numbers.",
      };
    }

    if (lastAyah < existingLastAyah) {
      return {
        ok: false,
        error: `Ayah must be at least ${existingLastAyah} for ${surahName}.`,
      };
    }

    if (lastAyah > surahTotalAyahs) {
      return {
        ok: false,
        error: `Ayah must be between 1 and ${surahTotalAyahs} for ${surahName}.`,
      };
    }

    return {
      ok: true,
      lastAyah,
      usedMode: "advance",
      appliedIncrement: lastAyah - existingLastAyah,
    };
  }

  if (mode === "complete") {
    if (!hasExistingEntry) {
      return {
        ok: false,
        error: "Please add this surah first using Last Ayah Memorized.",
      };
    }

    if (existingLastAyah >= surahTotalAyahs) {
      return {
        ok: false,
        error: `${surahName} is already completed.`,
      };
    }

    return {
      ok: true,
      lastAyah: surahTotalAyahs,
      usedMode: "complete",
      appliedIncrement: surahTotalAyahs - existingLastAyah,
    };
  }

  const lastAyah = parseInt(rawLastAyah || "", 10);

  if (isNaN(lastAyah)) {
    return {
      ok: false,
      error: "Invalid input. Please provide valid numbers.",
    };
  }

  if (lastAyah < 1 || lastAyah > surahTotalAyahs) {
    return {
      ok: false,
      error: `Ayah must be between 1 and ${surahTotalAyahs} for ${surahName}.`,
    };
  }

  return {
    ok: true,
    lastAyah,
    usedMode: "set",
    appliedIncrement: 0,
  };
}
