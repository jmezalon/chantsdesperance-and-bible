import React, { useCallback, useEffect } from "react";
import { View, FlatList, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  FadeInDown,
} from "react-native-reanimated";
import { useQuery } from "@tanstack/react-query";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { getSectionById } from "@/data/hymns";
import { HymnsStackParamList } from "@/navigation/HymnsStackNavigator";
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

type RouteProps = RouteProp<HymnsStackParamList, "HymnSection">;
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
        <ThemedText style={styles.hymnTitle} numberOfLines={2}>
          {hymn.title}
        </ThemedText>
      </View>
      <Feather name="chevron-right" size={20} color={theme.textSecondary} />
    </AnimatedPressable>
  );
}

export default function HymnSectionScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProp>();

  const { sectionId, sectionName } = route.params;
  const section = getSectionById(sectionId);

  // Fetch hymns from API
  const { data: hymns = [], isLoading, error } = useQuery<Hymn[]>({
    queryKey: ["hymns", "section", sectionId],
    queryFn: async () => {
      const response = await fetch(`${getApiUrl()}api/hymns/section/${sectionId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch hymns");
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    navigation.setOptions({
      headerTitle: sectionName,
    });
  }, [navigation, sectionName]);

  const handleHymnPress = useCallback(
    (hymn: Hymn) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      navigation.navigate("HymnDetail", { hymnId: hymn.id });
    },
    [navigation]
  );

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

  const renderHeader = useCallback(() => {
    if (!section) return null;
    
    return (
      <View style={styles.headerContainer}>
        <View style={[
          styles.languageBadge, 
          { backgroundColor: section.language === "french" ? theme.accent : "#2D5A27" }
        ]}>
          <ThemedText style={styles.languageBadgeText}>
            {section.language === "french" ? "Français" : "Kreyòl"}
          </ThemedText>
        </View>
        <ThemedText style={[styles.description, { color: theme.textSecondary }]}>
          {section.description}
        </ThemedText>
      </View>
    );
  }, [section, theme]);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.backgroundRoot }]}>
        <ActivityIndicator size="large" color={theme.accent} />
        <ThemedText style={{ marginTop: Spacing.md }}>Loading hymns...</ThemedText>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.backgroundRoot }]}>
        <Feather name="alert-circle" size={48} color={theme.textSecondary} />
        <ThemedText style={{ marginTop: Spacing.md, color: theme.textSecondary }}>
          Failed to load hymns
        </ThemedText>
      </View>
    );
  }

  return (
    <FlatList
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      data={hymns}
      keyExtractor={(item) => item.id}
      renderItem={renderHymnItem}
      ListHeaderComponent={renderHeader}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <ThemedText style={{ color: theme.textSecondary }}>
            No hymns available in this section yet.
          </ThemedText>
        </View>
      }
      contentContainerStyle={[
        styles.listContent,
        {
          paddingTop: headerHeight + Spacing.lg,
          paddingBottom: insets.bottom + Spacing.xl,
        },
      ]}
      scrollIndicatorInsets={{ bottom: insets.bottom }}
      showsVerticalScrollIndicator={false}
    />
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
  emptyContainer: {
    padding: Spacing.xl,
    alignItems: "center",
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  headerContainer: {
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  languageBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.xs,
  },
  languageBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
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
});
