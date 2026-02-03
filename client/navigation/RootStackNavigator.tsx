import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import MainTabNavigator from "@/navigation/MainTabNavigator";
import SettingsScreen from "@/screens/SettingsScreen";
import AuthScreen from "@/screens/AuthScreen";
import SubmitHymnScreen from "@/screens/SubmitHymnScreen";
import AdminReviewScreen from "@/screens/AdminReviewScreen";
import DeleteAccountScreen from "@/screens/DeleteAccountScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";

export type RootStackParamList = {
  Main: undefined;
  Settings: undefined;
  Auth: undefined;
  SubmitHymn: undefined;
  AdminReview: undefined;
  DeleteAccount: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Main"
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          presentation: "modal",
          headerTitle: "Settings",
        }}
      />
      <Stack.Screen
        name="Auth"
        component={AuthScreen}
        options={{
          presentation: "modal",
          headerTitle: "Account",
        }}
      />
      <Stack.Screen
        name="SubmitHymn"
        component={SubmitHymnScreen}
        options={{
          presentation: "modal",
          headerTitle: "Submit Hymn",
        }}
      />
      <Stack.Screen
        name="AdminReview"
        component={AdminReviewScreen}
        options={{
          presentation: "modal",
          headerTitle: "Review Submissions",
        }}
      />
      <Stack.Screen
        name="DeleteAccount"
        component={DeleteAccountScreen}
        options={{
          presentation: "modal",
          headerTitle: "Delete Account",
        }}
      />
    </Stack.Navigator>
  );
}
