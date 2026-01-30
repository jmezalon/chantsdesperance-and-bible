import React, { useState, useCallback } from "react";
import {
  View,
  FlatList,
  TextInput,
  Pressable,
  StyleSheet,
  Image,
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

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { hymns, hymnSections, searchHymns, Hymn, HymnSection } from "@/data/hymns";
import { HymnsStackParamList } from "@/navigation/HymnsStackNavigator";

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
        {hymn.titleKreyol ? (
          <ThemedText
            style={[styles.hymnSubtitle, { color: theme.textSecondary }]}
            numberOfLines={1}
          >
            {hymn.titleKreyol}
          </ThemedText>
        ) : null}
        <ThemedText
          style={[styles.hymnSection, { color: theme.textSecondary }]}
          numberOfLines={1}
        >
          {hymn.section}
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
        {section.nameKreyol ? (
          <ThemedText
            style={[styles.sectionSubtitle, { color: theme.textSecondary }]}
          >
            {section.nameKreyol}
          </ThemedText>
        ) : null}
        <ThemedText style={[styles.sectionCount, { color: theme.accent }]}>
          {section.hymnCount} cantiques
        </ThemedText>
      </View>
      <View style={styles.languageBadges}>
        {section.languages.map((lang) => (
          <View
            key={lang}
            style={[styles.languageBadge, { backgroundColor: theme.backgroundSecondary }]}
          >
            <ThemedText style={[styles.languageBadgeText, { color: theme.textSecondary }]}>
              {lang === "french" ? "FR" : "KR"}
            </ThemedText>
          </View>
        ))}
      </View>
      <Feather name="chevron-right" size={20} color={theme.textSecondary} />
    </AnimatedPressable>
  );
}

function EmptyState() {
  const { theme } = useTheme();

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
  const [showSections, setShowSections] = useState(true);

  const filteredHymns = searchQuery.trim() ? searchHymns(searchQuery) : hymns;

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
      navigation.navigate("HymnSection", { sectionId: section.id, sectionName: section.name });
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
            placeholder="Rechercher par numéro ou titre..."
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
  hymnSubtitle: {
    fontSize: 14,
    fontStyle: "italic",
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
  sectionSubtitle: {
    fontSize: 14,
    fontStyle: "italic",
  },
  sectionCount: {
    fontSize: 12,
    fontWeight: "500",
  },
  languageBadges: {
    flexDirection: "row",
    gap: Spacing.xs,
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
});
