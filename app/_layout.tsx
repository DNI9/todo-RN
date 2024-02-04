import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Link, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import "@/global.css";
import { useInitSetup } from "@/hooks/useInitSetup";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

// Catch any errors thrown by the Layout component.
export { ErrorBoundary } from "expo-router";

// Ensure that reloading on `/modal` keeps a back button present.
export const unstable_settings = {
  initialRouteName: "index",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { isSetupDone } = useInitSetup();
  if (!isSetupDone) return null;

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              headerTitle: "Todos",
              headerRight: () => (
                <Link href="/search" asChild>
                  <TouchableOpacity onPress={() => {}}>
                    <Ionicons name="search" size={20} />
                  </TouchableOpacity>
                </Link>
              ),
            }}
          />
          <Stack.Screen name="search" options={{ headerTitle: "Search" }} />
        </Stack>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
