import React, { useState, useCallback } from "react";
import {
  View,
  FlatList,
  Pressable,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  FadeIn,
  FadeInDown,
  SlideOutRight,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import {
  getFavoriteHymns,
  getFavoriteVerses,
  removeFavoriteHymn,
  removeFavoriteVerse,
  FavoriteHymn,
  FavoriteVerse,
} from "@/lib/storage";
import { getApiUrl } from "@/lib/query-client";
import { FavoritesStackParamList } from "@/navigation/FavoritesStackNavigator";

type NavigationProp = NativeStackNavigationProp<FavoritesStackParamList>;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type TabType = "hymns" | "verses";

interface HymnFromAPI {
  id: string;
  number: number;
  title: string;
  section: string;
  sectionId: number;
  language: "french" | "kreyol";
}

interface FavoriteHymnWithData extends FavoriteHymn {
  hymnData?: HymnFromAPI;
  isLoading?: boolean;
}

interface HymnItemProps {
  favorite: FavoriteHymnWithData;
  index: number;
  onPress: () => void;
  onRemove: () => void;
}

function HymnFavoriteItem({ favorite, index, onPress, onRemove }: HymnItemProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);
  const hymn = favorite.hymnData;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 150 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
  };

  if (favorite.isLoading) {
    return (
      <Animated.View
        entering={FadeInDown.delay(index * 50).duration(300)}
        style={[
          styles.favoriteItem,
          { backgroundColor: theme.backgroundDefault, borderColor: theme.border },
        ]}
      >
        <ActivityIndicator size="small" color={theme.accent} />
        <View style={styles.itemInfo}>
          <ThemedText style={[styles.itemSubtitle, { color: theme.textSecondary }]}>
            Chargement...
          </ThemedText>
        </View>
      </Animated.View>
    );
  }

  if (!hymn) return null;

  return (
    <AnimatedPressable
      entering={FadeInDown.delay(index * 50).duration(300)}
      exiting={SlideOutRight.duration(200)}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.favoriteItem,
        { backgroundColor: theme.backgroundDefault, borderColor: theme.border },
        animatedStyle,
      ]}
    >
      <View style={[styles.hymnNumber, { backgroundColor: theme.accent }]}>
        <ThemedText style={styles.hymnNumberText}>{hymn.number}</ThemedText>
      </View>
      <View style={styles.itemInfo}>
        <ThemedText style={styles.itemTitle} numberOfLines={1}>
          {hymn.title}
        </ThemedText>
        <View style={styles.itemMeta}>
          <View style={[
            styles.languageBadge, 
            { backgroundColor: hymn.language === "french" ? theme.accent : "#2D5A27" }
          ]}>
            <ThemedText style={styles.languageBadgeText}>
              {hymn.language === "french" ? "FR" : "KR"}
            </ThemedText>
          </View>
          <ThemedText style={[styles.itemSubtitle, { color: theme.textSecondary }]} numberOfLines={1}>
            {hymn.section}
          </ThemedText>
        </View>
      </View>
      <Pressable onPress={onRemove} hitSlop={10}>
        <Feather name="trash-2" size={18} color={theme.textSecondary} />
      </Pressable>
    </AnimatedPressable>
  );
}

interface VerseItemProps {
  verse: FavoriteVerse;
  index: number;
  onPress: () => void;
  onRemove: () => void;
}

function VerseFavoriteItem({ verse, index, onPress, onRemove }: VerseItemProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 150 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
  };

  return (
    <AnimatedPressable
      entering={FadeInDown.delay(index * 50).duration(300)}
      exiting={SlideOutRight.duration(200)}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.verseItem,
        { backgroundColor: theme.backgroundDefault, borderColor: theme.border },
        animatedStyle,
      ]}
    >
      <View style={styles.verseHeader}>
        <View style={[styles.versionBadge, { backgroundColor: theme.accent }]}>
          <ThemedText style={styles.versionBadgeText}>{verse.version}</ThemedText>
        </View>
        <ThemedText style={styles.verseReference}>
          {verse.bookName} {verse.chapter}:{verse.verse}
        </ThemedText>
        <Pressable onPress={onRemove} hitSlop={10}>
          <Feather name="trash-2" size={18} color={theme.textSecondary} />
        </Pressable>
      </View>
      <ThemedText style={[styles.verseText, { color: theme.text }]} numberOfLines={3}>
        "{verse.text}"
      </ThemedText>
    </AnimatedPressable>
  );
}

function EmptyState({ type }: { type: TabType }) {
  const { theme } = useTheme();

  return (
    <Animated.View entering={FadeIn.duration(300)} style={styles.emptyState}>
      <Image
        source={require("../../assets/images/empty-favorites.png")}
        style={styles.emptyImage}
        resizeMode="contain"
      />
      <ThemedText style={styles.emptyTitle}>
        {type === "hymns" ? "Pas de cantiques favoris" : "Pas de versets favoris"}
      </ThemedText>
      <ThemedText style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
        {type === "hymns"
          ? "Appuyez sur le coeur pour sauvegarder vos cantiques préférés"
          : "Appuyez sur un verset pour le sauvegarder"}
      </ThemedText>
    </Animated.View>
  );
}

export default function FavoritesScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const [activeTab, setActiveTab] = useState<TabType>("hymns");
  const [favoriteHymns, setFavoriteHymns] = useState<FavoriteHymnWithData[]>([]);
  const [favoriteVerses, setFavoriteVerses] = useState<FavoriteVerse[]>([]);

  const loadFavorites = useCallback(async () => {
    const [hymns, verses] = await Promise.all([
      getFavoriteHymns(),
      getFavoriteVerses(),
    ]);

    // Set hymns with loading state initially
    const hymnsWithLoading: FavoriteHymnWithData[] = hymns.map(h => ({
      ...h,
      isLoading: true,
    }));
    setFavoriteHymns(hymnsWithLoading);
    setFavoriteVerses(verses);

    // Fetch hymn details from API for each favorite
    const apiUrl = getApiUrl();
    const updatedHymns: FavoriteHymnWithData[] = [];

    for (const favorite of hymns) {
      try {
        const response = await fetch(`${apiUrl}api/hymns/${favorite.hymnId}`);
        if (response.ok) {
          const hymnData: HymnFromAPI = await response.json();
          updatedHymns.push({ ...favorite, hymnData, isLoading: false });
        }
        // If not ok (hymn deleted), skip it
      } catch {
        // On error, skip this hymn
      }
    }

    setFavoriteHymns(updatedHymns);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [loadFavorites])
  );

  const handleRemoveHymn = useCallback(async (hymnId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await removeFavoriteHymn(hymnId);
    setFavoriteHymns((prev) => prev.filter((f) => f.hymnId !== hymnId));
  }, []);

  const handleRemoveVerse = useCallback(async (verseId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await removeFavoriteVerse(verseId);
    setFavoriteVerses((prev) => prev.filter((f) => f.id !== verseId));
  }, []);

  const handleHymnPress = useCallback(
    (hymnId: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      navigation.navigate("FavoriteHymnDetail", { hymnId });
    },
    [navigation]
  );

  const handleVersePress = useCallback(
    (verse: FavoriteVerse) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      navigation.navigate("FavoriteBibleReader", {
        bookId: verse.bookId,
        bookName: verse.bookName,
        chapter: verse.chapter,
        version: verse.version,
      });
    },
    [navigation]
  );

  const renderHymnItem = useCallback(
    ({ item, index }: { item: FavoriteHymnWithData; index: number }) => (
      <HymnFavoriteItem
        favorite={item}
        index={index}
        onPress={() => handleHymnPress(item.hymnId)}
        onRemove={() => handleRemoveHymn(item.hymnId)}
      />
    ),
    [handleHymnPress, handleRemoveHymn]
  );

  const renderVerseItem = useCallback(
    ({ item, index }: { item: FavoriteVerse; index: number }) => (
      <VerseFavoriteItem
        verse={item}
        index={index}
        onPress={() => handleVersePress(item)}
        onRemove={() => handleRemoveVerse(item.id)}
      />
    ),
    [handleVersePress, handleRemoveVerse]
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <View
        style={[
          styles.tabContainer,
          {
            paddingTop: headerHeight + Spacing.md,
            backgroundColor: theme.backgroundRoot,
          },
        ]}
      >
        <View style={[styles.tabBar, { backgroundColor: theme.backgroundDefault }]}>
          <Pressable
            style={[
              styles.tabButton,
              activeTab === "hymns" && { backgroundColor: theme.accent },
            ]}
            onPress={() => {
              setActiveTab("hymns");
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <ThemedText
              style={[
                styles.tabButtonText,
                { color: activeTab === "hymns" ? "#FFFFFF" : theme.text },
              ]}
            >
              Cantiques
            </ThemedText>
          </Pressable>
          <Pressable
            style={[
              styles.tabButton,
              activeTab === "verses" && { backgroundColor: theme.accent },
            ]}
            onPress={() => {
              setActiveTab("verses");
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <ThemedText
              style={[
                styles.tabButtonText,
                { color: activeTab === "verses" ? "#FFFFFF" : theme.text },
              ]}
            >
              Versets
            </ThemedText>
          </Pressable>
        </View>
      </View>

      {activeTab === "hymns" ? (
        <FlatList
          data={favoriteHymns}
          keyExtractor={(item) => item.hymnId}
          renderItem={renderHymnItem}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: tabBarHeight + Spacing.xl },
            favoriteHymns.length === 0 && styles.emptyListContent,
          ]}
          scrollIndicatorInsets={{ bottom: insets.bottom }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<EmptyState type="hymns" />}
        />
      ) : (
        <FlatList
          data={favoriteVerses}
          keyExtractor={(item) => item.id}
          renderItem={renderVerseItem}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: tabBarHeight + Spacing.xl },
            favoriteVerses.length === 0 && styles.emptyListContent,
          ]}
          scrollIndicatorInsets={{ bottom: insets.bottom }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<EmptyState type="verses" />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  tabBar: {
    flexDirection: "row",
    borderRadius: BorderRadius.sm,
    padding: Spacing.xs,
  },
  tabButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: "center",
    borderRadius: BorderRadius.xs,
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  emptyListContent: {
    flex: 1,
    justifyContent: "center",
  },
  favoriteItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    gap: Spacing.md,
  },
  hymnNumber: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  hymnNumberText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  itemInfo: {
    flex: 1,
    gap: 4,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  itemMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  languageBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
  },
  languageBadgeText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  itemSubtitle: {
    fontSize: 12,
    flex: 1,
  },
  verseItem: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  verseHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  versionBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.xs,
  },
  versionBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  verseReference: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
  },
  verseText: {
    fontSize: 15,
    lineHeight: 22,
    fontStyle: "italic",
  },
  emptyState: {
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
  },
  emptyImage: {
    width: 120,
    height: 120,
    marginBottom: Spacing.xl,
    opacity: 0.8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: Spacing.sm,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});
