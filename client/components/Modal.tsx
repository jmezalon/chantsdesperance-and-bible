import React from "react";
import {
  View,
  Pressable,
  StyleSheet,
  Modal as RNModal,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";

type ModalType = "success" | "error" | "warning" | "info";

interface ModalButton {
  text: string;
  onPress: () => void;
  primary?: boolean;
}

interface ModalProps {
  visible: boolean;
  type?: ModalType;
  title: string;
  message: string;
  buttons?: ModalButton[];
  onClose: () => void;
}

const iconMap: Record<ModalType, { name: keyof typeof Feather.glyphMap; color: string }> = {
  success: { name: "check-circle", color: "#059669" },
  error: { name: "x-circle", color: "#DC2626" },
  warning: { name: "alert-triangle", color: "#D97706" },
  info: { name: "info", color: "#2563EB" },
};

export function Modal({
  visible,
  type = "info",
  title,
  message,
  buttons = [{ text: "OK", onPress: () => {}, primary: true }],
  onClose,
}: ModalProps) {
  const { theme } = useTheme();
  const icon = iconMap[type];

  const handleButtonPress = (button: ModalButton) => {
    button.onPress();
    onClose();
  };

  // For web, use a custom overlay since RNModal behavior can be inconsistent
  if (Platform.OS === "web") {
    if (!visible) return null;

    return (
      <View style={styles.webOverlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(150)}
          style={[styles.modalContainer, { backgroundColor: theme.backgroundDefault }]}
        >
          <View style={[styles.iconContainer, { backgroundColor: `${icon.color}15` }]}>
            <Feather name={icon.name} size={32} color={icon.color} />
          </View>

          <ThemedText style={styles.title}>{title}</ThemedText>
          <ThemedText style={[styles.message, { color: theme.textSecondary }]}>
            {message}
          </ThemedText>

          <View style={styles.buttonContainer}>
            {buttons.map((button, index) => (
              <Pressable
                key={index}
                style={[
                  styles.button,
                  button.primary
                    ? { backgroundColor: theme.accent }
                    : { backgroundColor: theme.backgroundRoot, borderWidth: 1, borderColor: theme.border },
                ]}
                onPress={() => handleButtonPress(button)}
              >
                <ThemedText
                  style={[
                    styles.buttonText,
                    { color: button.primary ? "#FFFFFF" : theme.text },
                  ]}
                >
                  {button.text}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </Animated.View>
      </View>
    );
  }

  // For native, use React Native Modal
  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View style={[styles.modalContainer, { backgroundColor: theme.backgroundDefault }]}>
          <View style={[styles.iconContainer, { backgroundColor: `${icon.color}15` }]}>
            <Feather name={icon.name} size={32} color={icon.color} />
          </View>

          <ThemedText style={styles.title}>{title}</ThemedText>
          <ThemedText style={[styles.message, { color: theme.textSecondary }]}>
            {message}
          </ThemedText>

          <View style={styles.buttonContainer}>
            {buttons.map((button, index) => (
              <Pressable
                key={index}
                style={[
                  styles.button,
                  button.primary
                    ? { backgroundColor: theme.accent }
                    : { backgroundColor: theme.backgroundRoot, borderWidth: 1, borderColor: theme.border },
                ]}
                onPress={() => handleButtonPress(button)}
              >
                <ThemedText
                  style={[
                    styles.buttonText,
                    { color: button.primary ? "#FFFFFF" : theme.text },
                  ]}
                >
                  {button.text}
                </ThemedText>
              </Pressable>
            ))}
          </View>
        </View>
      </Pressable>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  webOverlay: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    justifyContent: "center",
    alignItems: "center",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    maxWidth: 400,
    borderRadius: BorderRadius.md,
    padding: Spacing.xl,
    alignItems: "center",
    ...Platform.select({
      web: {
        position: "relative" as const,
      },
    }),
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  message: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: Spacing.md,
    width: "100%",
  },
  button: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "600",
  },
});
