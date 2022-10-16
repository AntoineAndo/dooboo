import React, { useState, useEffect } from "react";

import { StyleSheet, Platform, StatusBar } from "react-native";
import IntroNavigator from "./src/screens/IntroNavigator";
import { ConfigProvider } from "./src/providers/ConfigProvider";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

// Create a client
export const queryClient = new QueryClient();

export default function App() {
  return (
    <ConfigProvider>
      <QueryClientProvider client={queryClient}>
        <IntroNavigator />
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
