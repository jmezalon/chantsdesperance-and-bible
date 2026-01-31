import React, { useState } from "react";
import {
  View,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { ThemedText } from "@/components/ThemedText";
import { Modal } from "@/components/Modal";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius } from "@/constants/theme";
import { apiRequest } from "@/lib/query-client";

interface ModalState {
  visible: boolean;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  confirmAction?: () => void;
  showConfirm?: boolean;
}

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
  const { theme } = useTheme();
  const queryClient = useQueryClient();

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState>({
    visible: false,
    type: "info",
    title: "",
    message: "",
  });

  const closeModal = () => {
    setModal((prev) => ({ ...prev, visible: false, confirmAction: undefined }));
  };

  const { data: submissions, isLoading, refetch } = useQuery<Submission[]>({
    queryKey: ["/api/submissions/pending"],
  });

  const reviewMutation = useMutation({
    mutationFn: async ({ id, action, note }: { id: string; action: string; note?: string }) => {
      const response = await apiRequest("POST", `/api/submissions/${id}/review`, { action, note });
      if (!response.ok) {
        throw new Error("Review failed");
      }
      return { action };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/submissions/pending"] });
      queryClient.invalidateQueries({ queryKey: ["hymns"] });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setModal({
        visible: true,
        type: "success",
        title: data.action === "approve" ? "Hymn Approved" : "Submission Rejected",
        message: data.action === "approve"
          ? "The hymn has been published and is now available."
          : "The submission has been rejected.",
      });
    },
    onError: (error: any) => {
      setModal({
        visible: true,
        type: "error",
        title: "Review Failed",
        message: error.message || "Something went wrong. Please try again.",
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    },
  });

  const handleReview = (id: string, action: "approve" | "reject") => {
    setModal({
      visible: true,
      type: action === "approve" ? "info" : "warning",
      title: `${action === "approve" ? "Approve" : "Reject"} Submission?`,
      message: action === "approve"
        ? "This hymn will be published and available to all users."
        : "This submission will be rejected and the submitter will be notified.",
      showConfirm: true,
      confirmAction: () => {
        reviewMutation.mutate({ id, action });
      },
    });
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
      <Modal
        visible={modal.visible}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        buttons={
          modal.showConfirm
            ? [
                { text: "Cancel", onPress: closeModal },
                {
                  text: "Confirm",
                  primary: true,
                  onPress: () => {
                    closeModal();
                    if (modal.confirmAction) {
                      modal.confirmAction();
                    }
                  },
                },
              ]
            : [{ text: "OK", primary: true, onPress: closeModal }]
        }
        onClose={closeModal}
      />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: headerHeight + Spacing.lg,
            paddingBottom: insets.bottom + Spacing.xl,
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
