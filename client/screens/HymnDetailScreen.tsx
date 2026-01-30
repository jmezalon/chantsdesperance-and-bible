import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  ScrollView,
  Pressable,
  StyleSheet,
  Share,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { getHymnById, Hymn } from "@/data/hymns";
import { isHymnFavorite, addFavoriteHymn, removeFavoriteHymn } from "@/lib/storage";
import { HymnsStackParamList } from "@/navigation/HymnsStackNavigator";

type RouteProps = RouteProp<HymnsStackParamList, "HymnDetail">;

export default function HymnDetailScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const route = useRoute<RouteProps>();
  const navigation = useNavigation();

  const { hymnId } = route.params;
  const hymn = getHymnById(hymnId);

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

    const lyrics = hymn.verses
      .map((v) => `${v.number}. ${v.text}`)
      .join("\n\n");

    const chorus = hymn.chorus
      ? `\nRefrain:\n${hymn.chorus.text}`
      : "";

    const langLabel = hymn.language === "french" ? "Français" : "Kreyòl";

    await Share.share({
      message: `${hymn.number}. ${hymn.title}\n${hymn.section} (${langLabel})\n\n${lyrics}${chorus}\n\n— Chants d'Espérance`,
    });
  }, [hymn]);

  if (!hymn) {
    return (
      <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
        <ThemedText>Cantique non trouvé</ThemedText>
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
          paddingBottom: insets.bottom + Spacing.xl,
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

      {hymn.verses.map((verse, index) => (
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
          entering={FadeInDown.delay(200 + hymn.verses.length * 100).duration(300)}
          style={[styles.chorusContainer, { backgroundColor: theme.backgroundDefault, borderColor: theme.accent }]}
        >
          <ThemedText style={[styles.chorusLabel, { color: theme.accent }]}>
            {hymn.language === "french" ? "REFRAIN" : "REFREN"}
          </ThemedText>
          <ThemedText style={styles.chorusText}>{hymn.chorus.text}</ThemedText>
        </Animated.View>
      ) : null}

      <Animated.View
        entering={FadeInDown.delay(300 + hymn.verses.length * 100).duration(300)}
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
