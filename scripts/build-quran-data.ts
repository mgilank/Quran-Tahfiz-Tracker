import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { SURAHS } from "../src/data/quran-meta.ts";

type SourceVerse = {
  id: number;
  text: string;
};

type SourceChapter = {
  id: number;
  verses: SourceVerse[];
};

async function buildQuranData() {
  const rootDir = join(import.meta.dir, "..");
  const sourceDir = join(rootDir, "node_modules", "quran-json", "dist", "chapters");
  const outputDir = join(rootDir, "data", "quran");

  await mkdir(outputDir, { recursive: true });

  for (const surah of SURAHS) {
    const sourcePath = join(sourceDir, `${surah.number}.json`);
    const raw = await readFile(sourcePath, "utf-8");
    const chapter = JSON.parse(raw) as SourceChapter;

    if (!Array.isArray(chapter.verses)) {
      throw new Error(`Invalid source verses format for surah ${surah.number}.`);
    }

    if (chapter.verses.length !== surah.totalAyahs) {
      throw new Error(
        `Ayah count mismatch for surah ${surah.number}. Expected ${surah.totalAyahs}, got ${chapter.verses.length}.`
      );
    }

    const output = {
      surahNumber: surah.number,
      ayahs: chapter.verses.map((verse) => ({
        number: verse.id,
        text: verse.text,
      })),
    };

    const paddedSurah = surah.number.toString().padStart(3, "0");
    const outputPath = join(outputDir, `surah-${paddedSurah}.json`);
    await writeFile(outputPath, JSON.stringify(output), "utf-8");
  }

  console.log(`Generated ${SURAHS.length} surah files in data/quran.`);
}

void buildQuranData();
