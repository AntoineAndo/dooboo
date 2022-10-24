import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import IntroScreen from "./intro/IntroScreen";
import NavbarNavigator from "./MainNavigation/NavbarNavigator";
import { NavigationContainer } from "@react-navigation/native";
import { Config, useConfig } from "../providers/ConfigProvider";
import * as SplashScreen from "expo-splash-screen";
import Storage from "../lib/storage";
import { initializeTranslations } from "../hooks/translation";
import storage from "../lib/storage";
import { getDefaultCountry } from "../lib/supabase";
import AddScreen4 from "./MainNavigation/add/AddStep4/AddScreen4";
import { useAppState } from "../providers/AppStateProvider";
import OverlayComponent from "../components/OverlayComponent";

const Stack = createNativeStackNavigator();

type Props = {};

function GlobalNavigator({}: Props): any {
  const [appIsReady, setAppIsReady] = useState(false);
  const app = useAppState();
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

  return (
    <>
      {app.state.isLoading && <OverlayComponent />}
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Intro"
          screenOptions={{ headerShown: false }}
        >
          {(config.isAppFirstLauched == undefined || //If the app was never launched
            config.isAppFirstLauched == false) && ( // the Intro Screen is added to the navigator
            <Stack.Screen name="Intro" component={IntroScreen} />
          )}

          <Stack.Screen name="Navbar" component={NavbarNavigator} />
          <Stack.Screen name="AddStep4" component={AddScreen4} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

export default GlobalNavigator;
