import React, { useCallback } from "react";
import { View, FlatList, Pressable, StyleSheet } from "react-native";
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

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { getHymnsBySection, Hymn } from "@/data/hymns";
import { HymnsStackParamList } from "@/navigation/HymnsStackNavigator";

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
      </View>
      <View style={styles.languageBadges}>
        {hymn.language === "both" ? (
          <>
            <View style={[styles.languageBadge, { backgroundColor: theme.backgroundSecondary }]}>
              <ThemedText style={[styles.languageBadgeText, { color: theme.textSecondary }]}>
                FR
              </ThemedText>
            </View>
            <View style={[styles.languageBadge, { backgroundColor: theme.backgroundSecondary }]}>
              <ThemedText style={[styles.languageBadgeText, { color: theme.textSecondary }]}>
                KR
              </ThemedText>
            </View>
          </>
        ) : (
          <View style={[styles.languageBadge, { backgroundColor: theme.backgroundSecondary }]}>
            <ThemedText style={[styles.languageBadgeText, { color: theme.textSecondary }]}>
              {hymn.language === "french" ? "FR" : "KR"}
            </ThemedText>
          </View>
        )}
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
  const hymns = getHymnsBySection(sectionId);

  React.useEffect(() => {
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

  return (
    <FlatList
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      data={hymns}
      keyExtractor={(item) => item.id}
      renderItem={renderHymnItem}
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
});
