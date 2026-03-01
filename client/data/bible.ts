export interface BibleVersion {
  id: string;
  name: string;
  abbreviation: string;
  language: "english" | "french" | "kreyol";
  available: boolean;
}

export interface BibleBook {
  id: number;
  name: string;
  nameFrench: string;
  abbreviation: string;
  chapters: number;
  testament: "old" | "new";
}

export const bibleVersions: BibleVersion[] = [
  { id: "NKJV", name: "New King James Version", abbreviation: "NKJV", language: "english", available: true },
  { id: "NIV", name: "New International Version", abbreviation: "NIV", language: "english", available: true },
  { id: "ESV", name: "English Standard Version", abbreviation: "ESV", language: "english", available: true },
  { id: "BDS", name: "La Bible du Semeur", abbreviation: "BDS", language: "french", available: true },
  { id: "FRLSG", name: "Louis Segond 1910", abbreviation: "LSG", language: "french", available: true },
  { id: "BSA", name: "Bib Sen An (Kreyol)", abbreviation: "BSA", language: "kreyol", available: true },
];

export const bibleBooks: BibleBook[] = [
  { id: 1, name: "Genesis", nameFrench: "Genèse", abbreviation: "Gen", chapters: 50, testament: "old" },
  { id: 2, name: "Exodus", nameFrench: "Exode", abbreviation: "Exod", chapters: 40, testament: "old" },
  { id: 3, name: "Leviticus", nameFrench: "Lévitique", abbreviation: "Lev", chapters: 27, testament: "old" },
  { id: 4, name: "Numbers", nameFrench: "Nombres", abbreviation: "Num", chapters: 36, testament: "old" },
  { id: 5, name: "Deuteronomy", nameFrench: "Deutéronome", abbreviation: "Deut", chapters: 34, testament: "old" },
  { id: 6, name: "Joshua", nameFrench: "Josué", abbreviation: "Josh", chapters: 24, testament: "old" },
  { id: 7, name: "Judges", nameFrench: "Juges", abbreviation: "Judg", chapters: 21, testament: "old" },
  { id: 8, name: "Ruth", nameFrench: "Ruth", abbreviation: "Ruth", chapters: 4, testament: "old" },
  { id: 9, name: "1 Samuel", nameFrench: "1 Samuel", abbreviation: "1Sam", chapters: 31, testament: "old" },
  { id: 10, name: "2 Samuel", nameFrench: "2 Samuel", abbreviation: "2Sam", chapters: 24, testament: "old" },
  { id: 11, name: "1 Kings", nameFrench: "1 Rois", abbreviation: "1Kgs", chapters: 22, testament: "old" },
  { id: 12, name: "2 Kings", nameFrench: "2 Rois", abbreviation: "2Kgs", chapters: 25, testament: "old" },
  { id: 13, name: "1 Chronicles", nameFrench: "1 Chroniques", abbreviation: "1Chr", chapters: 29, testament: "old" },
  { id: 14, name: "2 Chronicles", nameFrench: "2 Chroniques", abbreviation: "2Chr", chapters: 36, testament: "old" },
  { id: 15, name: "Ezra", nameFrench: "Esdras", abbreviation: "Ezra", chapters: 10, testament: "old" },
  { id: 16, name: "Nehemiah", nameFrench: "Néhémie", abbreviation: "Neh", chapters: 13, testament: "old" },
  { id: 17, name: "Esther", nameFrench: "Esther", abbreviation: "Esth", chapters: 10, testament: "old" },
  { id: 18, name: "Job", nameFrench: "Job", abbreviation: "Job", chapters: 42, testament: "old" },
  { id: 19, name: "Psalms", nameFrench: "Psaumes", abbreviation: "Ps", chapters: 150, testament: "old" },
  { id: 20, name: "Proverbs", nameFrench: "Proverbes", abbreviation: "Prov", chapters: 31, testament: "old" },
  { id: 21, name: "Ecclesiastes", nameFrench: "Ecclésiaste", abbreviation: "Eccl", chapters: 12, testament: "old" },
  { id: 22, name: "Song of Solomon", nameFrench: "Cantique des Cantiques", abbreviation: "Song", chapters: 8, testament: "old" },
  { id: 23, name: "Isaiah", nameFrench: "Ésaïe", abbreviation: "Isa", chapters: 66, testament: "old" },
  { id: 24, name: "Jeremiah", nameFrench: "Jérémie", abbreviation: "Jer", chapters: 52, testament: "old" },
  { id: 25, name: "Lamentations", nameFrench: "Lamentations", abbreviation: "Lam", chapters: 5, testament: "old" },
  { id: 26, name: "Ezekiel", nameFrench: "Ézéchiel", abbreviation: "Ezek", chapters: 48, testament: "old" },
  { id: 27, name: "Daniel", nameFrench: "Daniel", abbreviation: "Dan", chapters: 12, testament: "old" },
  { id: 28, name: "Hosea", nameFrench: "Osée", abbreviation: "Hos", chapters: 14, testament: "old" },
  { id: 29, name: "Joel", nameFrench: "Joël", abbreviation: "Joel", chapters: 3, testament: "old" },
  { id: 30, name: "Amos", nameFrench: "Amos", abbreviation: "Amos", chapters: 9, testament: "old" },
  { id: 31, name: "Obadiah", nameFrench: "Abdias", abbreviation: "Obad", chapters: 1, testament: "old" },
  { id: 32, name: "Jonah", nameFrench: "Jonas", abbreviation: "Jonah", chapters: 4, testament: "old" },
  { id: 33, name: "Micah", nameFrench: "Michée", abbreviation: "Mic", chapters: 7, testament: "old" },
  { id: 34, name: "Nahum", nameFrench: "Nahum", abbreviation: "Nah", chapters: 3, testament: "old" },
  { id: 35, name: "Habakkuk", nameFrench: "Habacuc", abbreviation: "Hab", chapters: 3, testament: "old" },
  { id: 36, name: "Zephaniah", nameFrench: "Sophonie", abbreviation: "Zeph", chapters: 3, testament: "old" },
  { id: 37, name: "Haggai", nameFrench: "Aggée", abbreviation: "Hag", chapters: 2, testament: "old" },
  { id: 38, name: "Zechariah", nameFrench: "Zacharie", abbreviation: "Zech", chapters: 14, testament: "old" },
  { id: 39, name: "Malachi", nameFrench: "Malachie", abbreviation: "Mal", chapters: 4, testament: "old" },
  { id: 40, name: "Matthew", nameFrench: "Matthieu", abbreviation: "Matt", chapters: 28, testament: "new" },
  { id: 41, name: "Mark", nameFrench: "Marc", abbreviation: "Mark", chapters: 16, testament: "new" },
  { id: 42, name: "Luke", nameFrench: "Luc", abbreviation: "Luke", chapters: 24, testament: "new" },
  { id: 43, name: "John", nameFrench: "Jean", abbreviation: "John", chapters: 21, testament: "new" },
  { id: 44, name: "Acts", nameFrench: "Actes", abbreviation: "Acts", chapters: 28, testament: "new" },
  { id: 45, name: "Romans", nameFrench: "Romains", abbreviation: "Rom", chapters: 16, testament: "new" },
  { id: 46, name: "1 Corinthians", nameFrench: "1 Corinthiens", abbreviation: "1Cor", chapters: 16, testament: "new" },
  { id: 47, name: "2 Corinthians", nameFrench: "2 Corinthiens", abbreviation: "2Cor", chapters: 13, testament: "new" },
  { id: 48, name: "Galatians", nameFrench: "Galates", abbreviation: "Gal", chapters: 6, testament: "new" },
  { id: 49, name: "Ephesians", nameFrench: "Éphésiens", abbreviation: "Eph", chapters: 6, testament: "new" },
  { id: 50, name: "Philippians", nameFrench: "Philippiens", abbreviation: "Phil", chapters: 4, testament: "new" },
  { id: 51, name: "Colossians", nameFrench: "Colossiens", abbreviation: "Col", chapters: 4, testament: "new" },
  { id: 52, name: "1 Thessalonians", nameFrench: "1 Thessaloniciens", abbreviation: "1Thess", chapters: 5, testament: "new" },
  { id: 53, name: "2 Thessalonians", nameFrench: "2 Thessaloniciens", abbreviation: "2Thess", chapters: 3, testament: "new" },
  { id: 54, name: "1 Timothy", nameFrench: "1 Timothée", abbreviation: "1Tim", chapters: 6, testament: "new" },
  { id: 55, name: "2 Timothy", nameFrench: "2 Timothée", abbreviation: "2Tim", chapters: 4, testament: "new" },
  { id: 56, name: "Titus", nameFrench: "Tite", abbreviation: "Titus", chapters: 3, testament: "new" },
  { id: 57, name: "Philemon", nameFrench: "Philémon", abbreviation: "Phlm", chapters: 1, testament: "new" },
  { id: 58, name: "Hebrews", nameFrench: "Hébreux", abbreviation: "Heb", chapters: 13, testament: "new" },
  { id: 59, name: "James", nameFrench: "Jacques", abbreviation: "Jas", chapters: 5, testament: "new" },
  { id: 60, name: "1 Peter", nameFrench: "1 Pierre", abbreviation: "1Pet", chapters: 5, testament: "new" },
  { id: 61, name: "2 Peter", nameFrench: "2 Pierre", abbreviation: "2Pet", chapters: 3, testament: "new" },
  { id: 62, name: "1 John", nameFrench: "1 Jean", abbreviation: "1John", chapters: 5, testament: "new" },
  { id: 63, name: "2 John", nameFrench: "2 Jean", abbreviation: "2John", chapters: 1, testament: "new" },
  { id: 64, name: "3 John", nameFrench: "3 Jean", abbreviation: "3John", chapters: 1, testament: "new" },
  { id: 65, name: "Jude", nameFrench: "Jude", abbreviation: "Jude", chapters: 1, testament: "new" },
  { id: 66, name: "Revelation", nameFrench: "Apocalypse", abbreviation: "Rev", chapters: 22, testament: "new" },
];

export function getOldTestamentBooks(): BibleBook[] {
  return bibleBooks.filter((book) => book.testament === "old");
}

export function getNewTestamentBooks(): BibleBook[] {
  return bibleBooks.filter((book) => book.testament === "new");
}

export function getBookById(id: number): BibleBook | undefined {
  return bibleBooks.find((book) => book.id === id);
}

export function getAvailableVersions(): BibleVersion[] {
  return bibleVersions.filter((v) => v.available);
}
