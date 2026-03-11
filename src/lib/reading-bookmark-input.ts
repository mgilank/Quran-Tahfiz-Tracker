type ResolveReadingBookmarkInputParams = {
  rawSurahNumber?: string;
  rawAyahNumber?: string;
  surahTotalAyahs: number;
  surahName: string;
};

type ReadingBookmarkInputError = {
  ok: false;
  error: string;
};

type ReadingBookmarkInputSuccess = {
  ok: true;
  surahNumber: number;
  ayahNumber: number;
};

export function resolveReadingBookmarkInput(
  params: ResolveReadingBookmarkInputParams
): ReadingBookmarkInputError | ReadingBookmarkInputSuccess {
  const { rawSurahNumber, rawAyahNumber, surahTotalAyahs, surahName } = params;
  const surahNumber = parseInt(rawSurahNumber || "", 10);
  const ayahNumber = parseInt(rawAyahNumber || "", 10);

  if (isNaN(surahNumber) || isNaN(ayahNumber)) {
    return {
      ok: false,
      error: "Invalid input. Please provide valid numbers.",
    };
  }

  if (ayahNumber < 1 || ayahNumber > surahTotalAyahs) {
    return {
      ok: false,
      error: `Ayah must be between 1 and ${surahTotalAyahs} for ${surahName}.`,
    };
  }

  return {
    ok: true,
    surahNumber,
    ayahNumber,
  };
}
