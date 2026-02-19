export interface SurahMeta {
  number: number;
  name: string;
  nameArabic: string;
  totalAyahs: number;
}

export interface JuzMeta {
  juzNumber: number;
  startSurah: number;
  startAyah: number;
  endSurah: number;
  endAyah: number;
}

export const SURAHS: SurahMeta[] = [
  { number: 1, name: "Al-Fatihah", nameArabic: "الفاتحة", totalAyahs: 7 },
  { number: 2, name: "Al-Baqarah", nameArabic: "البقرة", totalAyahs: 286 },
  { number: 3, name: "Ali 'Imran", nameArabic: "آل عمران", totalAyahs: 200 },
  { number: 4, name: "An-Nisa", nameArabic: "النساء", totalAyahs: 176 },
  { number: 5, name: "Al-Ma'idah", nameArabic: "المائدة", totalAyahs: 120 },
  { number: 6, name: "Al-An'am", nameArabic: "الأنعام", totalAyahs: 165 },
  { number: 7, name: "Al-A'raf", nameArabic: "الأعراف", totalAyahs: 206 },
  { number: 8, name: "Al-Anfal", nameArabic: "الأنفال", totalAyahs: 75 },
  { number: 9, name: "At-Tawbah", nameArabic: "التوبة", totalAyahs: 129 },
  { number: 10, name: "Yunus", nameArabic: "يونس", totalAyahs: 109 },
  { number: 11, name: "Hud", nameArabic: "هود", totalAyahs: 123 },
  { number: 12, name: "Yusuf", nameArabic: "يوسف", totalAyahs: 111 },
  { number: 13, name: "Ar-Ra'd", nameArabic: "الرعد", totalAyahs: 43 },
  { number: 14, name: "Ibrahim", nameArabic: "ابراهيم", totalAyahs: 52 },
  { number: 15, name: "Al-Hijr", nameArabic: "الحجر", totalAyahs: 99 },
  { number: 16, name: "An-Nahl", nameArabic: "النحل", totalAyahs: 128 },
  { number: 17, name: "Al-Isra", nameArabic: "الإسراء", totalAyahs: 111 },
  { number: 18, name: "Al-Kahf", nameArabic: "الكهف", totalAyahs: 110 },
  { number: 19, name: "Maryam", nameArabic: "مريم", totalAyahs: 98 },
  { number: 20, name: "Ta-Ha", nameArabic: "طه", totalAyahs: 135 },
  { number: 21, name: "Al-Anbiya", nameArabic: "الأنبياء", totalAyahs: 112 },
  { number: 22, name: "Al-Hajj", nameArabic: "الحج", totalAyahs: 78 },
  { number: 23, name: "Al-Mu'minun", nameArabic: "المؤمنون", totalAyahs: 118 },
  { number: 24, name: "An-Nur", nameArabic: "النور", totalAyahs: 64 },
  { number: 25, name: "Al-Furqan", nameArabic: "الفرقان", totalAyahs: 77 },
  { number: 26, name: "Ash-Shu'ara", nameArabic: "الشعراء", totalAyahs: 227 },
  { number: 27, name: "An-Naml", nameArabic: "النمل", totalAyahs: 93 },
  { number: 28, name: "Al-Qasas", nameArabic: "القصص", totalAyahs: 88 },
  { number: 29, name: "Al-'Ankabut", nameArabic: "العنكبوت", totalAyahs: 69 },
  { number: 30, name: "Ar-Rum", nameArabic: "الروم", totalAyahs: 60 },
  { number: 31, name: "Luqman", nameArabic: "لقمان", totalAyahs: 34 },
  { number: 32, name: "As-Sajdah", nameArabic: "السجدة", totalAyahs: 30 },
  { number: 33, name: "Al-Ahzab", nameArabic: "الأحزاب", totalAyahs: 73 },
  { number: 34, name: "Saba", nameArabic: "سبإ", totalAyahs: 54 },
  { number: 35, name: "Fatir", nameArabic: "فاطر", totalAyahs: 45 },
  { number: 36, name: "Ya-Sin", nameArabic: "يس", totalAyahs: 83 },
  { number: 37, name: "As-Saffat", nameArabic: "الصافات", totalAyahs: 182 },
  { number: 38, name: "Sad", nameArabic: "ص", totalAyahs: 88 },
  { number: 39, name: "Az-Zumar", nameArabic: "الزمر", totalAyahs: 75 },
  { number: 40, name: "Ghafir", nameArabic: "غافر", totalAyahs: 85 },
  { number: 41, name: "Fussilat", nameArabic: "فصلت", totalAyahs: 54 },
  { number: 42, name: "Ash-Shura", nameArabic: "الشورى", totalAyahs: 53 },
  { number: 43, name: "Az-Zukhruf", nameArabic: "الزخرف", totalAyahs: 89 },
  { number: 44, name: "Ad-Dukhan", nameArabic: "الدخان", totalAyahs: 59 },
  { number: 45, name: "Al-Jathiyah", nameArabic: "الجاثية", totalAyahs: 37 },
  { number: 46, name: "Al-Ahqaf", nameArabic: "الأحقاف", totalAyahs: 35 },
  { number: 47, name: "Muhammad", nameArabic: "محمد", totalAyahs: 38 },
  { number: 48, name: "Al-Fath", nameArabic: "الفتح", totalAyahs: 29 },
  { number: 49, name: "Al-Hujurat", nameArabic: "الحجرات", totalAyahs: 18 },
  { number: 50, name: "Qaf", nameArabic: "ق", totalAyahs: 45 },
  { number: 51, name: "Adh-Dhariyat", nameArabic: "الذاريات", totalAyahs: 60 },
  { number: 52, name: "At-Tur", nameArabic: "الطور", totalAyahs: 49 },
  { number: 53, name: "An-Najm", nameArabic: "النجم", totalAyahs: 62 },
  { number: 54, name: "Al-Qamar", nameArabic: "القمر", totalAyahs: 55 },
  { number: 55, name: "Ar-Rahman", nameArabic: "الرحمن", totalAyahs: 78 },
  { number: 56, name: "Al-Waqi'ah", nameArabic: "الواقعة", totalAyahs: 96 },
  { number: 57, name: "Al-Hadid", nameArabic: "الحديد", totalAyahs: 29 },
  { number: 58, name: "Al-Mujadila", nameArabic: "المجادلة", totalAyahs: 22 },
  { number: 59, name: "Al-Hashr", nameArabic: "الحشر", totalAyahs: 24 },
  { number: 60, name: "Al-Mumtahanah", nameArabic: "الممتحنة", totalAyahs: 13 },
  { number: 61, name: "As-Saff", nameArabic: "الصف", totalAyahs: 14 },
  { number: 62, name: "Al-Jumu'ah", nameArabic: "الجمعة", totalAyahs: 11 },
  { number: 63, name: "Al-Munafiqun", nameArabic: "المنافقون", totalAyahs: 11 },
  { number: 64, name: "At-Taghabun", nameArabic: "التغابن", totalAyahs: 18 },
  { number: 65, name: "At-Talaq", nameArabic: "الطلاق", totalAyahs: 12 },
  { number: 66, name: "At-Tahrim", nameArabic: "التحريم", totalAyahs: 12 },
  { number: 67, name: "Al-Mulk", nameArabic: "الملك", totalAyahs: 30 },
  { number: 68, name: "Al-Qalam", nameArabic: "القلم", totalAyahs: 52 },
  { number: 69, name: "Al-Haqqah", nameArabic: "الحاقة", totalAyahs: 52 },
  { number: 70, name: "Al-Ma'arij", nameArabic: "المعارج", totalAyahs: 44 },
  { number: 71, name: "Nuh", nameArabic: "نوح", totalAyahs: 28 },
  { number: 72, name: "Al-Jinn", nameArabic: "الجن", totalAyahs: 28 },
  { number: 73, name: "Al-Muzzammil", nameArabic: "المزمل", totalAyahs: 20 },
  { number: 74, name: "Al-Muddaththir", nameArabic: "المدثر", totalAyahs: 56 },
  { number: 75, name: "Al-Qiyamah", nameArabic: "القيامة", totalAyahs: 40 },
  { number: 76, name: "Al-Insan", nameArabic: "الانسان", totalAyahs: 31 },
  { number: 77, name: "Al-Mursalat", nameArabic: "المرسلات", totalAyahs: 50 },
  { number: 78, name: "An-Naba", nameArabic: "النبأ", totalAyahs: 40 },
  { number: 79, name: "An-Nazi'at", nameArabic: "النازعات", totalAyahs: 46 },
  { number: 80, name: "'Abasa", nameArabic: "عبس", totalAyahs: 42 },
  { number: 81, name: "At-Takwir", nameArabic: "التكوير", totalAyahs: 29 },
  { number: 82, name: "Al-Infitar", nameArabic: "الإنفطار", totalAyahs: 19 },
  { number: 83, name: "Al-Mutaffifin", nameArabic: "المطففين", totalAyahs: 36 },
  { number: 84, name: "Al-Inshiqaq", nameArabic: "الإنشقاق", totalAyahs: 25 },
  { number: 85, name: "Al-Buruj", nameArabic: "البروج", totalAyahs: 22 },
  { number: 86, name: "At-Tariq", nameArabic: "الطارق", totalAyahs: 17 },
  { number: 87, name: "Al-A'la", nameArabic: "الأعلى", totalAyahs: 19 },
  { number: 88, name: "Al-Ghashiyah", nameArabic: "الغاشية", totalAyahs: 26 },
  { number: 89, name: "Al-Fajr", nameArabic: "الفجر", totalAyahs: 30 },
  { number: 90, name: "Al-Balad", nameArabic: "البلد", totalAyahs: 20 },
  { number: 91, name: "Ash-Shams", nameArabic: "الشمس", totalAyahs: 15 },
  { number: 92, name: "Al-Layl", nameArabic: "الليل", totalAyahs: 21 },
  { number: 93, name: "Ad-Duha", nameArabic: "الضحى", totalAyahs: 11 },
  { number: 94, name: "Ash-Sharh", nameArabic: "الشرح", totalAyahs: 8 },
  { number: 95, name: "At-Tin", nameArabic: "التين", totalAyahs: 8 },
  { number: 96, name: "Al-'Alaq", nameArabic: "العلق", totalAyahs: 19 },
  { number: 97, name: "Al-Qadr", nameArabic: "القدر", totalAyahs: 5 },
  { number: 98, name: "Al-Bayyinah", nameArabic: "البينة", totalAyahs: 8 },
  { number: 99, name: "Az-Zalzalah", nameArabic: "الزلزلة", totalAyahs: 8 },
  { number: 100, name: "Al-'Adiyat", nameArabic: "العاديات", totalAyahs: 11 },
  { number: 101, name: "Al-Qari'ah", nameArabic: "القارعة", totalAyahs: 11 },
  { number: 102, name: "At-Takathur", nameArabic: "التكاثر", totalAyahs: 8 },
  { number: 103, name: "Al-'Asr", nameArabic: "العصر", totalAyahs: 3 },
  { number: 104, name: "Al-Humazah", nameArabic: "الهمزة", totalAyahs: 9 },
  { number: 105, name: "Al-Fil", nameArabic: "الفيل", totalAyahs: 5 },
  { number: 106, name: "Quraysh", nameArabic: "قريش", totalAyahs: 4 },
  { number: 107, name: "Al-Ma'un", nameArabic: "الماعون", totalAyahs: 7 },
  { number: 108, name: "Al-Kawthar", nameArabic: "الكوثر", totalAyahs: 3 },
  { number: 109, name: "Al-Kafirun", nameArabic: "الكافرون", totalAyahs: 6 },
  { number: 110, name: "An-Nasr", nameArabic: "النصر", totalAyahs: 3 },
  { number: 111, name: "Al-Masad", nameArabic: "المسد", totalAyahs: 5 },
  { number: 112, name: "Al-Ikhlas", nameArabic: "الإخلاص", totalAyahs: 4 },
  { number: 113, name: "Al-Falaq", nameArabic: "الفلق", totalAyahs: 5 },
  { number: 114, name: "An-Nas", nameArabic: "الناس", totalAyahs: 6 },
];

// Total ayahs in the entire Quran
export const TOTAL_AYAHS = SURAHS.reduce((sum, s) => sum + s.totalAyahs, 0); // 6236

// Juz boundaries (standard Uthmani mushaf)
export const JUZ_BOUNDARIES: JuzMeta[] = [
  { juzNumber: 1, startSurah: 1, startAyah: 1, endSurah: 2, endAyah: 141 },
  { juzNumber: 2, startSurah: 2, startAyah: 142, endSurah: 2, endAyah: 252 },
  { juzNumber: 3, startSurah: 2, startAyah: 253, endSurah: 3, endAyah: 92 },
  { juzNumber: 4, startSurah: 3, startAyah: 93, endSurah: 4, endAyah: 23 },
  { juzNumber: 5, startSurah: 4, startAyah: 24, endSurah: 4, endAyah: 147 },
  { juzNumber: 6, startSurah: 4, startAyah: 148, endSurah: 5, endAyah: 81 },
  { juzNumber: 7, startSurah: 5, startAyah: 82, endSurah: 6, endAyah: 110 },
  { juzNumber: 8, startSurah: 6, startAyah: 111, endSurah: 7, endAyah: 87 },
  { juzNumber: 9, startSurah: 7, startAyah: 88, endSurah: 8, endAyah: 40 },
  { juzNumber: 10, startSurah: 8, startAyah: 41, endSurah: 9, endAyah: 92 },
  { juzNumber: 11, startSurah: 9, startAyah: 93, endSurah: 11, endAyah: 5 },
  { juzNumber: 12, startSurah: 11, startAyah: 6, endSurah: 12, endAyah: 52 },
  { juzNumber: 13, startSurah: 12, startAyah: 53, endSurah: 14, endAyah: 52 },
  { juzNumber: 14, startSurah: 15, startAyah: 1, endSurah: 16, endAyah: 128 },
  { juzNumber: 15, startSurah: 17, startAyah: 1, endSurah: 18, endAyah: 74 },
  { juzNumber: 16, startSurah: 18, startAyah: 75, endSurah: 20, endAyah: 135 },
  { juzNumber: 17, startSurah: 21, startAyah: 1, endSurah: 22, endAyah: 78 },
  { juzNumber: 18, startSurah: 23, startAyah: 1, endSurah: 25, endAyah: 20 },
  { juzNumber: 19, startSurah: 25, startAyah: 21, endSurah: 27, endAyah: 55 },
  { juzNumber: 20, startSurah: 27, startAyah: 56, endSurah: 29, endAyah: 45 },
  { juzNumber: 21, startSurah: 29, startAyah: 46, endSurah: 33, endAyah: 30 },
  { juzNumber: 22, startSurah: 33, startAyah: 31, endSurah: 36, endAyah: 27 },
  { juzNumber: 23, startSurah: 36, startAyah: 28, endSurah: 39, endAyah: 31 },
  { juzNumber: 24, startSurah: 39, startAyah: 32, endSurah: 41, endAyah: 46 },
  { juzNumber: 25, startSurah: 41, startAyah: 47, endSurah: 45, endAyah: 37 },
  { juzNumber: 26, startSurah: 46, startAyah: 1, endSurah: 51, endAyah: 30 },
  { juzNumber: 27, startSurah: 51, startAyah: 31, endSurah: 57, endAyah: 29 },
  { juzNumber: 28, startSurah: 58, startAyah: 1, endSurah: 66, endAyah: 12 },
  { juzNumber: 29, startSurah: 67, startAyah: 1, endSurah: 77, endAyah: 50 },
  { juzNumber: 30, startSurah: 78, startAyah: 1, endSurah: 114, endAyah: 6 },
];

// Helper: get surah by number
export function getSurah(number: number): SurahMeta | undefined {
  return SURAHS[number - 1];
}

// Helper: get which Juz a given surah:ayah position is in
export function getJuzForPosition(surahNumber: number, ayahNumber: number): number {
  for (const juz of JUZ_BOUNDARIES) {
    const afterStart =
      surahNumber > juz.startSurah ||
      (surahNumber === juz.startSurah && ayahNumber >= juz.startAyah);
    const beforeEnd =
      surahNumber < juz.endSurah ||
      (surahNumber === juz.endSurah && ayahNumber <= juz.endAyah);
    if (afterStart && beforeEnd) return juz.juzNumber;
  }
  return 1;
}
