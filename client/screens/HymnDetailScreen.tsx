import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  ScrollView,
  Pressable,
  StyleSheet,
  Share,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useQuery } from "@tanstack/react-query";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { isHymnFavorite, addFavoriteHymn, removeFavoriteHymn } from "@/lib/storage";
import { HymnsStackParamList } from "@/navigation/HymnsStackNavigator";
import { getApiUrl } from "@/lib/query-client";

type RouteProps = RouteProp<HymnsStackParamList, "HymnDetail">;

interface HymnFromAPI {
  id: string;
  number: number;
  title: string;
  section: string;
  sectionId: number;
  language: "french" | "kreyol";
  verses: string;
  chorus: string | null;
}

interface ParsedVerse {
  number: number;
  text: string;
}

// Parse verses text into structured format
function parseVerses(versesText: string): ParsedVerse[] {
  const verses: ParsedVerse[] = [];
  const parts = versesText.split(/Verse \d+:/i).filter(Boolean);

  parts.forEach((part, index) => {
    verses.push({
      number: index + 1,
      text: part.trim(),
    });
  });

  return verses;
}

export default function HymnDetailScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const route = useRoute<RouteProps>();
  const navigation = useNavigation();

  const { hymnId } = route.params;

  // Fetch hymn from API
  const { data: hymn, isLoading, error } = useQuery<HymnFromAPI>({
    queryKey: ["hymn", hymnId],
    queryFn: async () => {
      const response = await fetch(`${getApiUrl()}api/hymns/${hymnId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch hymn");
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Parse verses and chorus
  const parsedVerses = useMemo(() => {
    if (!hymn) return [];
    return parseVerses(hymn.verses);
  }, [hymn]);

  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    isHymnFavorite(hymnId).then(setIsFavorite);
  }, [hymnId]);

  const handleToggleFavorite = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (isFavorite) {
      await removeFavoriteHymn(hymnId);
      setIsFavorite(false);
    } else {
      await addFavoriteHymn(hymnId);
      setIsFavorite(true);
    }
  }, [hymnId, isFavorite]);

  useEffect(() => {
    if (hymn) {
      navigation.setOptions({
        headerTitle: `${hymn.number}. ${hymn.title}`,
        headerRight: () => (
          <Pressable onPress={handleToggleFavorite} style={styles.headerButton}>
            <Feather
              name="heart"
              size={22}
              color={isFavorite ? theme.favorite : theme.text}
              style={{ opacity: isFavorite ? 1 : 0.6 }}
            />
          </Pressable>
        ),
      });
    }
  }, [hymn, navigation, isFavorite, theme, handleToggleFavorite]);

  const handleShare = useCallback(async () => {
    if (!hymn) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const lyrics = parsedVerses
      .map((v) => `${v.number}. ${v.text}`)
      .join("\n\n");

    const chorusText = hymn.chorus
      ? `\nRefrain:\n${hymn.chorus}`
      : "";

    const langLabel = hymn.language === "french" ? "Français" : "Kreyòl";

    await Share.share({
      message: `${hymn.number}. ${hymn.title}\n${hymn.section} (${langLabel})\n\n${lyrics}${chorusText}\n\n— Chants d'Espérance`,
    });
  }, [hymn, parsedVerses]);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.backgroundRoot }]}>
        <ActivityIndicator size="large" color={theme.accent} />
        <ThemedText style={{ marginTop: Spacing.md }}>Loading...</ThemedText>
      </View>
    );
  }

  if (error || !hymn) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.backgroundRoot }]}>
        <Feather name="alert-circle" size={48} color={theme.textSecondary} />
        <ThemedText style={{ marginTop: Spacing.md }}>Cantique non trouvé</ThemedText>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: headerHeight + Spacing.lg,
          paddingBottom: tabBarHeight + Spacing.xl,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View entering={FadeInDown.delay(100).duration(300)} style={styles.headerInfo}>
        <View style={[
          styles.languageBadge, 
          { backgroundColor: hymn.language === "french" ? theme.accent : "#2D5A27" }
        ]}>
          <ThemedText style={styles.languageBadgeText}>
            {hymn.language === "french" ? "Français" : "Kreyòl"}
          </ThemedText>
        </View>
        <ThemedText style={[styles.sectionLabel, { color: theme.textSecondary }]}>
          {hymn.section}
        </ThemedText>
      </Animated.View>

      {parsedVerses.map((verse, index) => (
        <Animated.View
          key={verse.number}
          entering={FadeInDown.delay(200 + index * 100).duration(300)}
          style={styles.verseContainer}
        >
          <View style={[styles.verseNumber, { backgroundColor: theme.accent }]}>
            <ThemedText style={styles.verseNumberText}>{verse.number}</ThemedText>
          </View>
          <ThemedText style={styles.verseText}>{verse.text}</ThemedText>
        </Animated.View>
      ))}

      {hymn.chorus ? (
        <Animated.View
          entering={FadeInDown.delay(200 + parsedVerses.length * 100).duration(300)}
          style={[styles.chorusContainer, { backgroundColor: theme.backgroundDefault, borderColor: theme.accent }]}
        >
          <ThemedText style={[styles.chorusLabel, { color: theme.accent }]}>
            {hymn.language === "french" ? "REFRAIN" : "REFREN"}
          </ThemedText>
          <ThemedText style={styles.chorusText}>{hymn.chorus}</ThemedText>
        </Animated.View>
      ) : null}

      <Animated.View
        entering={FadeInDown.delay(300 + parsedVerses.length * 100).duration(300)}
        style={styles.actionsContainer}
      >
        <Pressable
          style={[styles.actionButton, { backgroundColor: theme.backgroundDefault, borderColor: theme.border }]}
          onPress={handleShare}
        >
          <Feather name="share" size={20} color={theme.text} />
          <ThemedText style={styles.actionButtonText}>
            {hymn.language === "french" ? "Partager" : "Pataje"}
          </ThemedText>
        </Pressable>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    paddingHorizontal: Spacing.lg,
  },
  headerButton: {
    padding: Spacing.sm,
  },
  headerInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  languageBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.xs,
  },
  languageBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "500",
    flex: 1,
  },
  verseContainer: {
    flexDirection: "row",
    marginBottom: Spacing.xl,
    gap: Spacing.md,
  },
  verseNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  verseNumberText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  verseText: {
    flex: 1,
    fontSize: 18,
    lineHeight: 28,
  },
  chorusContainer: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.sm,
    borderLeftWidth: 4,
    marginBottom: Spacing.xl,
  },
  chorusLabel: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  chorusText: {
    fontSize: 18,
    lineHeight: 28,
    fontStyle: "italic",
  },
  actionsContainer: {
    flexDirection: "row",
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
