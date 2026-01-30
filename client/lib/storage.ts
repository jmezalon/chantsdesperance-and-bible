import AsyncStorage from "@react-native-async-storage/async-storage";

const FAVORITES_HYMNS_KEY = "@favorites_hymns";
const FAVORITES_VERSES_KEY = "@favorites_verses";
const SETTINGS_KEY = "@settings";

export interface FavoriteHymn {
  hymnId: string;
  addedAt: number;
}

export interface FavoriteVerse {
  id: string;
  version: string;
  bookId: number;
  bookName: string;
  chapter: number;
  verse: number;
  text: string;
  addedAt: number;
}

export interface AppSettings {
  defaultBibleVersion: string;
  textSize: "small" | "medium" | "large";
  showKreyol: boolean;
}

const defaultSettings: AppSettings = {
  defaultBibleVersion: "NKJV",
  textSize: "medium",
  showKreyol: true,
};

export async function getFavoriteHymns(): Promise<FavoriteHymn[]> {
  try {
    const data = await AsyncStorage.getItem(FAVORITES_HYMNS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export async function addFavoriteHymn(hymnId: string): Promise<void> {
  const favorites = await getFavoriteHymns();
  if (!favorites.find((f) => f.hymnId === hymnId)) {
    favorites.push({ hymnId, addedAt: Date.now() });
    await AsyncStorage.setItem(FAVORITES_HYMNS_KEY, JSON.stringify(favorites));
  }
}

export async function removeFavoriteHymn(hymnId: string): Promise<void> {
  const favorites = await getFavoriteHymns();
  const filtered = favorites.filter((f) => f.hymnId !== hymnId);
  await AsyncStorage.setItem(FAVORITES_HYMNS_KEY, JSON.stringify(filtered));
}

export async function isHymnFavorite(hymnId: string): Promise<boolean> {
  const favorites = await getFavoriteHymns();
  return favorites.some((f) => f.hymnId === hymnId);
}

export async function getFavoriteVerses(): Promise<FavoriteVerse[]> {
  try {
    const data = await AsyncStorage.getItem(FAVORITES_VERSES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export async function addFavoriteVerse(verse: Omit<FavoriteVerse, "addedAt">): Promise<void> {
  const favorites = await getFavoriteVerses();
  if (!favorites.find((f) => f.id === verse.id)) {
    favorites.push({ ...verse, addedAt: Date.now() });
    await AsyncStorage.setItem(FAVORITES_VERSES_KEY, JSON.stringify(favorites));
  }
}

export async function removeFavoriteVerse(verseId: string): Promise<void> {
  const favorites = await getFavoriteVerses();
  const filtered = favorites.filter((f) => f.id !== verseId);
  await AsyncStorage.setItem(FAVORITES_VERSES_KEY, JSON.stringify(filtered));
}

export async function isVerseFavorite(verseId: string): Promise<boolean> {
  const favorites = await getFavoriteVerses();
  return favorites.some((f) => f.id === verseId);
}

export async function getSettings(): Promise<AppSettings> {
  try {
    const data = await AsyncStorage.getItem(SETTINGS_KEY);
    return data ? { ...defaultSettings, ...JSON.parse(data) } : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

export async function updateSettings(settings: Partial<AppSettings>): Promise<void> {
  const current = await getSettings();
  const updated = { ...current, ...settings };
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
}
