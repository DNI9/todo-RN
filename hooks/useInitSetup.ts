import { db, expoDb } from "@/db/client";
import migrations from "@/drizzle/migrations";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { useFonts } from "expo-font";
import { SplashScreen } from "expo-router";
import { useEffect } from "react";

export function useInitSetup() {
  const [fontsLoaded, loadingFontsError] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  const { success: migrationSuccess, error: migrationError } = useMigrations(
    db,
    migrations
  );

  useEffect(() => {
    if (loadingFontsError) throw loadingFontsError;
    if (migrationError) throw migrationError;
  }, [loadingFontsError, migrationError]);

  useEffect(() => {
    if (fontsLoaded && migrationSuccess) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, migrationSuccess]);

  useEffect(() => {
    return () => {
      console.log("Closing database...");
      expoDb?.closeSync();
    };
  }, []);

  return { isSetupDone: fontsLoaded && migrationSuccess };
}
