import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  ScrollView,
  Pressable,
  StyleSheet,
  Switch,
  Linking,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/contexts/AuthContext";
import { Spacing, BorderRadius } from "@/constants/theme";
import { getSettings, updateSettings, AppSettings } from "@/lib/storage";
import { bibleVersions } from "@/data/bible";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

interface SettingRowProps {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
}

function SettingRow({ icon, title, subtitle, onPress, rightElement }: SettingRowProps) {
  const { theme } = useTheme();

  return (
    <Pressable
      style={[styles.settingRow, { borderBottomColor: theme.border }]}
      onPress={onPress}
      disabled={!onPress && !rightElement}
    >
      <View style={[styles.settingIcon, { backgroundColor: theme.backgroundSecondary }]}>
        <Feather name={icon} size={18} color={theme.accent} />
      </View>
      <View style={styles.settingInfo}>
        <ThemedText style={styles.settingTitle}>{title}</ThemedText>
        {subtitle ? (
          <ThemedText style={[styles.settingSubtitle, { color: theme.textSecondary }]}>
            {subtitle}
          </ThemedText>
        ) : null}
      </View>
      {rightElement ? (
        rightElement
      ) : onPress ? (
        <Feather name="chevron-right" size={20} color={theme.textSecondary} />
      ) : null}
    </Pressable>
  );
}

interface TextSizeOption {
  value: "small" | "medium" | "large";
  label: string;
}

const textSizeOptions: TextSizeOption[] = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
];

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user, logout, isLoading: authLoading } = useAuth();

  const [settings, setSettings] = useState<AppSettings>({
    defaultBibleVersion: "NKJV",
    textSize: "medium",
    showKreyol: true,
  });

  const handleLogout = async () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            await logout();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
        },
      ]
    );
  };

  useEffect(() => {
    getSettings().then(setSettings);
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.doneButton}
        >
          <ThemedText style={[styles.doneButtonText, { color: theme.accent }]}>
            Done
          </ThemedText>
        </Pressable>
      ),
    });
  }, [navigation, theme]);

  const handleUpdateSettings = useCallback(
    async (updates: Partial<AppSettings>) => {
      const newSettings = { ...settings, ...updates };
      setSettings(newSettings);
      await updateSettings(updates);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    },
    [settings]
  );

  const currentVersion = bibleVersions.find(
    (v) => v.id === settings.defaultBibleVersion
  );

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
      <Animated.View entering={FadeInDown.delay(100).duration(300)}>
        <ThemedText style={[styles.sectionLabel, { color: theme.textSecondary }]}>
          ACCOUNT
        </ThemedText>
        <View style={[styles.settingsGroup, { backgroundColor: theme.backgroundDefault, borderColor: theme.border }]}>
          {user ? (
            <>
              <SettingRow
                icon="user"
                title={user.username}
                subtitle={
                  user.isAdmin
                    ? "Administrator"
                    : user.isTrusted
                    ? `Trusted Contributor (${user.approvedCount} approved)`
                    : `Contributor (${user.approvedCount}/5 for trusted status)`
                }
              />
              <SettingRow
                icon="plus-circle"
                title="Submit a Hymn"
                subtitle="Contribute missing hymn lyrics"
                onPress={() => {
                  navigation.navigate("SubmitHymn");
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
              />
              {user.isAdmin ? (
                <SettingRow
                  icon="check-square"
                  title="Review Submissions"
                  subtitle="Approve or reject pending hymns"
                  onPress={() => {
                    navigation.navigate("AdminReview");
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                />
              ) : null}
              <SettingRow
                icon="log-out"
                title="Sign Out"
                onPress={handleLogout}
              />
            </>
          ) : (
            <SettingRow
              icon="log-in"
              title="Sign In"
              subtitle="Sign in to contribute hymn lyrics"
              onPress={() => {
                navigation.navigate("Auth");
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            />
          )}
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(150).duration(300)}>
        <ThemedText style={[styles.sectionLabel, { color: theme.textSecondary }]}>
          APPARENCE
        </ThemedText>
        <View style={[styles.settingsGroup, { backgroundColor: theme.backgroundDefault, borderColor: theme.border }]}>
          <SettingRow
            icon="type"
            title="Taille du texte"
            subtitle={textSizeOptions.find((o) => o.value === settings.textSize)?.label}
          />
          <View style={styles.textSizeSelector}>
            {textSizeOptions.map((option) => (
              <Pressable
                key={option.value}
                style={[
                  styles.textSizeOption,
                  {
                    backgroundColor:
                      settings.textSize === option.value
                        ? theme.accent
                        : theme.backgroundSecondary,
                  },
                ]}
                onPress={() => handleUpdateSettings({ textSize: option.value })}
              >
                <ThemedText
                  style={[
                    styles.textSizeOptionText,
                    {
                      color:
                        settings.textSize === option.value ? "#FFFFFF" : theme.text,
                      fontSize:
                        option.value === "small" ? 12 : option.value === "large" ? 18 : 15,
                    },
                  ]}
                >
                  Aa
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(250).duration(300)}>
        <ThemedText style={[styles.sectionLabel, { color: theme.textSecondary }]}>
          BIBLE
        </ThemedText>
        <View style={[styles.settingsGroup, { backgroundColor: theme.backgroundDefault, borderColor: theme.border }]}>
          <ThemedText style={[styles.versionLabel, { color: theme.textSecondary }]}>
            Version par défaut
          </ThemedText>
          <View style={styles.versionSelector}>
            {bibleVersions.filter(v => v.available).map((version) => (
              <Pressable
                key={version.id}
                style={[
                  styles.versionOption,
                  {
                    backgroundColor:
                      settings.defaultBibleVersion === version.id
                        ? theme.accent
                        : theme.backgroundSecondary,
                    borderColor: theme.border,
                  },
                ]}
                onPress={() => handleUpdateSettings({ defaultBibleVersion: version.id })}
              >
                <ThemedText
                  style={[
                    styles.versionOptionText,
                    {
                      color:
                        settings.defaultBibleVersion === version.id
                          ? "#FFFFFF"
                          : theme.text,
                    },
                  ]}
                >
                  {version.abbreviation}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(350).duration(300)}>
        <ThemedText style={[styles.sectionLabel, { color: theme.textSecondary }]}>
          CANTIQUES
        </ThemedText>
        <View style={[styles.settingsGroup, { backgroundColor: theme.backgroundDefault, borderColor: theme.border }]}>
          <SettingRow
            icon="globe"
            title="Afficher Kreyòl"
            subtitle="Afficher la traduction kreyòl quand disponible"
            rightElement={
              <Switch
                value={settings.showKreyol}
                onValueChange={(value) => handleUpdateSettings({ showKreyol: value })}
                trackColor={{ false: theme.backgroundSecondary, true: theme.accent }}
                thumbColor="#FFFFFF"
              />
            }
          />
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(450).duration(300)}>
        <ThemedText style={[styles.sectionLabel, { color: theme.textSecondary }]}>
          À PROPOS
        </ThemedText>
        <View style={[styles.settingsGroup, { backgroundColor: theme.backgroundDefault, borderColor: theme.border }]}>
          <SettingRow
            icon="info"
            title="Version"
            subtitle="1.0.0"
          />
          <SettingRow
            icon="heart"
            title="Made with love"
            subtitle="Pour la communauté chrétienne haïtienne"
          />
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(550).duration(300)} style={styles.footer}>
        <ThemedText style={[styles.footerText, { color: theme.textSecondary }]}>
          Chants d'Espérance & Bible
        </ThemedText>
        <ThemedText style={[styles.footerSubtext, { color: theme.textSecondary }]}>
          Gloire à Dieu dans les lieux très hauts
        </ThemedText>
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
  doneButton: {
    paddingHorizontal: Spacing.sm,
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: Spacing.sm,
    marginTop: Spacing.xl,
    marginLeft: Spacing.sm,
  },
  settingsGroup: {
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    overflow: "hidden",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderBottomWidth: 1,
    gap: Spacing.md,
  },
  settingIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  settingInfo: {
    flex: 1,
    gap: 2,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  settingSubtitle: {
    fontSize: 13,
  },
  textSizeSelector: {
    flexDirection: "row",
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  textSizeOption: {
    flex: 1,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: BorderRadius.xs,
  },
  textSizeOptionText: {
    fontWeight: "600",
  },
  versionLabel: {
    fontSize: 12,
    fontWeight: "600",
    padding: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  versionSelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  versionOption: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  versionOptionText: {
    fontSize: 14,
    fontWeight: "600",
  },
  footer: {
    alignItems: "center",
    paddingTop: Spacing["3xl"],
    paddingBottom: Spacing.xl,
  },
  footerText: {
    fontSize: 14,
    fontWeight: "600",
  },
  footerSubtext: {
    fontSize: 12,
    marginTop: Spacing.xs,
    fontStyle: "italic",
  },
});
