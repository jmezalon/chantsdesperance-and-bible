import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Platform, StyleSheet } from "react-native";

import HymnsStackNavigator from "@/navigation/HymnsStackNavigator";
import BibleStackNavigator from "@/navigation/BibleStackNavigator";
import FavoritesStackNavigator from "@/navigation/FavoritesStackNavigator";
import { useTheme } from "@/hooks/useTheme";

export type MainTabParamList = {
  HymnsTab: undefined;
  BibleTab: undefined;
  FavoritesTab: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <Tab.Navigator
      initialRouteName="HymnsTab"
      screenOptions={{
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.tabIconDefault,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: Platform.select({
            ios: "transparent",
            android: theme.backgroundRoot,
          }),
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarBackground: () =>
          Platform.OS === "ios" ? (
            <BlurView
              intensity={100}
              tint={isDark ? "dark" : "light"}
              style={StyleSheet.absoluteFill}
            />
          ) : null,
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="HymnsTab"
        component={HymnsStackNavigator}
        options={{
          title: "Cantiques",
          tabBarIcon: ({ color, size }) => (
            <Feather name="music" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="BibleTab"
        component={BibleStackNavigator}
        options={{
          title: "Bible",
          tabBarIcon: ({ color, size }) => (
            <Feather name="book-open" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="FavoritesTab"
        component={FavoritesStackNavigator}
        options={{
          title: "Favoris",
          tabBarIcon: ({ color, size }) => (
            <Feather name="heart" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
