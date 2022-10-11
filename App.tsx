import React, { useState, useEffect } from "react";

import { StyleSheet, Platform, StatusBar } from "react-native";
import { useDimensions } from "@react-native-community/hooks";
import * as SplashScreen from "expo-splash-screen";
import RootNavigator from "./src/screens/RootNavigator";
import { storeData, getAllConfiguration, clearData } from "./src/lib/storage";

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();
        const configuration = getAllConfiguration();
        //https://docs.expo.dev/archive/classic-updates/preloading-and-caching-assets/#pre-loading-and-caching-assets

        await configuration.then((data) => {
          console.log(data);
          if (data && data.length == 0) {
            storeData("country", "1");
          }
          // clearData();
        });

        // await Promise.all([configuration]).then((data) => {
        //   if(data)
        // });
      } catch (e) {
        // You might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setAppIsReady(true);
        SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  if (!appIsReady) {
    return null;
  }

  return <RootNavigator />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
