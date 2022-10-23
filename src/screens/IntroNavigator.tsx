import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import IntroScreen from "./intro/IntroScreen";
import NavbarNavigator from "./MainNavigation/NavbarNavigator";
import { NavigationContainer } from "@react-navigation/native";
import { Config, useConfig } from "../providers/ConfigProvider";
import * as SplashScreen from "expo-splash-screen";
import Storage from "./../../src/lib/storage";
import { initializeTranslations } from "./../../src/hooks/translation";
import { KeyValuePair } from "@react-native-async-storage/async-storage/lib/typescript/types";
import storage from "./../../src/lib/storage";
import { getDefaultCountry } from "../lib/supabase";

const Stack = createNativeStackNavigator();

type Props = {};

function IntroNavigator({}: Props): any {
  const [appIsReady, setAppIsReady] = useState(false);
  const { config, setConfig } = useConfig();

  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        //Override splashscreen behaviour
        SplashScreen.preventAutoHideAsync();

        //Get the configuration
        //@@ https://docs.expo.dev/archive/classic-updates/preloading-and-caching-assets/#pre-loading-and-caching-assets
        const configuration = Storage.getData("config");
        const defaultCountry = getDefaultCountry();
        await Promise.all([configuration, defaultCountry]).then(
          ([configuration, defaultCountryResult]) => {
            let configurationObject: Config;

            if (defaultCountryResult.data == null) {
              console.error("An error occured");
              return;
            }

            const defaultCountry = defaultCountryResult.data[0];
            // configuration = undefined;

            //If the stored configuration is empty
            //Then we assume that this is the first time the app is launched
            //So we initialize the configuration values
            //Which will then lead to the opening of the Intro screen
            if (
              configuration == undefined ||
              Object.keys(configuration).length == 0
            ) {
              //Initial values
              configurationObject = {
                country: defaultCountry,
                language_code: "en",
                isAppFirstLauched: false,
              };

              storage.storeData("config", JSON.stringify(configurationObject));
            } else {
              configurationObject = configuration;
            }

            //Set the configuration object as the context value
            // so that it can be accessed everywhere in the app
            setConfig(configurationObject);

            // Translation init
            initializeTranslations(configurationObject.language_code as string);
          }
        );
      } catch (e) {
        //@@ You might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setAppIsReady(true);
        SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  //While the app isnt ready the splash screen is displayed
  //TODO
  if (!appIsReady) {
    //Return the splash screen here
    return null;
  }

  //Once the configuration is loaded
  //The navigation is rendered
  if (
    config.isAppFirstLauched == undefined ||
    config.isAppFirstLauched == false
  ) {
    //If the app has never been launched
    //then the IntroScreen is loaded and displayed by default
    return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Intro"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Intro" component={IntroScreen} />
          <Stack.Screen name="Navbar" component={NavbarNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  } else {
    return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Navbar"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Navbar" component={NavbarNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default IntroNavigator;
