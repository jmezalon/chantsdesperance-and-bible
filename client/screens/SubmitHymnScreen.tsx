import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Picker } from "@react-native-picker/picker";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/contexts/AuthContext";
import { Spacing, BorderRadius } from "@/constants/theme";
import { hymnSections } from "@/data/hymns";
import { apiRequest, getApiUrl } from "@/lib/query-client";
import { showAlert } from "@/lib/alert";

export default function SubmitHymnScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { user } = useAuth();

  const [sectionId, setSectionId] = useState<number>(hymnSections[0].id);
  const [hymnNumber, setHymnNumber] = useState("");
  const [title, setTitle] = useState("");
  const [verses, setVerses] = useState("");
  const [chorus, setChorus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [existsStatus, setExistsStatus] = useState<string | null>(null);

  const selectedSection = hymnSections.find((s) => s.id === sectionId);

  useEffect(() => {
    const checkExists = async () => {
      if (!hymnNumber || !selectedSection) {
        setExistsStatus(null);
        return;
      }

      setIsChecking(true);
      try {
        const url = new URL("/api/hymns/check-exists", getApiUrl());
        url.searchParams.set("sectionId", String(sectionId));
        url.searchParams.set("language", selectedSection.language);
        url.searchParams.set("hymnNumber", hymnNumber);

        const response = await fetch(url.toString());
        const data = await response.json();

        if (data.exists) {
          setExistsStatus(data.status === "approved" ? "approved" : "pending");
        } else {
          setExistsStatus(null);
        }
      } catch (error) {
        console.error("Check exists error:", error);
      } finally {
        setIsChecking(false);
      }
    };

    const timer = setTimeout(checkExists, 500);
    return () => clearTimeout(timer);
  }, [hymnNumber, sectionId, selectedSection]);

  const handleSubmit = async () => {
    if (!selectedSection) return;

    if (!hymnNumber.trim() || !title.trim() || !verses.trim()) {
      showAlert("Missing Fields", "Please fill in hymn number, title, and at least one verse.");
      return;
    }

    if (existsStatus) {
      showAlert(
        "Hymn Exists",
        existsStatus === "approved"
          ? "This hymn already exists in the database."
          : "This hymn is already pending review."
      );
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/submissions", {
        sectionId,
        sectionName: selectedSection.name,
        language: selectedSection.language,
        hymnNumber: parseInt(hymnNumber),
        title: title.trim(),
        verses: verses.trim(),
        chorus: chorus.trim() || null,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Submission failed");
      }

      const result = await response.json();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      showAlert(
        "Success!",
        result.message,
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } catch (error: any) {
      showAlert("Error", error.message || "Failed to submit hymn");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: headerHeight + Spacing.lg,
            paddingBottom: insets.bottom + Spacing.xl,
          },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View entering={FadeInDown.delay(100).duration(300)}>
          {user?.isTrusted ? (
            <View style={[styles.trustedBadge, { backgroundColor: "#D1FAE5" }]}>
              <Feather name="check-circle" size={16} color="#059669" />
              <ThemedText style={styles.trustedText}>
                Trusted Contributor - Your submissions are auto-approved
              </ThemedText>
            </View>
          ) : null}

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Hymn Book</ThemedText>
            <View
              style={[
                styles.pickerContainer,
                { backgroundColor: theme.backgroundDefault, borderColor: theme.border },
              ]}
            >
              <Picker
                selectedValue={sectionId}
                onValueChange={setSectionId}
                style={{ color: theme.text }}
              >
                {hymnSections.map((section) => (
                  <Picker.Item
                    key={section.id}
                    label={section.nameFull}
                    value={section.id}
                  />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Hymn Number</ThemedText>
            <View style={styles.numberInputRow}>
              <TextInput
                style={[
                  styles.input,
                  styles.numberInput,
                  {
                    backgroundColor: theme.backgroundDefault,
                    borderColor: existsStatus ? "#EF4444" : theme.border,
                    color: theme.text,
                  },
                ]}
                placeholder="e.g., 28"
                placeholderTextColor={theme.textSecondary}
                value={hymnNumber}
                onChangeText={setHymnNumber}
                keyboardType="number-pad"
              />
              {isChecking ? (
                <ActivityIndicator size="small" color={theme.accent} />
              ) : existsStatus ? (
                <View style={styles.existsWarning}>
                  <Feather name="alert-circle" size={16} color="#EF4444" />
                  <ThemedText style={styles.existsText}>
                    {existsStatus === "approved" ? "Already exists" : "Pending review"}
                  </ThemedText>
                </View>
              ) : hymnNumber ? (
                <View style={styles.availableBadge}>
                  <Feather name="check" size={16} color="#059669" />
                  <ThemedText style={styles.availableText}>Available</ThemedText>
                </View>
              ) : null}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Title</ThemedText>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.backgroundDefault,
                  borderColor: theme.border,
                  color: theme.text,
                },
              ]}
              placeholder="Enter hymn title"
              placeholderTextColor={theme.textSecondary}
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>
              Verses (separate each verse with a blank line)
            </ThemedText>
            <TextInput
              style={[
                styles.textArea,
                {
                  backgroundColor: theme.backgroundDefault,
                  borderColor: theme.border,
                  color: theme.text,
                },
              ]}
              placeholder={"Verse 1:\nFirst line of verse 1\nSecond line...\n\nVerse 2:\nFirst line of verse 2..."}
              placeholderTextColor={theme.textSecondary}
              value={verses}
              onChangeText={setVerses}
              multiline
              numberOfLines={8}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Chorus (optional)</ThemedText>
            <TextInput
              style={[
                styles.textArea,
                styles.chorusInput,
                {
                  backgroundColor: theme.backgroundDefault,
                  borderColor: theme.border,
                  color: theme.text,
                },
              ]}
              placeholder="Enter chorus lyrics..."
              placeholderTextColor={theme.textSecondary}
              value={chorus}
              onChangeText={setChorus}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <Pressable
            style={[
              styles.submitButton,
              { backgroundColor: theme.accent },
              (isLoading || existsStatus) && { opacity: 0.5 },
            ]}
            onPress={handleSubmit}
            disabled={isLoading || !!existsStatus}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Feather name="send" size={20} color="#FFFFFF" />
                <ThemedText style={styles.submitButtonText}>Submit Hymn</ThemedText>
              </>
            )}
          </Pressable>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
  },
  trustedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.lg,
  },
  trustedText: {
    color: "#059669",
    fontSize: 13,
    fontWeight: "600",
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    overflow: "hidden",
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    fontSize: 16,
  },
  numberInputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  numberInput: {
    width: 100,
  },
  existsWarning: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  existsText: {
    color: "#EF4444",
    fontSize: 13,
  },
  availableBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  availableText: {
    color: "#059669",
    fontSize: 13,
  },
  textArea: {
    minHeight: 150,
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    fontSize: 16,
  },
  chorusInput: {
    minHeight: 100,
  },
  submitButton: {
    height: 52,
    borderRadius: BorderRadius.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
