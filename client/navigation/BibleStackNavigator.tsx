import React from "react";
import { Pressable } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";

import BibleScreen from "@/screens/BibleScreen";
import BibleReaderScreen from "@/screens/BibleReaderScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";
import { useTheme } from "@/hooks/useTheme";
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

  return (
    <Pressable
      onPress={() => navigation.navigate("Settings")}
      style={{ padding: Spacing.sm }}
    >
      <Feather name="settings" size={22} color={theme.text} />
    </Pressable>
  );
}

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
