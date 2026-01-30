import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  ScrollView,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Share,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { useQuery } from "@tanstack/react-query";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { getBookById, bibleVersions } from "@/data/bible";
import { addFavoriteVerse, isVerseFavorite } from "@/lib/storage";
import { BibleStackParamList } from "@/navigation/BibleStackNavigator";
import { getApiUrl } from "@/lib/query-client";

type RouteProps = RouteProp<BibleStackParamList, "BibleReader">;

interface Verse {
  pk: number;
  verse: number;
  text: string;
}

interface ChapterPickerProps {
  totalChapters: number;
  currentChapter: number;
  onSelect: (chapter: number) => void;
  visible: boolean;
  onClose: () => void;
  bottomInset: number;
}

function ChapterPicker({
  totalChapters,
  currentChapter,
  onSelect,
  visible,
  onClose,
  bottomInset,
}: ChapterPickerProps) {
  const { theme } = useTheme();

  if (!visible) return null;

  const chapters = Array.from({ length: totalChapters }, (_, i) => i + 1);
  
  // Calculate minimum height to ensure chapters are visible above tab bar
  // Tab bar is approximately 80px, plus extra padding for safe area
  const minContentHeight = Math.max(200, 120 + bottomInset + 80);

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      style={[styles.pickerOverlay, { backgroundColor: "rgba(0,0,0,0.5)" }]}
    >
      <Pressable style={styles.pickerBackdrop} onPress={onClose} />
      <Animated.View
        entering={FadeInDown.duration(300)}
        style={[
          styles.pickerContent, 
          { 
            backgroundColor: theme.backgroundRoot,
            paddingBottom: bottomInset + 100,
            minHeight: minContentHeight,
          }
        ]}
      >
        <View style={styles.pickerHeader}>
          <ThemedText style={styles.pickerTitle}>Select Chapter</ThemedText>
          <Pressable onPress={onClose}>
            <Feather name="x" size={24} color={theme.text} />
          </Pressable>
        </View>
        <ScrollView
          contentContainerStyle={styles.pickerGrid}
          showsVerticalScrollIndicator={false}
        >
          {chapters.map((chapter) => (
            <Pressable
              key={chapter}
              onPress={() => {
                onSelect(chapter);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              style={[
                styles.chapterButton,
                {
                  backgroundColor:
                    chapter === currentChapter
                      ? theme.accent
                      : theme.backgroundDefault,
                  borderColor: theme.border,
                },
              ]}
            >
              <ThemedText
                style={[
                  styles.chapterButtonText,
                  { color: chapter === currentChapter ? "#FFFFFF" : theme.text },
                ]}
              >
                {chapter}
              </ThemedText>
            </Pressable>
          ))}
        </ScrollView>
      </Animated.View>
    </Animated.View>
  );
}

export default function BibleReaderScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const route = useRoute<RouteProps>();
  const navigation = useNavigation();

  const { bookId, bookName, chapter: initialChapter, version: initialVersion } = route.params;
  const book = getBookById(bookId);

  const [chapter, setChapter] = useState(initialChapter);
  const [version, setVersion] = useState(initialVersion);
  const [showChapterPicker, setShowChapterPicker] = useState(false);
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null);

  const { data: verses, isLoading, error, refetch } = useQuery<Verse[]>({
    queryKey: ["/api/bible", version, bookId, chapter],
    staleTime: 1000 * 60 * 60,
  });

  useEffect(() => {
    navigation.setOptions({
      headerTitle: `${bookName} ${chapter}`,
    });
  }, [navigation, bookName, chapter]);

  const handleChapterChange = useCallback((newChapter: number) => {
    setChapter(newChapter);
    setShowChapterPicker(false);
    setSelectedVerse(null);
  }, []);

  const handleVersionChange = useCallback((newVersion: string) => {
    setVersion(newVersion);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const handlePreviousChapter = useCallback(() => {
    if (chapter > 1) {
      setChapter(chapter - 1);
      setSelectedVerse(null);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [chapter]);

  const handleNextChapter = useCallback(() => {
    if (book && chapter < book.chapters) {
      setChapter(chapter + 1);
      setSelectedVerse(null);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [chapter, book]);

  const handleVersePress = useCallback((verseNum: number) => {
    setSelectedVerse(selectedVerse === verseNum ? null : verseNum);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [selectedVerse]);

  const handleShareVerse = useCallback(async (verse: Verse) => {
    const versionName = bibleVersions.find(v => v.id === version)?.abbreviation || version;
    const cleanText = verse.text.replace(/<[^>]*>/g, '');
    await Share.share({
      message: `${bookName} ${chapter}:${verse.verse} (${versionName})\n\n"${cleanText}"`,
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [bookName, chapter, version]);

  const handleSaveVerse = useCallback(async (verse: Verse) => {
    const cleanText = verse.text.replace(/<[^>]*>/g, '');
    await addFavoriteVerse({
      id: `${version}-${bookId}-${chapter}-${verse.verse}`,
      version,
      bookId,
      bookName,
      chapter,
      verse: verse.verse,
      text: cleanText,
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSelectedVerse(null);
  }, [version, bookId, bookName, chapter]);

  if (!book) {
    return (
      <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
        <ThemedText>Book not found</ThemedText>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: headerHeight + Spacing.lg,
            paddingBottom: insets.bottom + 80,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.delay(100).duration(300)}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.versionScrollView}
            contentContainerStyle={styles.versionContainer}
          >
            {bibleVersions.filter(v => v.available).map((v) => (
              <Pressable
                key={v.id}
                onPress={() => handleVersionChange(v.id)}
                style={[
                  styles.versionButton,
                  {
                    backgroundColor: version === v.id ? theme.accent : theme.backgroundDefault,
                    borderColor: theme.border,
                  },
                ]}
              >
                <ThemedText
                  style={[
                    styles.versionButtonText,
                    { color: version === v.id ? "#FFFFFF" : theme.text },
                  ]}
                >
                  {v.abbreviation}
                </ThemedText>
              </Pressable>
            ))}
          </ScrollView>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(150).duration(300)}>
          <Pressable
            style={[styles.chapterSelector, { backgroundColor: theme.backgroundDefault, borderColor: theme.border }]}
            onPress={() => {
              setShowChapterPicker(true);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <ThemedText style={styles.chapterSelectorText}>
              Chapter {chapter} of {book.chapters}
            </ThemedText>
            <Feather name="chevron-down" size={20} color={theme.text} />
          </Pressable>
        </Animated.View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.accent} />
            <ThemedText style={[styles.loadingText, { color: theme.textSecondary }]}>
              Loading scripture...
            </ThemedText>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Feather name="alert-circle" size={48} color={theme.textSecondary} />
            <ThemedText style={styles.errorText}>Failed to load chapter</ThemedText>
            <Pressable
              style={[styles.retryButton, { backgroundColor: theme.accent }]}
              onPress={() => refetch()}
            >
              <ThemedText style={styles.retryButtonText}>Retry</ThemedText>
            </Pressable>
          </View>
        ) : verses && verses.length > 0 ? (
          <View style={styles.versesContainer}>
            {verses.map((verse, index) => {
              const cleanText = verse.text.replace(/<[^>]*>/g, '');
              const isSelected = selectedVerse === verse.verse;

              return (
                <Animated.View
                  key={verse.pk}
                  entering={FadeInDown.delay(200 + index * 30).duration(300)}
                >
                  <Pressable
                    onPress={() => handleVersePress(verse.verse)}
                    style={[
                      styles.verseItem,
                      isSelected && { backgroundColor: theme.backgroundDefault, borderRadius: BorderRadius.sm },
                    ]}
                  >
                    <ThemedText style={[styles.verseNumber, { color: theme.accent }]}>
                      {verse.verse}
                    </ThemedText>
                    <ThemedText style={styles.verseText}>{cleanText}</ThemedText>
                  </Pressable>
                  {isSelected ? (
                    <Animated.View
                      entering={FadeIn.duration(200)}
                      style={styles.verseActions}
                    >
                      <Pressable
                        style={[styles.verseActionButton, { backgroundColor: theme.backgroundSecondary }]}
                        onPress={() => handleShareVerse(verse)}
                      >
                        <Feather name="share" size={16} color={theme.text} />
                        <ThemedText style={styles.verseActionText}>Share</ThemedText>
                      </Pressable>
                      <Pressable
                        style={[styles.verseActionButton, { backgroundColor: theme.backgroundSecondary }]}
                        onPress={() => handleSaveVerse(verse)}
                      >
                        <Feather name="bookmark" size={16} color={theme.text} />
                        <ThemedText style={styles.verseActionText}>Save</ThemedText>
                      </Pressable>
                    </Animated.View>
                  ) : null}
                </Animated.View>
              );
            })}
          </View>
        ) : null}
      </ScrollView>

      <View style={[styles.navigationBar, { backgroundColor: theme.backgroundRoot, paddingBottom: insets.bottom + Spacing.sm }]}>
        <Pressable
          style={[
            styles.navButton,
            { backgroundColor: theme.backgroundDefault, borderColor: theme.border },
            chapter <= 1 && { opacity: 0.5 },
          ]}
          onPress={handlePreviousChapter}
          disabled={chapter <= 1}
        >
          <Feather name="chevron-left" size={20} color={theme.text} />
          <ThemedText style={styles.navButtonText}>Previous</ThemedText>
        </Pressable>

        <Pressable
          style={[
            styles.navButton,
            { backgroundColor: theme.backgroundDefault, borderColor: theme.border },
            chapter >= book.chapters && { opacity: 0.5 },
          ]}
          onPress={handleNextChapter}
          disabled={chapter >= book.chapters}
        >
          <ThemedText style={styles.navButtonText}>Next</ThemedText>
          <Feather name="chevron-right" size={20} color={theme.text} />
        </Pressable>
      </View>

      <ChapterPicker
        totalChapters={book.chapters}
        currentChapter={chapter}
        onSelect={handleChapterChange}
        visible={showChapterPicker}
        onClose={() => setShowChapterPicker(false)}
        bottomInset={insets.bottom}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
  },
  versionScrollView: {
    marginBottom: Spacing.lg,
  },
  versionContainer: {
    gap: Spacing.sm,
  },
  versionButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  versionButtonText: {
    fontSize: 12,
    fontWeight: "600",
  },
  chapterSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    marginBottom: Spacing.xl,
  },
  chapterSelectorText: {
    fontSize: 14,
    fontWeight: "600",
  },
  loadingContainer: {
    alignItems: "center",
    paddingTop: Spacing["5xl"],
  },
  loadingText: {
    marginTop: Spacing.lg,
    fontSize: 14,
  },
  errorContainer: {
    alignItems: "center",
    paddingTop: Spacing["5xl"],
  },
  errorText: {
    marginTop: Spacing.lg,
    fontSize: 16,
    fontWeight: "600",
  },
  retryButton: {
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  versesContainer: {
    gap: Spacing.xs,
  },
  verseItem: {
    flexDirection: "row",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  verseNumber: {
    fontSize: 12,
    fontWeight: "700",
    marginRight: Spacing.sm,
    marginTop: 4,
    minWidth: 20,
  },
  verseText: {
    flex: 1,
    fontSize: 18,
    lineHeight: 28,
  },
  verseActions: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginLeft: 28,
    marginBottom: Spacing.md,
  },
  verseActionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xs,
    gap: Spacing.xs,
  },
  verseActionText: {
    fontSize: 12,
    fontWeight: "600",
  },
  navigationBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    gap: Spacing.md,
  },
  navButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    gap: Spacing.xs,
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  pickerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "flex-end",
  },
  pickerBackdrop: {
    flex: 1,
  },
  pickerContent: {
    maxHeight: "60%",
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  pickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  pickerGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    paddingBottom: Spacing.xl,
  },
  chapterButton: {
    width: 52,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  chapterButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
