import React from "react";
import { Pressable } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";

import HymnsScreen from "@/screens/HymnsScreen";
import HymnDetailScreen from "@/screens/HymnDetailScreen";
import HymnSectionScreen from "@/screens/HymnSectionScreen";
import { HeaderTitle } from "@/components/HeaderTitle";
import { useScreenOptions } from "@/hooks/useScreenOptions";
import { useTheme } from "@/hooks/useTheme";
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

  return (
    <Pressable
      onPress={() => navigation.navigate("Settings")}
      style={{ padding: Spacing.sm }}
    >
      <Feather name="settings" size={22} color={theme.text} />
    </Pressable>
  );
}

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
