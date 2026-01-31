import React from "react";
import { Pressable, View, StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";

import HymnsScreen from "@/screens/HymnsScreen";
import HymnDetailScreen from "@/screens/HymnDetailScreen";
import HymnSectionScreen from "@/screens/HymnSectionScreen";
import { HeaderTitle } from "@/components/HeaderTitle";
import { ThemedText } from "@/components/ThemedText";
import { useScreenOptions } from "@/hooks/useScreenOptions";
import { useTheme } from "@/hooks/useTheme";
import { usePendingCount } from "@/hooks/usePendingCount";
import { Spacing } from "@/constants/theme";

export type HymnsStackParamList = {
  HymnsHome: undefined;
  HymnDetail: { hymnId: string };
  HymnSection: { sectionId: number; sectionName: string };
};

const Stack = createNativeStackNavigator<HymnsStackParamList>();

function SettingsButton() {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const pendingCount = usePendingCount();

  return (
    <Pressable
      onPress={() => navigation.navigate("Settings")}
      style={{ padding: Spacing.sm }}
    >
      <Feather name="settings" size={22} color={theme.text} />
      {pendingCount > 0 && (
        <View style={styles.badge}>
          <ThemedText style={styles.badgeText}>
            {pendingCount > 99 ? "99+" : pendingCount}
          </ThemedText>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    top: 2,
    right: 2,
    backgroundColor: "#EF4444",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
});

export default function HymnsStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="HymnsHome"
        component={HymnsScreen}
        options={{
          headerTitle: () => <HeaderTitle title="Chants d'Espérance" />,
          headerRight: () => <SettingsButton />,
        }}
      />
      <Stack.Screen
        name="HymnDetail"
        component={HymnDetailScreen}
        options={{
          headerTitle: "",
        }}
      />
      <Stack.Screen
        name="HymnSection"
        component={HymnSectionScreen}
        options={{
          headerTitle: "",
        }}
      />
    </Stack.Navigator>
  );
}
