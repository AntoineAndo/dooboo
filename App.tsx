import React, { useState, useEffect } from "react";

import { StyleSheet, Platform, StatusBar } from "react-native";
import GlobalNavigator from "./src/screens/GlobalNavigator";
import { ConfigProvider } from "./src/providers/ConfigProvider";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import { AppStateProvider } from "./src/providers/AppStateProvider";
import { AuthProvider } from "./src/providers/AuthProvider";
import ErrorBoundary from "./src/components/ErrorBoundary";

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
    <ErrorBoundary>
      <ConfigProvider>
        <AppStateProvider>
          <QueryClientProvider client={queryClient}>
            <PaperProvider theme={themeConfig}>
              <AuthProvider>
                <GlobalNavigator />
              </AuthProvider>
            </PaperProvider>
          </QueryClientProvider>
        </AppStateProvider>
      </ConfigProvider>
    </ErrorBoundary>
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
