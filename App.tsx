import React, { FunctionComponent } from "react";

import { StatusBar } from "react-native";
import GlobalNavigator from "./src/screens/GlobalNavigator";
import { ConfigProvider } from "./src/providers/ConfigProvider";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import { AppStateProvider } from "./src/providers/AppStateProvider";
import { AuthProvider } from "./src/providers/AuthProvider";
import ErrorBoundary from "./src/components/ErrorBoundary";

import * as Sentry from "sentry-expo";
import { NetworkProvider } from "./src/providers/NetworkProvider";
import { SafeAreaProvider } from "react-native-safe-area-view";
import * as SplashScreen from "expo-splash-screen";

import Constants from "expo-constants";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useTranslation } from "./src/hooks/translation";

//Theme configuration
const themeConfig = {
  ...DefaultTheme,
  roundness: 2,
  version: 3 | 2,
  colors: {
    ...DefaultTheme.colors,
    primary: "#36D399",
    secondary: "tomato",
    accent: "red",
  },
};

// Create a client
export const queryClient = new QueryClient();

//Init Sentry
Sentry.init({
  dsn: "https://88b7032c0bd24d4ba9cb334de5920fd2@o4504234172350464.ingest.sentry.io/4504234175102976",
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production.
  enableInExpoDevelopment: true,
  debug: true,
  tracesSampleRate: 1.0,
  enableNative: !Constants?.expoConfig?.extra?.IS_DEV_CLIENT ?? false, //Enable native if not in dev mode
});

//Hold splash screen
SplashScreen.preventAutoHideAsync();

type TranslationChildren = (translate: Function) => any;

interface ITranslationProps {
  children: TranslationChildren;
}

export const TranslationComponent: FunctionComponent<ITranslationProps> = ({
  children,
}) => {
  const { translate } = useTranslation();

  return children(translate);
};

export default Sentry.Native.wrap(function App() {
  //Used to provide the error boundary with the translation hook
  //because it is a class component and cannot access it
  const { translate } = useTranslation();

  return (
    <ErrorBoundary translate={translate}>
      <ConfigProvider>
        <NetworkProvider>
          <AppStateProvider>
            <QueryClientProvider client={queryClient}>
              <PaperProvider theme={themeConfig}>
                <AuthProvider>
                  <SafeAreaProvider>
                    <GestureHandlerRootView style={{ flex: 1 }}>
                      <StatusBar translucent backgroundColor={"transparent"} />
                      <GlobalNavigator />
                    </GestureHandlerRootView>
                  </SafeAreaProvider>
                </AuthProvider>
              </PaperProvider>
            </QueryClientProvider>
          </AppStateProvider>
        </NetworkProvider>
      </ConfigProvider>
    </ErrorBoundary>
  );
});
