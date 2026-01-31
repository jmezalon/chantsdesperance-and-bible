import React from "react";
import { Pressable, View, StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";

import BibleScreen from "@/screens/BibleScreen";
import BibleReaderScreen from "@/screens/BibleReaderScreen";
import { ThemedText } from "@/components/ThemedText";
import { useScreenOptions } from "@/hooks/useScreenOptions";
import { useTheme } from "@/hooks/useTheme";
import { usePendingCount } from "@/hooks/usePendingCount";
import { Spacing } from "@/constants/theme";

export type BibleStackParamList = {
  BibleHome: undefined;
  BibleReader: {
    bookId: number;
    bookName: string;
    chapter: number;
    version: string;
  };
};

const Stack = createNativeStackNavigator<BibleStackParamList>();

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

export default function BibleStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="BibleHome"
        component={BibleScreen}
        options={{
          headerTitle: "Bible",
          headerRight: () => <SettingsButton />,
        }}
      />
      <Stack.Screen
        name="BibleReader"
        component={BibleReaderScreen}
        options={{
          headerTitle: "",
        }}
      />
    </Stack.Navigator>
  );
}
