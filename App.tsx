import React, { useState, useEffect } from "react";

import { StyleSheet, Platform, StatusBar } from "react-native";
import GlobalNavigator from "./src/screens/GlobalNavigator";
import { ConfigProvider } from "./src/providers/ConfigProvider";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import { AppStateProvider } from "./src/providers/AppStateProvider";
import { AuthProvider } from "./src/providers/AuthProvider";
import ErrorBoundary from "./src/components/ErrorBoundary";

import * as Sentry from "@sentry/react-native";

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

//Init Sentry
Sentry.init({
  dsn: "https://88b7032c0bd24d4ba9cb334de5920fd2@o4504234172350464.ingest.sentry.io/4504234175102976",
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production.
  tracesSampleRate: 1.0,
  enableNative: false,
});

export default Sentry.wrap(function App() {
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
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
