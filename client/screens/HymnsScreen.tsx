import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  FlatList,
  TextInput,
  Pressable,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  FadeIn,
  FadeInDown,
} from "react-native-reanimated";
import { useQuery } from "@tanstack/react-query";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/contexts/AuthContext";
import { Spacing, BorderRadius } from "@/constants/theme";
import { hymnSections, HymnSection } from "@/data/hymns";
import { HymnsStackParamList } from "@/navigation/HymnsStackNavigator";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { getApiUrl } from "@/lib/query-client";

interface Hymn {
  id: string;
  number: number;
  title: string;
  section: string;
  sectionId: number;
  language: "french" | "kreyol";
  verses: string;
  chorus: string | null;
}

type NavigationProp = NativeStackNavigationProp<HymnsStackParamList>;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface HymnItemProps {
  hymn: Hymn;
  index: number;
  onPress: () => void;
}

function HymnItem({ hymn, index, onPress }: HymnItemProps) {
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
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.hymnItem,
        { backgroundColor: theme.backgroundDefault, borderColor: theme.border },
        animatedStyle,
      ]}
    >
      <View style={[styles.hymnNumber, { backgroundColor: theme.accent }]}>
        <ThemedText style={styles.hymnNumberText}>{hymn.number}</ThemedText>
      </View>
      <View style={styles.hymnInfo}>
        <ThemedText style={styles.hymnTitle} numberOfLines={1}>
          {hymn.title}
        </ThemedText>
        <ThemedText
          style={[styles.hymnSection, { color: theme.textSecondary }]}
          numberOfLines={1}
        >
          {hymn.section}
        </ThemedText>
      </View>
      <View style={[styles.languageBadge, { backgroundColor: theme.backgroundSecondary }]}>
        <ThemedText style={[styles.languageBadgeText, { color: theme.textSecondary }]}>
          {hymn.language === "french" ? "FR" : "KR"}
        </ThemedText>
      </View>
      <Feather name="chevron-right" size={20} color={theme.textSecondary} />
    </AnimatedPressable>
  );
}

interface SectionItemProps {
  section: HymnSection;
  index: number;
  onPress: () => void;
}

function SectionItem({ section, index, onPress }: SectionItemProps) {
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
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.sectionItem,
        { backgroundColor: theme.backgroundDefault, borderColor: theme.border },
        animatedStyle,
      ]}
    >
      <View style={styles.sectionInfo}>
        <ThemedText style={styles.sectionTitle}>{section.name}</ThemedText>
        <ThemedText style={[styles.sectionCount, { color: theme.accent }]}>
          {section.hymnCount} cantiques
        </ThemedText>
      </View>
      <View style={[
        styles.languageBadgeLarge, 
        { backgroundColor: section.language === "french" ? theme.accent : "#2D5A27" }
      ]}>
        <ThemedText style={styles.languageBadgeLargeText}>
          {section.language === "french" ? "FR" : "KR"}
        </ThemedText>
      </View>
      <Feather name="chevron-right" size={20} color={theme.textSecondary} />
    </AnimatedPressable>
  );
}

function EmptyState() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleContributePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (user) {
      navigation.navigate("SubmitHymn");
    } else {
      navigation.navigate("Auth");
    }
  };

  return (
    <Animated.View entering={FadeIn.duration(300)} style={styles.emptyState}>
      <Image
        source={require("../../assets/images/empty-hymns.png")}
        style={styles.emptyImage}
        resizeMode="contain"
      />
      <ThemedText style={styles.emptyTitle}>Aucun cantique trouvé</ThemedText>
      <ThemedText style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
        Essayez un autre numéro ou titre
      </ThemedText>
      <ThemedText style={[styles.emptyHint, { color: theme.textSecondary }]}>
        Astuce: Ajoutez "français" ou "kreyol" à votre recherche
      </ThemedText>
      <View style={styles.contributeContainer}>
        <ThemedText style={[styles.contributeText, { color: theme.textSecondary }]}>
          Ce cantique manque?
        </ThemedText>
        <Pressable onPress={handleContributePress}>
          <ThemedText style={[styles.contributeLink, { color: theme.accent }]}>
            {user ? "Contribuez les paroles" : "Créez un compte pour l'ajouter"}
          </ThemedText>
        </Pressable>
      </View>
    </Animated.View>
  );
}

export default function HymnsScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [showSections, setShowSections] = useState(true);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Parse search query for language filter
  const parseSearchQuery = (query: string) => {
    const lowerQuery = query.toLowerCase().trim();
    let language: string | undefined;
    let cleanQuery = lowerQuery;

    if (lowerQuery.includes("français") || lowerQuery.includes("francais") || lowerQuery.includes(" fr")) {
      language = "french";
      cleanQuery = lowerQuery.replace(/français|francais| fr/gi, "").trim();
    } else if (lowerQuery.includes("kreyol") || lowerQuery.includes("kreyòl") || lowerQuery.includes(" kr")) {
      language = "kreyol";
      cleanQuery = lowerQuery.replace(/kreyol|kreyòl| kr/gi, "").trim();
    }

    return { cleanQuery, language };
  };

  const { cleanQuery, language } = parseSearchQuery(debouncedQuery);

  // Fetch search results from API
  const { data: searchResults = [], isLoading: isSearching } = useQuery<Hymn[]>({
    queryKey: ["hymns", "search", cleanQuery, language],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("q", cleanQuery);
      if (language) params.set("language", language);

      const response = await fetch(`${getApiUrl()}api/hymns/search?${params.toString()}`);
      if (!response.ok) throw new Error("Search failed");
      return response.json();
    },
    enabled: cleanQuery.length > 0,
    staleTime: 30 * 1000,
  });

  const filteredHymns = cleanQuery ? searchResults : [];

  const handleHymnPress = useCallback(
    (hymn: Hymn) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      navigation.navigate("HymnDetail", { hymnId: hymn.id });
    },
    [navigation]
  );

  const handleSectionPress = useCallback(
    (section: HymnSection) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      navigation.navigate("HymnSection", { sectionId: section.id, sectionName: section.nameFull });
    },
    [navigation]
  );

  const handleSearch = useCallback((text: string) => {
    setSearchQuery(text);
    if (text.trim()) {
      setShowSections(false);
    } else {
      setShowSections(true);
    }
  }, []);

  const renderHymnItem = useCallback(
    ({ item, index }: { item: Hymn; index: number }) => (
      <HymnItem
        hymn={item}
        index={index}
        onPress={() => handleHymnPress(item)}
      />
    ),
    [handleHymnPress]
  );

  const renderSectionItem = useCallback(
    ({ item, index }: { item: HymnSection; index: number }) => (
      <SectionItem
        section={item}
        index={index}
        onPress={() => handleSectionPress(item)}
      />
    ),
    [handleSectionPress]
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <View
        style={[
          styles.searchContainer,
          {
            paddingTop: headerHeight + Spacing.md,
            backgroundColor: theme.backgroundRoot,
          },
        ]}
      >
        <View
          style={[
            styles.searchBar,
            { backgroundColor: theme.searchBackground, borderColor: theme.border },
          ]}
        >
          <Feather name="search" size={20} color={theme.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Ex: 28 français, lanmou kreyol..."
            placeholderTextColor={theme.textSecondary}
            value={searchQuery}
            onChangeText={handleSearch}
            returnKeyType="search"
          />
          {searchQuery.length > 0 ? (
            <Pressable onPress={() => handleSearch("")}>
              <Feather name="x-circle" size={20} color={theme.textSecondary} />
            </Pressable>
          ) : null}
        </View>
      </View>

      {showSections ? (
        <FlatList
          data={hymnSections}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderSectionItem}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: tabBarHeight + Spacing.xl },
          ]}
          scrollIndicatorInsets={{ bottom: insets.bottom }}
          showsVerticalScrollIndicator={false}
        />
      ) : isSearching ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.accent} />
        </View>
      ) : (
        <FlatList
          data={filteredHymns}
          keyExtractor={(item) => item.id}
          renderItem={renderHymnItem}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: tabBarHeight + Spacing.xl },
          ]}
          scrollIndicatorInsets={{ bottom: insets.bottom }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={EmptyState}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    height: Spacing.inputHeight,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  hymnItem: {
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
  hymnInfo: {
    flex: 1,
    gap: 2,
  },
  hymnTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  hymnSection: {
    fontSize: 12,
  },
  sectionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    gap: Spacing.md,
  },
  sectionInfo: {
    flex: 1,
    gap: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  sectionCount: {
    fontSize: 12,
    fontWeight: "500",
  },
  languageBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.xs,
  },
  languageBadgeText: {
    fontSize: 10,
    fontWeight: "600",
  },
  languageBadgeLarge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.xs,
  },
  languageBadgeLargeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  emptyState: {
    alignItems: "center",
    paddingTop: Spacing["5xl"],
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
  },
  emptyHint: {
    fontSize: 12,
    textAlign: "center",
    marginTop: Spacing.md,
    fontStyle: "italic",
  },
  contributeContainer: {
    marginTop: Spacing.xl,
    alignItems: "center",
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  contributeText: {
    fontSize: 13,
    textAlign: "center",
  },
  contributeLink: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: Spacing.xs,
    textDecorationLine: "underline",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: Spacing["5xl"],
  },
});
