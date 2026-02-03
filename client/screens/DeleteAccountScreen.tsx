import React, { useState } from "react";
import {
  View,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/contexts/AuthContext";
import { Spacing, BorderRadius } from "@/constants/theme";

export default function DeleteAccountScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const { deleteAccount } = useAuth();
  const navigation = useNavigation();

  const [password, setPassword] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const isConfirmed = confirmText === "DELETE";

  const handleDelete = async () => {
    if (isLoading) return;

    setError("");

    if (!password.trim()) {
      setError("Please enter your password");
      return;
    }

    if (!isConfirmed) {
      setError("Please type DELETE to confirm");
      return;
    }

    setIsLoading(true);
    try {
      await deleteAccount(password);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      navigation.goBack();
    } catch (err: any) {
      setError(err.message || "Failed to delete account");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.backgroundRoot }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: headerHeight + Spacing.xl,
            paddingBottom: insets.bottom + Spacing.xl,
          },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View entering={FadeInDown.delay(100).duration(300)}>
          <View style={styles.header}>
            <View style={[styles.iconContainer, { backgroundColor: "#FEE2E2" }]}>
              <Feather name="alert-triangle" size={48} color="#DC2626" />
            </View>
            <ThemedText style={styles.title}>Delete Account</ThemedText>
            <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
              This action is permanent and cannot be undone
            </ThemedText>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(300)}>
          <View style={[styles.warningBox, { backgroundColor: "#FEF3C7", borderColor: "#F59E0B" }]}>
            <Feather name="alert-circle" size={18} color="#92400E" style={styles.warningIcon} />
            <ThemedText style={styles.warningText}>
              Deleting your account will permanently remove all your data, including your submitted hymns and contributions. This cannot be reversed.
            </ThemedText>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(300)}>
          {error ? (
            <View style={[styles.errorBox, { backgroundColor: "#FEE2E2" }]}>
              <ThemedText style={styles.errorText}>{error}</ThemedText>
            </View>
          ) : null}

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>Password</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.backgroundDefault,
                    borderColor: theme.border,
                    color: theme.text,
                  },
                ]}
                placeholder="Enter your password"
                placeholderTextColor={theme.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>
                Type <ThemedText style={styles.deleteWord}>DELETE</ThemedText> to confirm
              </ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.backgroundDefault,
                    borderColor: isConfirmed ? "#DC2626" : theme.border,
                    color: theme.text,
                  },
                ]}
                placeholder="DELETE"
                placeholderTextColor={theme.textSecondary}
                value={confirmText}
                onChangeText={setConfirmText}
                autoCapitalize="characters"
                autoCorrect={false}
              />
            </View>

            <Pressable
              style={[
                styles.deleteButton,
                {
                  backgroundColor: isConfirmed && password.trim() ? "#DC2626" : "#E5E7EB",
                },
              ]}
              onPress={handleDelete}
              disabled={isLoading || !isConfirmed || !password.trim()}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <ThemedText
                  style={[
                    styles.deleteButtonText,
                    {
                      color: isConfirmed && password.trim() ? "#FFFFFF" : "#9CA3AF",
                    },
                  ]}
                >
                  Delete My Account
                </ThemedText>
              )}
            </Pressable>

            <Pressable
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
            >
              <ThemedText style={[styles.cancelText, { color: theme.accent }]}>
                Cancel
              </ThemedText>
            </Pressable>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
    flexGrow: 1,
  },
  header: {
    alignItems: "center",
    marginBottom: Spacing["3xl"],
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginTop: Spacing.lg,
    color: "#DC2626",
  },
  subtitle: {
    fontSize: 14,
    marginTop: Spacing.sm,
    textAlign: "center",
  },
  warningBox: {
    flexDirection: "row",
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  warningIcon: {
    marginTop: 2,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    color: "#92400E",
  },
  errorBox: {
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.lg,
  },
  errorText: {
    color: "#DC2626",
    fontSize: 14,
    textAlign: "center",
  },
  form: {
    gap: Spacing.lg,
  },
  inputGroup: {
    gap: Spacing.xs,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
  deleteWord: {
    color: "#DC2626",
    fontWeight: "700",
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    fontSize: 16,
  },
  deleteButton: {
    height: 52,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing.md,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: "700",
  },
  cancelButton: {
    alignItems: "center",
    paddingVertical: Spacing.md,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
