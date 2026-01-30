import React, { useState, useCallback } from "react";
import {
  View,
  ScrollView,
  Pressable,
  StyleSheet,
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
  FadeInDown,
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import {
  bibleVersions,
  getOldTestamentBooks,
  getNewTestamentBooks,
  BibleBook,
  BibleVersion,
} from "@/data/bible";
import { BibleStackParamList } from "@/navigation/BibleStackNavigator";

type NavigationProp = NativeStackNavigationProp<BibleStackParamList>;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface BookItemProps {
  book: BibleBook;
  onPress: () => void;
}

function BookItem({ book, onPress }: BookItemProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 150 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.bookItem,
        { backgroundColor: theme.backgroundDefault, borderColor: theme.border },
        animatedStyle,
      ]}
    >
      <ThemedText style={styles.bookAbbr}>{book.abbreviation}</ThemedText>
      <ThemedText style={[styles.bookChapters, { color: theme.textSecondary }]}>
        {book.chapters}
      </ThemedText>
    </AnimatedPressable>
  );
}

interface VersionSelectorProps {
  versions: BibleVersion[];
  selectedVersion: string;
  onSelect: (version: string) => void;
}

function VersionSelector({ versions, selectedVersion, onSelect }: VersionSelectorProps) {
  const { theme } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.versionScrollView}
      contentContainerStyle={styles.versionContainer}
    >
      {versions.filter(v => v.available).map((version) => (
        <Pressable
          key={version.id}
          onPress={() => {
            onSelect(version.id);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
          style={[
            styles.versionButton,
            {
              backgroundColor:
                selectedVersion === version.id
                  ? theme.accent
                  : theme.backgroundDefault,
              borderColor: theme.border,
            },
          ]}
        >
          <ThemedText
            style={[
              styles.versionButtonText,
              {
                color: selectedVersion === version.id ? "#FFFFFF" : theme.text,
              },
            ]}
          >
            {version.abbreviation}
          </ThemedText>
        </Pressable>
      ))}
    </ScrollView>
  );
}

export default function BibleScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const [selectedVersion, setSelectedVersion] = useState("NKJV");
  const [expandedSection, setExpandedSection] = useState<"old" | "new" | null>("new");

  const oldTestamentBooks = getOldTestamentBooks();
  const newTestamentBooks = getNewTestamentBooks();

  const handleBookPress = useCallback(
    (book: BibleBook) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      navigation.navigate("BibleReader", {
        bookId: book.id,
        bookName: book.name,
        chapter: 1,
        version: selectedVersion,
      });
    },
    [navigation, selectedVersion]
  );

  const toggleSection = (section: "old" | "new") => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExpandedSection(expandedSection === section ? null : section);
  };

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
      <Animated.View entering={FadeInDown.delay(100).duration(300)}>
        <ThemedText style={[styles.sectionLabel, { color: theme.textSecondary }]}>
          VERSION
        </ThemedText>
        <VersionSelector
          versions={bibleVersions}
          selectedVersion={selectedVersion}
          onSelect={setSelectedVersion}
        />
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(200).duration(300)}>
        <Pressable
          style={[styles.testamentHeader, { borderColor: theme.border }]}
          onPress={() => toggleSection("new")}
        >
          <View>
            <ThemedText style={styles.testamentTitle}>Nouveau Testament</ThemedText>
            <ThemedText style={[styles.testamentCount, { color: theme.textSecondary }]}>
              27 livres
            </ThemedText>
          </View>
          <Feather
            name={expandedSection === "new" ? "chevron-up" : "chevron-down"}
            size={24}
            color={theme.text}
          />
        </Pressable>

        {expandedSection === "new" ? (
          <View style={styles.booksGrid}>
            {newTestamentBooks.map((book) => (
              <BookItem
                key={book.id}
                book={book}
                onPress={() => handleBookPress(book)}
              />
            ))}
          </View>
        ) : null}
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(300).duration(300)}>
        <Pressable
          style={[styles.testamentHeader, { borderColor: theme.border }]}
          onPress={() => toggleSection("old")}
        >
          <View>
            <ThemedText style={styles.testamentTitle}>Ancien Testament</ThemedText>
            <ThemedText style={[styles.testamentCount, { color: theme.textSecondary }]}>
              39 livres
            </ThemedText>
          </View>
          <Feather
            name={expandedSection === "old" ? "chevron-up" : "chevron-down"}
            size={24}
            color={theme.text}
          />
        </Pressable>

        {expandedSection === "old" ? (
          <View style={styles.booksGrid}>
            {oldTestamentBooks.map((book) => (
              <BookItem
                key={book.id}
                book={book}
                onPress={() => handleBookPress(book)}
              />
            ))}
          </View>
        ) : null}
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
  sectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  versionScrollView: {
    marginBottom: Spacing.xl,
  },
  versionContainer: {
    gap: Spacing.sm,
  },
  versionButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  versionButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  testamentHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    marginBottom: Spacing.lg,
  },
  testamentTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  testamentCount: {
    fontSize: 13,
    marginTop: 2,
  },
  booksGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  bookItem: {
    width: "22%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  bookAbbr: {
    fontSize: 13,
    fontWeight: "600",
  },
  bookChapters: {
    fontSize: 11,
    marginTop: 2,
  },
});
