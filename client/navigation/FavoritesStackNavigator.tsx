import React from "react";
import { Pressable } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";

import FavoritesScreen from "@/screens/FavoritesScreen";
import HymnDetailScreen from "@/screens/HymnDetailScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";
import { useTheme } from "@/hooks/useTheme";
import { Spacing } from "@/constants/theme";

export type FavoritesStackParamList = {
  FavoritesHome: undefined;
  FavoriteHymnDetail: { hymnId: string };
};

const Stack = createNativeStackNavigator<FavoritesStackParamList>();

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

export default function FavoritesStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="FavoritesHome"
        component={FavoritesScreen}
        options={{
          headerTitle: "Favoris",
          headerRight: () => <SettingsButton />,
        }}
      />
      <Stack.Screen
        name="FavoriteHymnDetail"
        component={HymnDetailScreen}
        options={{
          headerTitle: "",
        }}
      />
    </Stack.Navigator>
  );
}
