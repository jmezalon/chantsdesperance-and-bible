import React, { useState, useEffect } from "react";
import {
  View,
  Pressable,
  StyleSheet,
  Platform,
  Linking,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, { FadeInDown, FadeOutUp } from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

// App Store and Play Store URLs - update these when your apps are published
const APP_STORE_URL = "https://apps.apple.com/app/id6758521371";
const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.chantsesperance.bible";

type UserOS = "ios" | "android" | "other";

function detectUserOS(): UserOS {
  if (Platform.OS !== "web") {
    return "other"; // Don't show on native apps
  }

  const userAgent = typeof navigator !== "undefined" ? navigator.userAgent.toLowerCase() : "";

  if (/iphone|ipad|ipod/.test(userAgent)) {
    return "ios";
  }
  if (/android/.test(userAgent)) {
    return "android";
  }
  return "other";
}

interface AppDownloadBannerProps {
  position?: "top" | "bottom";
}

export function AppDownloadBanner({ position = "bottom" }: AppDownloadBannerProps) {
  const { theme } = useTheme();
  const [visible, setVisible] = useState(false);
  const [userOS, setUserOS] = useState<UserOS>("other");

  useEffect(() => {
    // Only show on web
    if (Platform.OS !== "web") return;

    const os = detectUserOS();
    setUserOS(os);

    // Show banner after a short delay if on mobile device
    if (os !== "other") {
      const timer = setTimeout(() => setVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!visible || userOS === "other") {
    return null;
  }

  const handleDownload = () => {
    const url = userOS === "ios" ? APP_STORE_URL : PLAY_STORE_URL;
    Linking.openURL(url);
  };

  const handleDismiss = () => {
    setVisible(false);
  };

  const storeName = userOS === "ios" ? "App Store" : "Google Play";
  const storeIcon = userOS === "ios" ? "smartphone" : "smartphone";

  return (
    <Animated.View
      entering={FadeInDown.duration(300)}
      exiting={FadeOutUp.duration(200)}
      style={[
        styles.container,
        position === "top" ? styles.containerTop : styles.containerBottom,
        { backgroundColor: theme.accent },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Feather name={storeIcon} size={24} color="#FFFFFF" />
        </View>
        <View style={styles.textContainer}>
          <ThemedText style={styles.title}>Get the App</ThemedText>
          <ThemedText style={styles.subtitle}>
            Download for a better experience
          </ThemedText>
        </View>
        <Pressable
          style={[styles.downloadButton, { backgroundColor: "#FFFFFF" }]}
          onPress={handleDownload}
        >
          <ThemedText style={[styles.downloadButtonText, { color: theme.accent }]}>
            {storeName}
          </ThemedText>
        </Pressable>
        <Pressable style={styles.dismissButton} onPress={handleDismiss}>
          <Feather name="x" size={20} color="#FFFFFF" />
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  containerTop: {
    top: 0,
  },
  containerBottom: {
    bottom: 0,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  subtitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 12,
  },
  downloadButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  downloadButtonText: {
    fontSize: 12,
    fontWeight: "700",
  },
  dismissButton: {
    padding: Spacing.xs,
  },
});
