import React, { useState, useEffect } from "react";

import { StyleSheet, Platform, StatusBar } from "react-native";
import IntroNavigator from "./src/screens/IntroNavigator";
import { ConfigProvider } from "./src/providers/ConfigProvider";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import {
  MD3LightTheme as DefaultTheme,
  Provider as PaperProvider,
} from "react-native-paper";

//Theme configuration
const themeConfig = {
  ...DefaultTheme,
  roundness: 2,
  version: 3 | 2,
  colors: {
    ...DefaultTheme.colors,
    primary: "#36D399",
    secondary: "tomato",
    tertiary: "pink",
  },
};

// Create a client
export const queryClient = new QueryClient();

export default function App() {
  return (
    <ConfigProvider>
      <QueryClientProvider client={queryClient}>
        <PaperProvider theme={themeConfig}>
          <IntroNavigator />
        </PaperProvider>
      </QueryClientProvider>
    </ConfigProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
