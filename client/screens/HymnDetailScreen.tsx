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

  const [showKreyol, setShowKreyol] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    isHymnFavorite(hymnId).then(setIsFavorite);
  }, [hymnId]);

  useEffect(() => {
    if (hymn) {
      navigation.setOptions({
        headerTitle: `${hymn.number}. ${hymn.title}`,
        headerRight: () => (
          <Pressable onPress={handleToggleFavorite} style={styles.headerButton}>
            <Feather
              name={isFavorite ? "heart" : "heart"}
              size={22}
              color={isFavorite ? theme.favorite : theme.text}
              style={{ opacity: isFavorite ? 1 : 0.6 }}
            />
          </Pressable>
        ),
      });
    }
  }, [hymn, navigation, isFavorite, theme]);

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

  const handleShare = useCallback(async () => {
    if (!hymn) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const lyrics = hymn.verses
      .map((v) => {
        const text = showKreyol && v.textKreyol ? v.textKreyol : v.text;
        return `${v.number}. ${text}`;
      })
      .join("\n\n");

    const chorus = hymn.chorus
      ? `\nRefrain:\n${showKreyol && hymn.chorus.textKreyol ? hymn.chorus.textKreyol : hymn.chorus.text}`
      : "";

    const title = showKreyol && hymn.titleKreyol ? hymn.titleKreyol : hymn.title;

    await Share.share({
      message: `${hymn.number}. ${title}\n${hymn.section}\n\n${lyrics}${chorus}\n\n— Chants d'Espérance`,
    });
  }, [hymn, showKreyol]);

  if (!hymn) {
    return (
      <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
        <ThemedText>Cantique non trouvé</ThemedText>
      </View>
    );
  }

  const hasKreyol = hymn.language === "both";

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
      {hasKreyol ? (
        <Animated.View
          entering={FadeInDown.delay(100).duration(300)}
          style={[styles.languageToggle, { backgroundColor: theme.backgroundDefault }]}
        >
          <Pressable
            style={[
              styles.languageButton,
              !showKreyol && { backgroundColor: theme.accent },
            ]}
            onPress={() => {
              setShowKreyol(false);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <ThemedText
              style={[
                styles.languageButtonText,
                { color: !showKreyol ? "#FFFFFF" : theme.text },
              ]}
            >
              Français
            </ThemedText>
          </Pressable>
          <Pressable
            style={[
              styles.languageButton,
              showKreyol && { backgroundColor: theme.accent },
            ]}
            onPress={() => {
              setShowKreyol(true);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <ThemedText
              style={[
                styles.languageButtonText,
                { color: showKreyol ? "#FFFFFF" : theme.text },
              ]}
            >
              Kreyòl
            </ThemedText>
          </Pressable>
        </Animated.View>
      ) : null}

      <Animated.View entering={FadeInDown.delay(200).duration(300)}>
        <ThemedText style={[styles.sectionLabel, { color: theme.textSecondary }]}>
          {hymn.section}
        </ThemedText>
      </Animated.View>

      {hymn.verses.map((verse, index) => (
        <Animated.View
          key={verse.number}
          entering={FadeInDown.delay(300 + index * 100).duration(300)}
          style={styles.verseContainer}
        >
          <View style={[styles.verseNumber, { backgroundColor: theme.accent }]}>
            <ThemedText style={styles.verseNumberText}>{verse.number}</ThemedText>
          </View>
          <ThemedText style={styles.verseText}>
            {showKreyol && verse.textKreyol ? verse.textKreyol : verse.text}
          </ThemedText>
        </Animated.View>
      ))}

      {hymn.chorus ? (
        <Animated.View
          entering={FadeInDown.delay(300 + hymn.verses.length * 100).duration(300)}
          style={[styles.chorusContainer, { backgroundColor: theme.backgroundDefault, borderColor: theme.accent }]}
        >
          <ThemedText style={[styles.chorusLabel, { color: theme.accent }]}>
            REFRAIN
          </ThemedText>
          <ThemedText style={styles.chorusText}>
            {showKreyol && hymn.chorus.textKreyol
              ? hymn.chorus.textKreyol
              : hymn.chorus.text}
          </ThemedText>
        </Animated.View>
      ) : null}

      <Animated.View
        entering={FadeInDown.delay(400 + hymn.verses.length * 100).duration(300)}
        style={styles.actionsContainer}
      >
        <Pressable
          style={[styles.actionButton, { backgroundColor: theme.backgroundDefault, borderColor: theme.border }]}
          onPress={handleShare}
        >
          <Feather name="share" size={20} color={theme.text} />
          <ThemedText style={styles.actionButtonText}>Partager</ThemedText>
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
  languageToggle: {
    flexDirection: "row",
    borderRadius: BorderRadius.sm,
    padding: Spacing.xs,
    marginBottom: Spacing.xl,
  },
  languageButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: "center",
    borderRadius: BorderRadius.xs,
  },
  languageButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: Spacing.xl,
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
