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

type IDChapter = {
  translations: {
    resource_id: number;
    text: string;
  }[];
};

async function buildQuranData() {
  const rootDir = join(import.meta.dir, "..");
  const sourceDir = join(rootDir, "node_modules", "quran-json", "dist", "chapters");
  const outputDir = join(rootDir, "data", "quran");

  await mkdir(outputDir, { recursive: true });

  for (const surah of SURAHS) {
    console.log(`Building surah ${surah.number}: ${surah.name}...`);
    const sourcePath = join(sourceDir, `${surah.number}.json`);
    const raw = await readFile(sourcePath, "utf-8");
    const chapter = JSON.parse(raw) as SourceChapter;

    // Fetch Indonesian translation from api.quran.com
    let translations: string[] = [];
    try {
      const resp = await fetch(`https://api.quran.com/api/v4/quran/translations/33?chapter_number=${surah.number}`);
      const idData = (await resp.json()) as IDChapter;
      translations = idData.translations.map(t => 
        t.text
          .replace(/<sup[^>]*>.*?<\/sup>/gi, '') // Remove <sup> tags AND their content (footnote numbers)
          .replace(/<[^>]*>?/gm, '')            // Remove any remaining HTML tags
          .trim()
      );
    } catch (err) {      console.error(`Failed to fetch Indonesian translation for surah ${surah.number}:`, err);
    }

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
      ayahs: chapter.verses.map((verse, index) => ({
        number: verse.id,
        text: verse.text,
        translation: translations[index] || "Terjemahan tidak tersedia.",
      })),
    };

    const paddedSurah = surah.number.toString().padStart(3, "0");
    const outputPath = join(outputDir, `surah-${paddedSurah}.json`);
    await writeFile(outputPath, JSON.stringify(output), "utf-8");
    
    // Throttle a bit to respect API
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  console.log(`Generated ${SURAHS.length} surah files in data/quran.`);
}

void buildQuranData();
