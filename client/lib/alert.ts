import { Alert, Platform } from "react-native";

type AlertButton = {
  text: string;
  onPress?: () => void;
};

export function showAlert(
  title: string,
  message: string,
  buttons?: AlertButton[]
): void {
  if (Platform.OS === "web") {
    // On web, use window.alert for simple alerts
    // or window.confirm if there are action buttons
    const fullMessage = `${title}\n\n${message}`;

    if (buttons && buttons.length > 0) {
      const confirmed = window.confirm(fullMessage);
      if (confirmed && buttons[0]?.onPress) {
        buttons[0].onPress();
      }
    } else {
      window.alert(fullMessage);
    }
  } else {
    // On native, use React Native's Alert
    Alert.alert(title, message, buttons);
  }
}
