import React, { useState, useCallback } from "react";
import {
  View,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { getApiUrl, apiRequest } from "@/lib/query-client";

interface Submission {
  submission: {
    id: string;
    sectionName: string;
    language: string;
    hymnNumber: number;
    title: string;
    verses: string;
    chorus: string | null;
    status: string;
    createdAt: string;
  };
  submitter: {
    id: string;
    username: string;
    approvedCount: number;
  };
}

export default function AdminReviewScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const queryClient = useQueryClient();

  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: submissions, isLoading, refetch } = useQuery<Submission[]>({
    queryKey: ["/api/submissions/pending"],
  });

  const reviewMutation = useMutation({
    mutationFn: async ({ id, action, note }: { id: string; action: string; note?: string }) => {
      return apiRequest("POST", `/api/submissions/${id}/review`, { action, note });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/submissions/pending"] });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    },
    onError: (error: any) => {
      Alert.alert("Error", error.message || "Review failed");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    },
  });

  const handleReview = (id: string, action: "approve" | "reject") => {
    const actionLabel = action === "approve" ? "approve" : "reject";
    Alert.alert(
      `${action === "approve" ? "Approve" : "Reject"} Submission`,
      `Are you sure you want to ${actionLabel} this hymn?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: action === "approve" ? "Approve" : "Reject",
          style: action === "reject" ? "destructive" : "default",
          onPress: () => reviewMutation.mutate({ id, action }),
        },
      ]
    );
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.backgroundRoot }]}>
        <ActivityIndicator size="large" color={theme.accent} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundRoot }]}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: headerHeight + Spacing.lg,
            paddingBottom: tabBarHeight + Spacing.xl,
          },
        ]}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={refetch} />
        }
      >
        {submissions && submissions.length > 0 ? (
          submissions.map((item, index) => (
            <Animated.View
              key={item.submission.id}
              entering={FadeInDown.delay(index * 50).duration(300)}
            >
              <Pressable
                style={[styles.card, { backgroundColor: theme.backgroundDefault, borderColor: theme.border }]}
                onPress={() => toggleExpand(item.submission.id)}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.cardInfo}>
                    <ThemedText style={styles.hymnNumber}>
                      #{item.submission.hymnNumber}
                    </ThemedText>
                    <View style={[
                      styles.languageBadge,
                      { backgroundColor: item.submission.language === "french" ? "#C17F3E" : "#2D5A27" }
                    ]}>
                      <ThemedText style={styles.languageText}>
                        {item.submission.language === "french" ? "FR" : "KR"}
                      </ThemedText>
                    </View>
                  </View>
                  <Feather
                    name={expandedId === item.submission.id ? "chevron-up" : "chevron-down"}
                    size={20}
                    color={theme.textSecondary}
                  />
                </View>

                <ThemedText style={styles.title}>{item.submission.title}</ThemedText>
                <ThemedText style={[styles.section, { color: theme.textSecondary }]}>
                  {item.submission.sectionName}
                </ThemedText>

                <View style={styles.submitterInfo}>
                  <Feather name="user" size={12} color={theme.textSecondary} />
                  <ThemedText style={[styles.submitterText, { color: theme.textSecondary }]}>
                    {item.submitter.username} ({item.submitter.approvedCount} approved)
                  </ThemedText>
                </View>

                {expandedId === item.submission.id ? (
                  <View style={styles.expandedContent}>
                    <View style={[styles.divider, { backgroundColor: theme.border }]} />

                    <ThemedText style={styles.sectionLabel}>Verses:</ThemedText>
                    <ThemedText style={styles.lyricsText}>{item.submission.verses}</ThemedText>

                    {item.submission.chorus ? (
                      <>
                        <ThemedText style={styles.sectionLabel}>Chorus:</ThemedText>
                        <ThemedText style={styles.lyricsText}>{item.submission.chorus}</ThemedText>
                      </>
                    ) : null}

                    <View style={styles.actionButtons}>
                      <Pressable
                        style={[styles.rejectButton, { borderColor: "#EF4444" }]}
                        onPress={() => handleReview(item.submission.id, "reject")}
                        disabled={reviewMutation.isPending}
                      >
                        <Feather name="x" size={18} color="#EF4444" />
                        <ThemedText style={styles.rejectButtonText}>Reject</ThemedText>
                      </Pressable>

                      <Pressable
                        style={[styles.approveButton, { backgroundColor: "#059669" }]}
                        onPress={() => handleReview(item.submission.id, "approve")}
                        disabled={reviewMutation.isPending}
                      >
                        <Feather name="check" size={18} color="#FFFFFF" />
                        <ThemedText style={styles.approveButtonText}>Approve</ThemedText>
                      </Pressable>
                    </View>
                  </View>
                ) : null}
              </Pressable>
            </Animated.View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Feather name="inbox" size={48} color={theme.textSecondary} />
            <ThemedText style={[styles.emptyText, { color: theme.textSecondary }]}>
              No pending submissions
            </ThemedText>
            <ThemedText style={[styles.emptySubtext, { color: theme.textSecondary }]}>
              All caught up! Check back later.
            </ThemedText>
          </View>
        )}
      </ScrollView>
    </View>
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
  content: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  card: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  cardInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  hymnNumber: {
    fontSize: 18,
    fontWeight: "700",
  },
  languageBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  languageText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },
  section: {
    fontSize: 13,
    marginBottom: Spacing.sm,
  },
  submitterInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  submitterText: {
    fontSize: 12,
  },
  expandedContent: {
    marginTop: Spacing.md,
  },
  divider: {
    height: 1,
    marginBottom: Spacing.md,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: Spacing.xs,
  },
  lyricsText: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: Spacing.md,
  },
  actionButtons: {
    flexDirection: "row",
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  rejectButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  rejectButtonText: {
    color: "#EF4444",
    fontWeight: "600",
  },
  approveButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
  },
  approveButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    paddingTop: Spacing["5xl"],
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: Spacing.lg,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: Spacing.sm,
  },
});
