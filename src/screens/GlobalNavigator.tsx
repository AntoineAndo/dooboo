import React, { useEffect, useState } from "react";
import { NativeModules } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import IntroScreen from "./intro/IntroScreen";
import NavbarNavigator from "./MainNavigation/NavbarNavigator";
import { NavigationContainer } from "@react-navigation/native";
import { Config, useConfig } from "../providers/ConfigProvider";
import * as SplashScreen from "expo-splash-screen";
import Storage from "../lib/storage";
import { initializeTranslations } from "../hooks/translation";
import storage from "../lib/storage";
import { getCountries, supabase } from "../lib/supabase";
import { useAppState } from "../providers/AppStateProvider";
import OverlayComponent from "../components/OverlayComponent";
import { StatusBar, StyleSheet, View } from "react-native";
import { useAuth } from "../providers/AuthProvider";
import AddNavigator from "./AddFlow/AddNavigator";

import * as Font from "expo-font";
import ReportNavigation from "./MainNavigation/report/ReportNavigation";
import { Log } from "../utils/Log";

import { getTranslations } from "../lib/sanity";
import SplashScreenComponent from "../components/SplashScreenComponent";

const Stack = createNativeStackNavigator();

type Props = {};

function GlobalNavigator({}: Props): any {
  const [appIsReady, setAppIsReady] = useState(false);
  const { state, patchState } = useAppState();
  const { config, setConfig } = useConfig();
  const { auth, setAuth } = useAuth();

  const statusBarHeight =
    StatusBar.currentHeight != undefined ? StatusBar.currentHeight : 0;

  const styles = StyleSheet.create({
    app: {
      flex: 1,
      // paddingTop: StatusBar.currentHeight,
      // paddingTop: statusBarHeight,
      fontFamily: "Milliard-Medium",
      backgroundColor: "white",
    },
  });

  useEffect(() => {
    function loadResourcesAndDataAsync(cb: Function) {
      let locale: string;

      //Get user's locale from system settings
      if (NativeModules.SettingsManager == undefined) {
        //Android
        locale = NativeModules.I18nManager.localeIdentifier;
      } else {
        //IOS
        locale =
          NativeModules.SettingsManager.settings.AppleLocale ||
          NativeModules.SettingsManager.settings.AppleLanguages[0];
      }

      try {
        const countries = getCountries();
        const session = supabase.auth.getSession();
        const translations = getTranslations();
        const fonts = Font.loadAsync({
          "Milliard-Bold": require("assets/fonts/Milliard-Bold.otf"),
          "Milliard-Regular": require("assets/fonts/Milliard-Book.otf"),
          "Milliard-Light": require("assets/fonts/Milliard-Light.otf"),
          "Milliard-Medium": require("assets/fonts/Milliard-Medium.otf"),
        });

        //Get the configuration
        //@@ https://docs.expo.dev/archive/classic-updates/preloading-and-caching-assets/#pre-loading-and-caching-assets
        Storage.getData("config")
          .then((configuration) => {
            let configurationObject: Config = configuration;

            Promise.all([session, countries, fonts, translations])
              .then(([session, countries, fonts, translations]) => {
                //Get the default country
                const defaultCountry = countries.data.find(
                  (c: any) => c.default
                );

                //Session ?
                //If a session data is present in the stored config
                // then the session is refreshed so that the user remains logged in
                if (session.data != null && session.data.session != undefined) {
                  Log("Refreshing session");
                  supabase.auth
                    .refreshSession({
                      refresh_token: session.data.session.refresh_token,
                    })
                    .then((response: any) => {
                      if (response.error == null && response.data != null) {
                        Log("Session refreshed");
                        setAuth({
                          session: response.data.session,
                          user: {
                            id: response.data.user?.id,
                            phone: response.data.user?.phone,
                          },
                        });
                        return;
                      }

                      Log("Error refreshing the session", "error");
                      Log("Signing out");

                      //If there is an error during the session refresh
                      // then the user is signed out
                      supabase.auth.signOut();
                      setAuth({});
                    });
                }

                //If the stored configuration is empty
                //Then we assume that this is the first time the app is launched
                //So we initialize the configuration values
                //Which will then lead to the opening of the Intro screen
                // configuration=undefined
                if (
                  // true ||
                  configuration == undefined ||
                  Object.keys(configuration).length == 0
                ) {
                  //TODO
                  let language_code: string;
                  if (locale.indexOf("ko_") != -1) {
                    language_code = "kor";
                  } else {
                    language_code = "eng";
                  }

                  //Initial values
                  configurationObject = {
                    countryId: defaultCountry.id,
                    locale: locale.split("_").join("-"), //fr_FR to fr-FR
                    language_code: language_code,
                    isAppFirstLauched: false,
                    categories: [],
                    dropdownValues: {
                      categories: undefined,
                      countries: countries.data,
                    },
                    translations: translations,
                  };

                  storage.storeData(
                    "config",
                    JSON.stringify(configurationObject)
                  );
                } else {
                  //duplicate stored existing conf
                  configurationObject = configuration;

                  //Patch dropdown configuration values
                  // configurationObject.dropdownValues = {
                  //   categories: categories.data,
                  //   countries: countries.data,
                  // };

                  configurationObject.dropdownValues.countries = countries.data;

                  //Update translations
                  configurationObject.translations = translations;
                }
              })
              .catch((error) => {
                console.log(error);
              })
              .finally(() => {
                //Set the configuration object as the context value
                // so that it can be accessed everywhere in the app
                setConfig(configurationObject);
                cb(configurationObject);
              });
          })
          .catch((e) => {
            //Error get stored conf
            console.error(e);
          });
      } catch (e) {
        //@@ You might want to provide this error information to an error reporting service
        console.warn(e);
      }
    }

    loadResourcesAndDataAsync((configuration: Config) => {
      // Translation init
      initializeTranslations(
        configuration.language_code as string,
        configuration.translations
      );

      setAppIsReady(true);

      SplashScreen.hideAsync();
    });
  }, []);

  //While the app isnt ready the splash screen is displayed
  //TODO
  if (!appIsReady) {
    return <SplashScreenComponent />;
  }

  return (
    <View style={styles.app}>
      {state.isLoading && <OverlayComponent />}
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Intro"
          screenOptions={{
            headerShown: false,
          }}
        >
          {(config.isAppFirstLauched == undefined || //If the app was never launched
            config.isAppFirstLauched == false) && ( // the Intro Screen is added to the navigator
            <Stack.Screen name="Intro" component={IntroScreen} />
          )}

          <Stack.Screen name="Navbar" component={NavbarNavigator} />

          {auth.session != undefined && (
            <Stack.Screen name="AddNavigation" component={AddNavigator} />
          )}
          <Stack.Screen name="Report" component={ReportNavigation} />
          {/* <Stack.Screen name="Report" component={ReportNavigation} /> */}
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

export default GlobalNavigator;
