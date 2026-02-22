import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { getSurah } from "../data/quran-meta.ts";

export interface QuranAyah {
  number: number;
  text: string;
}

type SurahFileShape = {
  surahNumber: number;
  ayahs: QuranAyah[];
};

function getSurahFilePath(surahNumber: number): string {
  const paddedSurah = surahNumber.toString().padStart(3, "0");
  return join(import.meta.dir, "..", "..", "data", "quran", `surah-${paddedSurah}.json`);
}

export function getSurahAyahs(surahNumber: number): QuranAyah[] {
  const surah = getSurah(surahNumber);
  if (!surah) {
    throw new Error("Invalid Surah number.");
  }

  const filePath = getSurahFilePath(surahNumber);
  if (!existsSync(filePath)) {
    throw new Error("Quran data file not found.");
  }

  const raw = readFileSync(filePath, "utf-8");
  const parsed = JSON.parse(raw) as SurahFileShape;

  if (!Array.isArray(parsed.ayahs)) {
    throw new Error("Invalid Quran data format.");
  }

  if (parsed.ayahs.length !== surah.totalAyahs) {
    throw new Error(`Quran data ayah count mismatch for ${surah.name}.`);
  }

  return parsed.ayahs;
}
