import { Platform } from "react-native";

// Warm sepia palette for the Hymnal and Bible app
const primaryColor = "#8B5E3C"; // Heritage brown
const accentColor = "#C17F3E"; // Bronze gold
const favoriteColor = "#D4A373"; // Warm gold

export const Colors = {
  light: {
    text: "#2C1810", // Deep brown - high contrast
    textSecondary: "#6B5040", // Medium brown
    buttonText: "#FFFFFF",
    tabIconDefault: "#6B5040",
    tabIconSelected: primaryColor,
    link: primaryColor,
    accent: accentColor,
    favorite: favoriteColor,
    backgroundRoot: "#FFFBF5", // Cream white - aged paper
    backgroundDefault: "#F5EFE6", // Light parchment - cards
    backgroundSecondary: "#EDE5DA", // Slightly darker parchment
    backgroundTertiary: "#E5DCD0", // Even darker parchment
    border: "#E0D5C7", // Subtle beige
    searchBackground: "#F5EFE6",
    verseNumber: accentColor,
  },
  dark: {
    text: "#F5EFE6", // Light parchment
    textSecondary: "#C7BAA9", // Muted parchment
    buttonText: "#FFFFFF",
    tabIconDefault: "#9B8A79",
    tabIconSelected: accentColor,
    link: accentColor,
    accent: accentColor,
    favorite: favoriteColor,
    backgroundRoot: "#1A1512", // Dark brown
    backgroundDefault: "#252019", // Slightly lighter
    backgroundSecondary: "#302820", // Card background
    backgroundTertiary: "#3B3028", // Elevated cards
    border: "#4A3F34", // Dark border
    searchBackground: "#302820",
    verseNumber: accentColor,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
  inputHeight: 48,
  buttonHeight: 52,
};

export const BorderRadius = {
  xs: 8,
  sm: 12,
  md: 18,
  lg: 24,
  xl: 30,
  "2xl": 40,
  "3xl": 50,
  full: 9999,
};

export const Typography = {
  h1: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "700" as const,
  },
  h2: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "700" as const,
  },
  h3: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "600" as const,
  },
  h4: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "600" as const,
  },
  body: {
    fontSize: 17,
    lineHeight: 26,
    fontWeight: "400" as const,
  },
  bodyLarge: {
    fontSize: 19,
    lineHeight: 30,
    fontWeight: "400" as const,
  },
  small: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400" as const,
  },
  caption: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "400" as const,
    letterSpacing: 1,
  },
  link: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400" as const,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
